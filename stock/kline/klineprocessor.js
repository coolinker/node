var klineutil = require("./klineutil");
var intersectionprocessor = require("./form/intersectionprocessor").config(1);
var moneyflowforms = require("./form/moneyflowforms");
var moneyflowio = require("../moneyflow/io").config();

var klineio;
var klineformanalyser;

function config(start, end){
    klineio  = require("./klineio").config(start, end);
    klineformanalyser = require("./form/analyser").config({
        startDate: start,
        endDate: end
    });

    return this;
}

function highCeilBoxCompare(json1, json2, midValue, offset) {
    var low = midValue - offset;
    var high = midValue + offset;
    var entityHigh1 = json1.high;
    var entityHigh2 = Math.max(json2.close, json2.open);

    var hh = klineutil.inBetween(klineutil.increase(json1.high, json2.high), low, high);
    var ch = klineutil.inBetween(klineutil.increase(entityHigh1, json2.high), low, high);
    var hc = klineutil.inBetween(klineutil.increase(json1.high, entityHigh2), low, high);
    var cc = klineutil.inBetween(klineutil.increase(entityHigh1, entityHigh2), low, high);

  
    if (hh===0 || ch ===0 || hc===0 || cc === 0) return 0;
    if (hh>0) return 1;
    return -1;

}

function markBoxs(klineJson, peakValueField, peakFlag, compareFun) {
    var len = klineJson.length;
    var peaks = [];

    for (var i=0; i<len; i++) {
        if (klineJson[i][peakFlag]) {
            peaks.push(klineJson[i]);
        }
    }

    len = peaks.length;
    for (var m=len-1; m>=0; m--) {
        var startJson = peaks[m];
        var results = [startJson.date];
        for (var n=m-1; n>=0; n--) {
            var curJson = peaks[n];
            var compare = compareFun(startJson, curJson);
            if (compare === 0) {
                results.push(curJson.date);
            } else if (compare > 0) {
                break;
            }
        }


        if (results.length>1) {
            startJson[peakValueField+"Box"+compareFun.name] = results;
            console.log("results", results)
        }
    }
}

function mergeTroughs(klineJson, field, interval, threshold) {
    var troughField = field+"_trough";
    var lastTroughIdx = -1;
    var peakIdxInBetween = 0;

    for (var i=0; i<klineJson.length; i++) {
        
        if (klineJson[peakIdxInBetween].low < klineJson[i].low) {
            peakIdxInBetween = i;
        }

        if (klineJson[i][troughField]!==true) {
            continue;
        }
        
        if (lastTroughIdx===-1) {
            lastTroughIdx = i;
            peakIdxInBetween = lastTroughIdx;
        } else {

            if (i - lastTroughIdx <= interval) {
                var j=i+1;
                for (; j<klineJson.length; j++) {
                    if (klineJson[j][troughField]===true) {
                        break;
                    }
                }
            
                if (j===klineJson.length) break;

                if (i - lastTroughIdx <= j-i) {
                    if(klineJson[lastTroughIdx].low <= klineJson[i].low){
                        delete klineJson[i][troughField];
                    } else {
                        delete klineJson[lastTroughIdx][troughField];
                        lastTroughIdx = i;
                        peakIdxInBetween = lastTroughIdx;
                    } 
                } else {
                    if(klineJson[i].low <= klineJson[j].low){
                        delete klineJson[j][troughField];
                        i--;
                    } else {
                        delete klineJson[i][troughField];
                    }
                }
                
            } else {
                lastTroughIdx = i;
                peakIdxInBetween = lastTroughIdx;
            }

        }

    }

}


function mergePeaks(klineJson, field, interval, threshold) {
    var peakField = field+"_peak";
    var lastPeakIdx = -1;
    var troughIdxInBetween = 0;

    for (var i=0; i<klineJson.length; i++) {
        if (klineJson[troughIdxInBetween].high > klineJson[i].high) {
            troughIdxInBetween = i;
        }

        if (klineJson[i][peakField]!==true) {
            continue;
        }
        
        if (lastPeakIdx===-1) {
            lastPeakIdx = i;
            troughIdxInBetween = lastPeakIdx;
        } else {
            
            if (i - lastPeakIdx <= interval) {
                var j=i+1;
                for (; j<klineJson.length; j++) {
                    if (klineJson[j][peakField]===true) {
                        break;
                    }
                }
                
                if (j===klineJson.length) break;

                if (i - lastPeakIdx <= j-i) {
                    if(klineJson[lastPeakIdx].high>=klineJson[i].high){
                        delete klineJson[i][peakField];
                    } else {
                        delete klineJson[lastPeakIdx][peakField];
                        lastPeakIdx = i;
                        troughIdxInBetween = lastPeakIdx;
                    } 
                } else {
                    if(klineJson[i].high>=klineJson[j].high){
                        delete klineJson[j][peakField];
                        i--;
                    } else {
                        delete klineJson[i][peakField];
                    }
                }
                
            } else {
                lastPeakIdx = i;
                troughIdxInBetween = lastPeakIdx;
            }

        }

    }

}

