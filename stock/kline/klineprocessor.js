var klineutil = require("./klineutil");
var moneyflowforms = require("./form/moneyflowforms");
var moneyflowio = require("../moneyflow/io").config();

var klineio;
var klineformanalyser;
var minMatch = 2;

function config(start, end){
    klineio  = require("./klineio").config(start, end);
    klineformanalyser = require("./form/analyser").config({
        startDate: start,
        endDate: end,
        form: "./moneyflowforms"
    });

    return this;
}

function average(klineJson, field, interval, ignoreEx, valFun) {
    //console.log("average:", field, interval);
    var scaleSum = 0;
    var jsonLen = klineJson.length;
    var aveField = field+"_ave_"+interval;
    if (valFun===undefined) {
        valFun = function(klj, n) {
            return klj[n][field];
        }
    }
    for (var i= jsonLen-1; i>0; i--) {
        if (!ignoreEx && klineJson[i].exRightsDay) {
            scaleSum = scaleSum * (klineJson[i].open/klineJson[i-1].close);
        }
        scaleSum = scaleSum + valFun(klineJson, i);

        if (jsonLen-i === interval) {
            klineJson[jsonLen-1][aveField] = Math.round(1000*scaleSum/interval)/1000;
        } else if (jsonLen-i > interval) {
            scaleSum = scaleSum - valFun(klineJson, i+interval);
            klineJson[i+interval-1][aveField] = Math.round(1000*scaleSum/interval)/1000;

        }

    }
    
}

function exRightsDay(stockId, klineJson) {
    var jsonLen = klineJson.length;
    var rightJson = klineio.readKLineRightBaseSync(stockId);
    for (var i=1; i<jsonLen; i++) {
        var preclose = klineJson[i-1].close;        
        var prehigh = klineJson[i-1].high;
        var prelow = klineJson[i-1].low;

        var close = klineJson[i].close;
        var open = klineJson[i].open;
        var low = klineJson[i].low;
        var high = klineJson[i].high;
        var inc = klineutil.increase(preclose, open);

        var predate = klineJson[i-1].date;
        var date = klineJson[i].date;
        // if (!rightJson[date]) console.log(stockId, date)
        var rightinc = klineutil.increase(rightJson[predate].close, rightJson[date].open)//*rightJson[date].open/open;

        if (inc<-0.01 && rightinc-inc>0.003 || inc<-0.05 && rightinc>-0.03) {
            klineJson[i].exRightsDay = true;
            //console.log(stockId, date, open, rightJson[date].open, inc, rightinc);
        }

    }
}

function matchForms(kLineJson) {
    var jsonLen = kLineJson.length;
    var bullforms = klineformanalyser.kLineFormMethods();
     klineformanalyser.traverseForAppearance(bullforms, kLineJson, {
                formHandler: function(form, klineJson, i) {},
                formsHandler: function(forms, klineJson, i) {
                    klineJson[i].match = forms;
                }
            });
}

function winOrLose(kLineJson) {
    var jsonLen = kLineJson.length;
    for (var i=0; i<jsonLen; i++) {
        var inc_ave_8 = 0.48*kLineJson[i].amplitude_ave_8;
        if (!inc_ave_8) continue;

        var winStop = Math.min(5*inc_ave_8, 0.15);
        var lossStop = Math.max(-5*inc_ave_8, -0.15);
        
        var reObj = {};
        var rel = klineutil.winOrLoss(kLineJson, i, lossStop, winStop, 50, reObj);
              
        kLineJson[i].incStop = rel;
        kLineJson[i].winOrLose = rel>=winStop ? "win" : (rel<=lossStop?"lose":"pending");

        if (!kLineJson[i].match || kLineJson[i].match.length<minMatch) continue;

        //kLineJson[i].stopObj = reObj;
        for (var j=i; j<i+reObj.days; j++) {
            if (!kLineJson[j].pending) kLineJson[j].pending = 0;
            kLineJson[j].pending++;
        }

    }
}

function updateKLinesFromBase(match) {
    var stocks = klineio.getAllStockIds(match);
    //stocks = ["SH600012"];
     // stocks = ["SZ000420"];
    stocks.forEach(function(stockId) {
        klineio.readKLineBaseSync(stockId, processChain);   
    });
}

