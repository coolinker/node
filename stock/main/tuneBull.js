console.time("run");
/**********************/
var startDate = new Date("01/01/2010"); 
var endDate = new Date("08/01/2015"); 
/**********************/

var klineio =  require("../kline/klineio").config(startDate, endDate);
var cluster = require('cluster');

var detailedDateResult = {};
var detailedDateResultStart = new Date("01/01/2011");
var detailedDateResultEnd = new Date("01/01/2012");
var detailedDateResultTotalMin = 10000;
//var dateSections = [new Date("01/01/2008"), new Date("01/01/2009")]; 
var dateSections = [new Date("01/01/2008"), new Date("01/01/2009"), new Date("01/01/2010")
, new Date("01/01/2011"), 
// new Date("03/01/2011"), new Date("04/01/2011"), new Date("05/01/2011"), new Date("06/01/2011"), 
// new Date("07/01/2011"), new Date("08/01/2011"), new Date("09/01/2011"), new Date("10/01/2011"), 
new Date("01/01/2012"),
new Date("01/01/2013"), new Date("01/01/2014")]; 

var klineForm = process.argv[2]?process.argv[2]:"flatBottom";
var intersectionKLineForm = ""//moneyFlowInOut";
var unionKLineForm = ""//wBottomA,wBottom,headShoulderBottom,morningStarA,morningStarB,redNGreenRed,greenInRedA";

var listLen = process.argv[3]?Number(process.argv[3]):20;

//0.8313 'reversedHammerA,wBottom' ' of ' [ 'hammerA', 'reversedHammerA', 'wBottom
//"wBottom, wBottomA, headShoulderBottom, on8While21UpVolumeHigh, on8While21Up, 
//red3, redGreenRed, greenInRed, redNGreenRed";
//morningStar, sidewaysCompression

var stocksShowLog = [];//["SZ002158", "SH600061"];//["SH600987"];//["SZ002127"];
var showLogDates =[]//["11/14/2011"];