function markPeaks(klineJson, field, increaseMin, minInterval) {
    var jsonLen = klineJson.length;
    var prePeak = Infinity;
    var prePeakIdx = 0;
    var highLowIdx = 0;
    var highLow = Infinity;
    var peakField = field+"_peak";
    for (var i=0; i<jsonLen; i++) {
        
        if (prePeakIdx===-1) {
            
            if(highLow >= klineJson[i][field]) {
                highLowIdx = i;
                highLow = klineJson[i][field];
            } else {
                if (klineutil.increase(highLow, klineJson[i][field])>increaseMin) {
                    prePeakIdx = i;
                }
            }
            continue;
        }

        if (klineJson[prePeakIdx][field] < klineJson[i][field]) {
            prePeakIdx = i;
        } else {
            if ((i-prePeakIdx) >= minInterval
                && klineutil.increase(klineJson[i][field], klineJson[prePeakIdx][field]) > increaseMin) {
                klineJson[prePeakIdx][peakField] = true;
                prePeakIdx = -1;
                highLowIdx = i;
                highLow = klineJson[highLowIdx][field];
            }
        }

    }

}

function markTroughs(klineJson, field, increaseMin, minInterval) {
    var jsonLen = klineJson.length;
    var preTrough = Infinity;
    var preTroughIdx = 0;
    var lowHighIdx = 0;
    var lowHigh = 0;
    var troughField = field+"_trough";
    for (var i=0; i<jsonLen; i++) {
        if (preTroughIdx===-1) {
            if(lowHigh <= klineJson[i].low) {
                //preTroughIdx = i;
                lowHigh = klineJson[i].low;
                lowHighIdx = i;
            } else {
                if (klineutil.increase(klineJson[i].low, lowHigh)>increaseMin) {
                    preTroughIdx = i;
                }
            }
            continue;
        }

        if (klineJson[preTroughIdx].low > klineJson[i].low) {
            preTroughIdx = i;
        } else {
            if ((i-preTroughIdx) >= minInterval
                && klineutil.increase(klineJson[preTroughIdx].low, klineJson[i].low) > increaseMin) {
                klineJson[preTroughIdx][troughField] = true;
                preTroughIdx = -1;
                lowHighIdx = i;
                lowHigh = klineJson[lowHighIdx].low;
            }
        }

    }

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

function exRightsDay(klineJson) {
    var jsonLen = klineJson.length;
    for (var i=1; i<jsonLen; i++) {
        var preclose = klineJson[i-1].close;        
        var prehigh = klineJson[i-1].high;
        var prelow = klineJson[i-1].low;

        var close = klineJson[i].close;
        var open = klineJson[i].open;
        var low = klineJson[i].low;
        var high = klineJson[i].high;
       
       if (klineutil.increase(preclose, open) < -0.105) {
            klineJson[i].exRightsDay = true;
        } else if (klineutil.increase(preclose, open) > 0.105) {
            klineJson[i].exRightsDay = true;
        } 

        // if (klineutil.increase(prehigh, low) > 0 && open < close) {
        //     klineJson[i].gapUp = klineutil.increase(prehigh, low);
        // } else if(klineutil.increase(prelow, high) < 0 && open > close) {
        //     klineJson[i].gapDown = klineutil.increase(prelow, high);
        // }

    }
}

function matchForms(kLineJson) {
    var jsonLen = kLineJson.length;
    var bullforms = klineformanalyser.bullKLineFormMethods();
     klineformanalyser.traverseForAppearance(bullforms, kLineJson, {
                formHandler: function(form, klineJson, i) {},
                formsHandler: function(forms, klineJson, i) {
                    klineJson[i].match = forms;
                    // var mmf = klineformanalyser.matchMoneyFlowForm(klineJson, i);
                    // if (mmf.length>0) {
                    //     klineJson[i].match_moneyflow = mmf;
                    // }
                    var reObj = {};
                    var inc_ave_8 = kLineJson[i].inc_ave_8;
                    if (!inc_ave_8) return;

                    var winStop = Math.min(3.7*inc_ave_8, 0.15);
                    var lossStop = Math.max(-3.7*inc_ave_8, -0.15);

                    var rel = klineutil.winOrLoss(kLineJson, i, lossStop, winStop, 100, reObj);
                    var days = reObj.days;
                    var date = kLineJson[i].date;
                    var j=1;
                    for (; j<days && i+j<jsonLen; j++) {
                        if(!kLineJson[i+j].pendings) {
                            kLineJson[i+j].pendings = {};
                        }
                        var pobj = {"day": j};
                        //pobj.date = date;
                        pobj.ratio = intersectionprocessor.matchRatio(forms);
                        kLineJson[i+j].pendings[date] = pobj;

                    }
                    if (j===days && i+j<jsonLen) {
                        if(!kLineJson[i+j].stop) kLineJson[i+j].stop = {};
                        kLineJson[i+j].stop[date] = kLineJson[i].winOrLose;
                        // var wl = (rel >= winStop? "win": (rel<=lossStop?"lose":"pending"));
                        // if (kLineJson[i].winOrLose!=wl) console.log("error",wl, kLineJson[i].winOrLose, date);
                    }

                }
            });
}

function winOrLose(kLineJson) {
    var jsonLen = kLineJson.length;
    for (var i=0; i<jsonLen; i++) {
        var inc_ave_8 = kLineJson[i].inc_ave_8;
        if (!inc_ave_8) continue;

        var winStop = Math.min(5*inc_ave_8, 0.15);
        var lossStop = Math.max(-5*inc_ave_8, -0.15);
        //var reObj = {};
        var rel = klineutil.winOrLoss(kLineJson, i, lossStop, winStop, 100/*, reObj*/);
        //var days = reObj.days;
        // var date = kLineJson[i].date;
        // for (var j=1; j<days && i+j<jsonLen; j++) {
        //     if(!kLineJson[i+j].pendings) {
        //         kLineJson[i+j].pendings = {};
        //     }
        //     kLineJson[i+j].pendings[date] = j;
        // }

        kLineJson[i].incStop = rel;
        kLineJson[i].winOrLose = rel>=winStop ? "win" : (rel<=lossStop?"lose":"pending");
    }
}

function updateKLinesFromBase(match) {
    var stocks = klineio.getAllStockIds(match);
    //stocks = ["SZ002408"];
    
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
    var maxnetsumidx_r0 = -1;

    var netsummin_r0x = 100000000000;
    var netsummin_r0x_5 = 0, netsummin_r0x_10 = 0, netsummin_r0x_20 = 0, netsummin_r0x_40 = 0;

    var netsummax_r0x = -100000000000;
    var netsummax_r0x_5 = 0, netsummax_r0x_10 = 0, netsummax_r0x_20 = 0, netsummax_r0x_40 = 0;

    var netsummax_r0 = -100000000000;
    var netsummax_r0_5 = 0, netsummax_r0_10 = 0, netsummax_r0_20 = 0, netsummax_r0_40 = 0;

    var netsummin_r0 = 100000000000;
    var netsummin_r0_5 = 0, netsummin_r0_10 = 0, netsummin_r0_20 = 0, netsummin_r0_40 = 0;


    var netsum_r0_above = 0, netsum_r0_below = 0;
    var netsum_r0_above_60 = 0, netsum_r0_below_60 = 0;
    var netsum_r0x_above = 0, netsum_r0x_below = 0;
    var netsum_r0x_above_60 = 0, netsum_r0x_below_60 = 0;

    var currentprice = klineJson[i].close;
    var netsummax_idx_r0 = -1;

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
        }


        var r0x_net = klj.netamount-klj.r0_net;

        var midprice = (klj.high+klj.low)/2;
        if (midprice>currentprice) {
            netsum_r0_above += klj.r0_net;
            netsum_r0x_above += r0x_net;
            if (i-j<60) {
                netsum_r0_above_60 += klj.r0_net;
                netsum_r0x_above_60 += r0x_net;
            }
        }

        if (midprice<currentprice) {
            netsum_r0_below += klj.r0_net;
            netsum_r0x_below += r0x_net;
            if (i-j<60) {
                netsum_r0_below_60 += klj.r0_net;
                netsum_r0x_below_60 += r0x_net;
            }
        }

        netsum_r0 += klj.r0_net;
        netsum_r0x += r0x_net;

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

    var obj = klineJson[i];

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
    //console.log("netsummax_days<20", klineJson[i].amount_ave_8, klineJson[i].amount_ave_21)

}

function processChain(stockId, kLineJson) {
    exRightsDay(kLineJson);
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
    
    winOrLose(kLineJson);
    matchForms(kLineJson);

    klineio.writeKLineSync(stockId, kLineJson);
  }
exports.config = config;
exports.updateKLinesFromBase = updateKLinesFromBase;
exports.updateKLinesFromAjax = updateKLinesFromAjax;

exports.mergeTroughs = mergeTroughs;
exports.mergePeaks = mergePeaks;
exports.markPeaks = markPeaks;
exports.markTroughs = markTroughs;
//exports.average = average;
exports.exRightsDay = exRightsDay;