function updateKLinesFromAjax(callback) {
    klineio.readLatestKLineAjax(function(outputJson) {
        var stocks = klineio.getAllStockIds();
        
        stocks.forEach(function(stockId) {
            var kLineJson = klineio.readKLineSync(stockId); 
            if (kLineJson.length===0) {
                console.log(stockId)
                return;
            }
            var endDate = new Date(kLineJson[kLineJson.length-1].date);
            var latestJson = outputJson[stockId];
            if (!latestJson) {
                console.log("Error: no latestJson", stockId)
                return;
            }

            var latestDate = new Date(latestJson.date);
            if (latestJson.amount>0 && latestDate > endDate) {
                kLineJson.push(latestJson);
                processChain(stockId, kLineJson); 
            }
            
        });

        callback();
    });   
}

function mergeMoneyFlow(stockId, kLineJson) {
    var moneyFlowJson = moneyflowio.readMoneyFlowSync(stockId);
    var kllen = kLineJson.length;
    var mflen = moneyFlowJson.length;
    for (var i=1; i<=kllen && i<=mflen; i++) {
        var klj = kLineJson[kllen-i];
        var mfj = moneyFlowJson[mflen-i];

        if (klj.date !== mfj.opendate) {
            if (mfj.opendate !=="03/01/2010")
                 console.log("mergeMoneyFlow error:", stockId, i, klj.date, mfj.opendate, mfj);
            break;
        } else {
            klj.turnover = mfj.turnover;
            klj.netamount = mfj.netamount;
            klj.ratioamount = mfj.ratioamount;
            klj.r0_net = mfj.r0_net;
            klj.r0_ratio = mfj.r0_ratio;

        }

    }

}

function processMoneyFlow(kLineJson) {
    var jsonLen = kLineJson.length;
    for (var i=jsonLen-1; i>0; i--) {
        processDayMoneyFlow(kLineJson, i);
    }
}