var stocks = klineio.getAllStockIds();
// stocks = ['SH600523']//['SZ002371', "SZ002158", "SH600061"];
var __themastercount = 0;
if (cluster.isMaster) {
    var stocksLen = stocks.length;
    // var masterTotal = 0;
    // var masterWins = 0;
    var masterResult = {master_total:0, master_win:0};
    var masterDetailedDateResult = {};
    var masterConditionObj = {win:{}, lose:{}};
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var forkStocksArr = [0, forkStocks-80, 2*forkStocks-160,3*forkStocks-200, 4*forkStocks-220, 
        5*forkStocks-270, 6*forkStocks-300, 7*forkStocks-160, stocksLen-1]
    var onForkMessage = function(msg){
            //console.log(msg._idx);
            // masterTotal += msg.total;
            // masterWins += msg.win;

            funName = msg.fun;
            var conditionObj = msg.conditionObj;
            delete msg.conditionObj;
            delete msg.fun;

            for (var att in msg) {
                if (att === "detailedDateResult") {
                    var ddr = msg.detailedDateResult;
                    for (var _att in ddr) {
                        if (!masterDetailedDateResult[_att]) masterDetailedDateResult[_att] = {total:0, win:0};
                        masterDetailedDateResult[_att].total += ddr[_att].total;
                        masterDetailedDateResult[_att].win += ddr[_att].win;
                    }
                } else {
                    if (att==="fun" || att==="conditionObj") {
                        console.log("---------error")
                    } else masterResult["master_"+att] = masterResult["master_"+att]?masterResult["master_"+att]+msg[att]:msg[att];
                }
            }

            
            for (var att in conditionObj.win) {
                if (!masterConditionObj.win[att]) masterConditionObj.win[att] = {"_true":0, "_false":0, true_unionvalid:0, false_unionvalid:0};
                masterConditionObj.win[att]._true+= conditionObj.win[att]._true;
                masterConditionObj.win[att]._false+= conditionObj.win[att]._false;

                masterConditionObj.win[att].true_unionvalid+= conditionObj.win[att].true_unionvalid;
                masterConditionObj.win[att].false_unionvalid+= conditionObj.win[att].false_unionvalid;
            }
            for (var att in conditionObj.lose) {
                if (!masterConditionObj.lose[att]) masterConditionObj.lose[att] = {"_true":0, "_false":0, true_unionvalid:0, false_unionvalid:0};
                masterConditionObj.lose[att]._true+= conditionObj.lose[att]._true;
                masterConditionObj.lose[att]._false+= conditionObj.lose[att]._false;


                masterConditionObj.lose[att].true_unionvalid+= conditionObj.lose[att].true_unionvalid;
                masterConditionObj.lose[att].false_unionvalid+= conditionObj.lose[att].false_unionvalid;
            }
            
        }

    for (var i = 0; i < numCPUs; i++) {
        if (i*forkStocks >= stocksLen) break;
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1}); 
        //var worker = cluster.fork({startIdx: forkStocksArr[i], endIdx: forkStocksArr[i+1]});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i==0) {
            var datearray = [];

            for (var att in masterDetailedDateResult) {

                if (masterDetailedDateResult[att].total > detailedDateResultTotalMin) {
                    datearray.push(att);
                }
                //if (detailedDateResult[att].total > 10) console.log(att, typeof detailedDateResult[att], detailedDateResult[att])
            }
            datearray.sort(function(d1, d2){
                d1 = new Date(d1);
                d2 = new Date(d2);
                if (d1>d2) return 1;
                if (d2>d1) return -1;
                return 0;
            });
            
            datearray.forEach(function(date){
                console.log(date, masterDetailedDateResult[date].win+"/"+masterDetailedDateResult[date].total,
                    (masterDetailedDateResult[date].win/masterDetailedDateResult[date].total).toFixed(3));
            });
            console.log("================\r\n");

            if (intersectionKLineForm) funName = klineForm+" && "+intersectionKLineForm;
            if (unionKLineForm) klineForm+" || "+unionKLineForm;
            
            var sortedDates = [];
             for (var att in masterResult) {    
                if (att.length>12 && att.indexOf("master_total")===0) {
                        sortedDates.push(att);
                }
            }

            sortedDates.sort(function(att1, att2){
                //console.log(att1, att2)
                if (att1.indexOf("after_")) return -1;
                if (att2.indexOf("after_")) return 1;

                var d1 = new Date(att1.substring(13, 22));
                var d2 = new Date(att2.substring(13, 22));

                if (d1>d2) return 1;
                else if (d2>d1) return -1;
                return 0
            })
            //console.log("sortedDates:", sortedDates)
            sortedDates.forEach (function(att) {
                    var winatt = "master_win"+att.substring(12);
                    console.log(att.substring(13)+" "+masterResult[winatt]+"/"+masterResult[att]
                    +"="+(masterResult[winatt]/masterResult[att]).toFixed(10));
                
            });
            

            console.log(funName, "win:", masterResult.master_win+"/"+masterResult.master_total
                +"="+(masterResult.master_win/masterResult.master_total).toFixed(3),
                "   valid:", masterResult.master_valid+"/"+masterResult.master_total
                +"="+(masterResult.master_valid/masterResult.master_total).toFixed(3));

            console.log("\r\ncondition tune result:");
            var conditionArr = [];
            for (var att in masterConditionObj.win) {
                var wincon = masterConditionObj.win[att];
                var losecon = masterConditionObj.lose[att];

                var truewinper = wincon._true/(wincon._true+losecon._true) ;
                var losewinper = wincon._false/(wincon._false+losecon._false);
                if (truewinper >= losewinper 
                    //&& wincon._true+losecon._true>2000
                    && wincon.true_unionvalid+losecon.true_unionvalid > 800
                    ) {
                    conditionArr.push(att);
                } else if (truewinper < losewinper 
                    //&& wincon._false+losecon._false>2000
                    && wincon.false_unionvalid+losecon.false_unionvalid > 800
                    ) {
                    conditionArr.push(att);
                }
                // var wintrueper = wincon._true/(wincon._true+wincon._false);
                // var losetrueper = losecon._true/(losecon._true+losecon._false);
                
                // if (true || wintrueper>0.5 && wintrueper-losetrueper>0
                //     || wintrueper<0.5 && wintrueper-losetrueper<0) {
                //     conditionArr.push(att)
                // }
            }
            console.log("conditionArr", conditionArr.length);
            conditionArr.sort(function(att1, att2){
                var wincon1 = masterConditionObj.win[att1];
                var losecon1 = masterConditionObj.lose[att1];

                var truewinper1 = wincon1._true/(wincon1._true+losecon1._true);
                var losetrueper1 = wincon1._false/(wincon1._false+losecon1._false);
                var per1 = Math.max(truewinper1, losetrueper1);

                var wincon2 = masterConditionObj.win[att2];
                var losecon2 = masterConditionObj.lose[att2];

                var truewinper2 = wincon2._true/(wincon2._true+losecon2._true);
                var losetrueper2 = wincon2._false/(wincon2._false+losecon2._false);
                var per2 = Math.max(truewinper2, losetrueper2);
                
                if (per1>per2) return -1;
                if (per1<per2) return 1;
                return 0;
            });

            var conditionArr1 = [];
            conditionArr1.sort(function(att1, att2){

                var wincon1 = masterConditionObj.win[att1];
                var wintrueper1 = wincon1 ? wincon1._true/(wincon1._true+wincon1._false) : 0;
                var losecon1 = masterConditionObj.lose[att1];
                var losetrueper1 = losecon1 ? losecon1._true/(losecon1._true+losecon1._false) : 0;

                // if (att1=="klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.05")
                //     console.log("1:", wintrueper1, losetrueper1, wincon1, losecon1, att2)

                // if (att2=="klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.05")
                //     console.log("2:", wintrueper1, losetrueper1, wincon1, losecon1, att1) 
               
                // if (att1==="obj.netsum_r0_below_60>0.0*obj.amount_ave_21" || att2==="obj.netsum_r0_below_60>0.0*obj.amount_ave_21") {
                //     console.log("abs1:", wincon1,losecon1, att1);
                //     console.log("abs2:", masterConditionObj.win[att2], masterConditionObj.lose[att2], att2)
                // }
                //if (wintrueper1===0 && losetrueper1===0 || wintrueper1===1 && losetrueper1===1) return 1;
                //if (wintrueper1<0.1 && losetrueper1<0.1 || wintrueper1>0.9 && losetrueper1>0.9) return 1;
                // if (wintrueper1>losetrueper1 
                //     && ((wincon1._true+losecon1._true < 1000
                //             && wincon1._true/(wincon1._true+losecon1._true)<0.8) 
                //         || wincon1._true+losecon1._true < 1000)) return 1;
                // if (wintrueper1<losetrueper1 
                //     && ((wincon1._false+losecon1._false < 1000
                //     && wincon1._false/(wincon1._false+losecon1._false)<0.8)
                //     || wincon1._false+losecon1._false < 1000)) return 1;
                
               if (losetrueper1===1) return 1;
                var abs1 =  wintrueper1>losetrueper1? wintrueper1/losetrueper1: (1-wintrueper1)/(1-losetrueper1) //Math.abs(wintrueper1-losetrueper1);


                var wincon2 = masterConditionObj.win[att2];
                var wintrueper2 = wincon2 ? wincon2._true/(wincon2._true+wincon2._false) : 0;
                var losecon2 = masterConditionObj.lose[att2];
                var losetrueper2 = losecon2 ? losecon2._true/(losecon2._true+losecon2._false) : 0;

                //if (wintrueper2===0 && losetrueper2===0|| wintrueper2===1 && losetrueper2===1) return -1;
                //if (wintrueper2<0.1 && losetrueper2<0.1 || wintrueper2>0.9 && losetrueper2>0.9) return -1;
                // if (wintrueper2>losetrueper2
                //     && ((wincon2._true+losecon2._true < 1000
                //             && wincon2._true/(wincon2._true+losecon2._true)<0.8)
                //         || wincon2._true+losecon2._true < 1000)) return -1;
                // if (wintrueper2<losetrueper2
                //     && ((wincon2._false+losecon2._false < 1000
                //             && wincon2._false/(wincon2._false+losecon2._false)<0.8)
                //         || wincon2._false+losecon2._false < 1000)) return -1;

                if (losetrueper2===1) return -1;
                var abs2 = wintrueper2>losetrueper2? wintrueper2/losetrueper2:  (1-wintrueper2)/(1-losetrueper2)  //Math.abs(wintrueper2-losetrueper2);

                var totalremain1 = wintrueper1>losetrueper1?(wincon1._true+losecon1._true): (wincon1._false+losecon1._false);
                var totalremain2 = wintrueper2>losetrueper2?(wincon2._true+losecon2._true): (wincon2._false+losecon2._false);
                if (abs1>abs2) return -1;
                if (abs1<abs2) return 1;
                return 0;

            })
            
            var isDupeCondition = function(str){
                var depe = "".replace(/ /g, "");
    
                var cond = str.replace(/<<<</g, "").replace(/ /g, "").replace(/[><=]/g, " ").split(" ")[0];

                //console.log(depe.indexOf(cond), cond, str);
                return depe.indexOf(cond)>=0;
            }

            for (var ci=0; ci<listLen && ci<conditionArr.length; ci++) {
                catt = conditionArr[ci];
                var wincon = masterConditionObj.win[catt];
                var losecon = masterConditionObj.lose[catt];
                var truewinper = wincon._true/(wincon._true+losecon._true) ;
                var losewinper = wincon._false/(wincon._false+losecon._false);

                var per = Math.max(truewinper, losewinper);

                var count_unionvalid = truewinper>losewinper 
                    ? (wincon.true_unionvalid+losecon.true_unionvalid) 
                    : (wincon.false_unionvalid+losecon.false_unionvalid);
                if (isNaN(per)) console.log(wincon, losecon)
                console.log(per.toFixed(3), 
                    truewinper>losewinper 
                    ? wincon._true+"/"+(wincon._true+losecon._true) 
                    : wincon._false+"/"+(wincon._false+losecon._false)
                    , truewinper>losewinper?"T":"F"
                    , count_unionvalid
                    , (isDupeCondition(catt)?"***":"")+catt)
                // var wintrueper = wincon ? wincon._true/(wincon._true+wincon._false) : 0;
                // var losetrueper = losecon ? losecon._true/(losecon._true+losecon._false) : 0;

                // var per = wintrueper>losetrueper
                //    ? (masterConditionObj.win[catt]._true/(masterConditionObj.win[catt]._true+masterConditionObj.lose[catt]._true))
                //    : (masterConditionObj.win[catt]._false/(masterConditionObj.win[catt]._false+masterConditionObj.lose[catt]._false));
                // console.log(per.toFixed(3), 
                //     wintrueper>losetrueper 
                //     ? (masterConditionObj.win[catt]._true+masterConditionObj.lose[catt]._true)
                //     : (masterConditionObj.win[catt]._false+masterConditionObj.lose[catt]._false),
                //     wintrueper.toFixed(3), 
                //     losetrueper.toFixed(3), masterConditionObj.win[catt], masterConditionObj.lose[catt], 
                //     (isDupeCondition(catt)?"***":"")+catt
                //     );

            }
            
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineformanalyser = require("../kline/form/analyser").config({
        startDate: startDate,        endDate: endDate
    });
    var bullKLineFormMethods = klineformanalyser.bullKLineFormMethods();
    var mtdsidx = bullKLineFormMethods.indexOf(klineForm);
    bullKLineFormMethods.splice(mtdsidx,1);