function processDayMoneyFlow(klineJson, i) {
    var sec = 150;
    if (i<sec) return false;
    if (klineJson[i-sec].r0_net===undefined) return false;

    var netsum_r0 = 0;
    var netsum_r0x = 0;

    var netsummin_r0x = 100000000000;
    var netsummin_r0x_5 = 0, netsummin_r0x_10 = 0, netsummin_r0x_20 = 0, netsummin_r0x_40 = 0;

    var netsummax_r0x = -100000000000;
    var netsummax_r0x_5 = 0, netsummax_r0x_10 = 0, netsummax_r0x_20 = 0, netsummax_r0x_40 = 0;

    var netsummax_r0_r0x = -100000000000;

    var netsummax_r0 = -100000000000;
    var netsummax_r0_5 = 0, netsummax_r0_10 = 0, netsummax_r0_20 = 0, netsummax_r0_40 = 0;


    var netsummin_r0 = 100000000000;
    var netsummin_r0_5 = 0, netsummin_r0_10 = 0, netsummin_r0_20 = 0, netsummin_r0_40 = 0;


    var netsum_r0_above = 0, netsum_r0_below = 0;
    var netsum_r0_above_60 = 0, netsum_r0_below_60 = 0;
    var netsum_r0x_above = 0, netsum_r0x_below = 0;
    var netsum_r0x_above_60 = 0, netsum_r0x_below_60 = 0;

    var currentprice = klineJson[i].close;
    var netsummax_idx_r0 = -1, netsummax_idx_r0_r0x = -1;

    for (var j = i; j>=0 && i-j<=sec; j--) {
        var klj = klineJson[j];
        
        if (i-j === 5) {
            klineJson[i].netsum_r0_5 = netsum_r0;
            klineJson[i].netsum_r0x_5 = netsum_r0x;
            netsummax_r0_5 = netsummax_r0;
            netsummin_r0_5 = netsummin_r0;
            netsummin_r0x_5 = netsummin_r0x;
            netsummax_r0x_5 = netsummax_r0x
        } else if (i-j === 10) {
            klineJson[i].netsum_r0_10 = netsum_r0;
            klineJson[i].netsum_r0x_10 = netsum_r0x;
            netsummax_r0_10 = netsummax_r0;
            netsummin_r0_10 = netsummin_r0;
            netsummin_r0x_10 = netsummin_r0x;
            netsummax_r0x_10 = netsummax_r0x
        } else if (i-j === 20) {
            klineJson[i].netsum_r0_20 = netsum_r0;
            klineJson[i].netsum_r0x_20 = netsum_r0x;
            netsummax_r0_20 = netsummax_r0;
            netsummin_r0_20 = netsummin_r0;
            netsummin_r0x_20 = netsummin_r0x;
            netsummax_r0x_20 = netsummax_r0x
        } else if (i-j === 40) {
            klineJson[i].netsum_r0_40 = netsum_r0;
            klineJson[i].netsum_r0x_40 = netsum_r0x;

            netsummax_r0_40 = netsummax_r0;
            netsummin_r0_40 = netsummin_r0;
            netsummin_r0x_40 = netsummin_r0x;
            netsummax_r0x_40 = netsummax_r0x
        } else if (i-j === 80) {
            klineJson[i].netsum_r0_80 = netsum_r0;
            klineJson[i].netsum_r0x_80 = netsum_r0x;

            netsummax_r0_80 = netsummax_r0;
            netsummin_r0_80 = netsummin_r0;
            netsummin_r0x_80 = netsummin_r0x;
            netsummax_r0x_80 = netsummax_r0x
        }


        var r0x_net = klj.netamount-klj.r0_net;

        netsum_r0 += klj.r0_net;
        netsum_r0x += r0x_net;

        if (netsum_r0+netsum_r0x > netsummax_r0_r0x) {
            netsummax_r0_r0x = netsum_r0+netsum_r0x;
            netsummax_idx_r0_r0x = j;
        }

        if (netsum_r0 < netsummin_r0) {
            netsummin_r0 = netsum_r0;
        }

        if (netsum_r0 > netsummax_r0) {
            netsummax_r0 = netsum_r0;
            netsummax_idx_r0 = j;
            netsummax_r0_netsum_r0x = netsum_r0x;
        }

        if (netsum_r0x < netsummin_r0x) {
            netsummin_r0x = netsum_r0x;
        }

        if (netsum_r0x > netsummax_r0x) {
            netsummax_r0x = netsum_r0x;
        }

    }

    if (netsummax_idx_r0===-1) console.log("error netsummax_idx_r0 should not be -1");
    
    for (var m = i; m>=netsummax_idx_r0; m--) {
        var klj = klineJson[m];

        var r0x_net = klj.netamount-klj.r0_net;
        if (klineJson.length>m+1 && klineJson[m+1].exRightsDay) {
            currentprice = currentprice*klineJson[m].close/klineJson[m+1].open
            //if (klineJson[i].date==="07/21/2014") console.log("---------", klineJson[m+1].date, currentprice)
        }

        var midprice = (klj.high+klj.low)/2;
        if (midprice>currentprice) {
            netsum_r0_above += klj.r0_net;
            netsum_r0x_above += r0x_net;
            if (i-m<60) {
                netsum_r0_above_60 += klj.r0_net;
                netsum_r0x_above_60 += r0x_net;
            }
        }

        if (midprice<currentprice) {
            netsum_r0_below += klj.r0_net;
            netsum_r0x_below += r0x_net;
            if (i-m<60) {
                netsum_r0_below_60 += klj.r0_net;
                netsum_r0x_below_60 += r0x_net;
            }
        }
    }

    var obj = klineJson[i];

    obj.netsummax_r0_r0x = netsummax_r0_r0x;
    obj.netsummax_r0_r0x_duration = i-netsummax_idx_r0_r0x;

    obj.netsummax_r0_duration = i-netsummax_idx_r0;
    obj.netsummax_r0_netsum_r0x = netsummax_r0_netsum_r0x;
    obj.netsummax_r0 = netsummax_r0;
    obj.netsummax_r0_5 = netsummax_r0_5;
    obj.netsummax_r0_10 = netsummax_r0_10;
    obj.netsummax_r0_20 = netsummax_r0_20;
    obj.netsummax_r0_40 = netsummax_r0_40;
    
    obj.netsummin_r0 =  netsummin_r0;
    obj.netsummin_r0_5 =  netsummin_r0_5;
    obj.netsummin_r0_10 =  netsummin_r0_10;
    obj.netsummin_r0_20 =  netsummin_r0_20;
    obj.netsummin_r0_40 =  netsummin_r0_40;

    obj.netsummax_r0x = netsummax_r0x;
    obj.netsummax_r0x_5 = netsummax_r0x_5;
    obj.netsummax_r0x_10 = netsummax_r0x_10;
    obj.netsummax_r0x_20 = netsummax_r0x_20;
    obj.netsummax_r0x_40 = netsummax_r0x_40;

    obj.netsummin_r0x =  netsummin_r0x;
    obj.netsummin_r0x_5 =  netsummin_r0x_5;
    obj.netsummin_r0x_10 =  netsummin_r0x_10;
    obj.netsummin_r0x_20 =  netsummin_r0x_20;
    obj.netsummin_r0x_40 =  netsummin_r0x_40;

    obj.netsum_r0_above = netsum_r0_above;
    obj.netsum_r0_above_60 = netsum_r0_above_60;
    obj.netsum_r0_below = netsum_r0_below;
    obj.netsum_r0_below_60 = netsum_r0_below_60;

    obj.netsum_r0x_above = netsum_r0x_above;
    obj.netsum_r0x_above_60 = netsum_r0x_above_60;
    obj.netsum_r0x_below = netsum_r0x_below;
    obj.netsum_r0x_below_60 = netsum_r0x_below_60;

    obj.marketCap = obj.close*obj.volume/(obj.turnover/10000)
    //console.log("netsummax_days<20", klineJson[i].amount_ave_8, klineJson[i].amount_ave_21)

}