//    console.log("bullKLineFormMethods:",bullKLineFormMethods)
    var conditionanalyser = require("../kline/form/conditionanalyser");
    
    // unionKLineForm = klineformanalyser.bullKLineFormMethods().join(",");
    
    var klineutil = require("../kline/klineutil");
    var forkResult = {total:0, win:0};
    var conditionObj = {win:{}, lose:{}};
    //var forkTotal = 0;
    //var forkWins = 0;

    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);

    function dateToString(date) {
        var mth = date.getMonth()+1;
        return (mth>9?mth:"0"+mth)+"/"+date.getDate()+"/"+date.getFullYear();
    }

    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;
        var showLog = -1 !== stocksShowLog.indexOf(stockId);

        klineio.readKLine(stockId, function(kLineJson) {
            //10=56.14 / 12=58.86 / 15=61.63 / 20=64.22 / 30=66.44 /40=67.17
            // 30=52.5 / 50=58.3
            // 12=45.16
            //console.log("stockId", stockId, kLineJson[0].date, kLineJson[kLineJson.length-1].date)

            var result = klineformanalyser.traverseForWinning(fun, kLineJson, -0.05, 0.05, 100, 
                 {passAll:false, showLog:showLog, showLogDates:showLogDates, stockId:stockId,
                    union:unionKLineForm,
                    intersection:intersectionKLineForm,
                    injection: function(stockId, klineJson, idx, mtd){
                        
                        var unionValid = false;
                        if(!klineformanalyser.unionResult(null, bullKLineFormMethods, klineJson, idx)) {
                            forkResult.valid = forkResult.valid?forkResult.valid+1:1;
                            unionValid = true;
                        }


                        //console.log(stockId, date, iswin)
                        var date = new Date(klineJson[idx].date);
                        var iswin = klineJson[idx].winOrLose==="win";
                        __themastercount++;
                        conditionanalyser.conditions(klineJson, idx, conditionObj, unionValid, stockId);
                        if (dateSections.length===0) return;
                        var keytotal = "";
                        var keywin = "";
                        var seclen = dateSections.length;
                        if (date < dateSections[0]) {
                            var dstr = dateToString(dateSections[0]);
                            keytotal = "total_before_"+dstr;
                            keywin = "win_before_"+dstr;
                        } else if (date >= dateSections[seclen-1]) {
                            var dstr = dateToString(dateSections[seclen-1]);
                            keytotal = "total_after_"+dstr;
                            keywin = "win_after_"+dstr;
                        } else {
                            for (var i=1; i<dateSections.length; i++) {
                                if (date < dateSections[i]) {

                                    var startstr = dateToString(dateSections[i-1]);
                                    var endstr = dateToString(dateSections[i]);
                                    keytotal ="total_"+startstr + "_" + endstr;
                                    keywin = "win_"+startstr + "_" + endstr;
                                    break;
                                }
                            }
                        }


                        if (date>=detailedDateResultStart && date<=detailedDateResultEnd) {
                            var dstr = dateToString(date);
                            if (!detailedDateResult[dstr]) {
                                detailedDateResult[dstr]={total:0, win:0};
                            }

                            detailedDateResult[dstr].total++;
                            if (iswin) detailedDateResult[dstr].win++;
                        }

                        forkResult[keytotal] = forkResult[keytotal]?forkResult[keytotal]+1:1;
                        if(iswin) {
                            forkResult[keywin] = forkResult[keywin]?forkResult[keywin]+1:1;
                        }

                    }
                });

            forkResult.total += result.total;
            forkResult.win += result.win; 
            
            if (idx === endIdx) {
                forkResult.fun = fun;
                forkResult.detailedDateResult = detailedDateResult;
                forkResult.conditionObj = conditionObj;
                forkResult.__themastercount = __themastercount;
                forkResult._idx = endIdx;
                //console.log("__themastercount", __themastercount)
                process.send(forkResult);
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}