function processChain(stockId, kLineJson) {
    exRightsDay(stockId, kLineJson);
    average(kLineJson, "close", 8);
    average(kLineJson, "close", 21);
    average(kLineJson, "close", 55);
    average(kLineJson, "close", 144);
    average(kLineJson, "close", 233);
    average(kLineJson, "volume", 8, true);
    average(kLineJson, "volume", 21, true);
    average(kLineJson, "amount", 8, true);
    average(kLineJson, "amount", 21, true);


    average(kLineJson, "amplitude", 8, true, function (klj, n) { 
        var kl = klj[n];
        return klineutil.increase(kl.low, kl.high);
    });
    average(kLineJson, "amplitude", 21, true, function (klj, n) { 
        var kl = klj[n];
        return klineutil.increase(kl.low, kl.high);
    });
    average(kLineJson, "amplitude", 55, true, function (klj, n) {
        var kl = klj[n];
        return klineutil.increase(kl.low, kl.high);
    });

    average(kLineJson, "inc", 8, true, function (klj, n) {
        if (n===0) return 0;
        var klc = klj[n].close;
        var klc1 = klj[n-1].close;
        if (klj[n].exRightsDay) {
            klc1 = klc1*(klj[n].open/klj[n-1].close);
        }
        return Math.abs(klineutil.increase(klc1, klc));
    });

    average(kLineJson, "inc", 21, true, function (klj, n) {
        if (n===0) return 0;
        var klc = klj[n].close;
        var klc1 = klj[n-1].close;
        if (klj[n].exRightsDay) {
            klc1 = klc1*(klj[n].open/klj[n-1].close);
        }
        return Math.abs(klineutil.increase(klc1, klc));
    });
    //console.log(stockId);
    mergeMoneyFlow(stockId, kLineJson);
    processMoneyFlow(kLineJson);

    average(kLineJson, "turnover", 8, true);
    average(kLineJson, "turnover", 21, true);

    matchForms(kLineJson);
    winOrLose(kLineJson);
    

    klineio.writeKLineSync(stockId, kLineJson);
  }
exports.config = config;
exports.updateKLinesFromBase = updateKLinesFromBase;
exports.updateKLinesFromAjax = updateKLinesFromAjax;

//exports.average = average;
exports.exRightsDay = exRightsDay;