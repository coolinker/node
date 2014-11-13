console.time("run");
/**********************/
var startDate = new Date("01/01/2010");
var endDate = new Date("08/01/2015");
/**********************/

var klineutil = require("../kline/klineutil");
var klineio = require("../kline/klineio").config(startDate, endDate);
var cluster = require('cluster');

var detailedDateResult = {};
var detailedDateResultStart = new Date("01/01/2013");
var detailedDateResultEnd = new Date("01/01/2015");
var detailedDateResultTotalMin = 10000;
//var dateSections = [new Date("01/01/2008"), new Date("01/01/2009")]; 
var dateSections = [new Date("01/01/2008"), new Date("01/01/2009"), new Date("01/01/2010"), new Date("01/01/2011"),
    // new Date("03/01/2011"), new Date("04/01/2011"), new Date("05/01/2011"), new Date("06/01/2011"), 
    // new Date("07/01/2011"), new Date("08/01/2011"), new Date("09/01/2011"), new Date("10/01/2011"), new Date("11/01/2011"), new Date("12/01/2011"), 
    new Date("01/01/2012"),
    new Date("01/01/2013"), new Date("01/01/2014"), new Date("08/01/2014")
];

var klineForm = process.argv[2] ? process.argv[2] : "sh600716_201410";
var intersectionKLineForm = "" //moneyFlowInOut";
var unionKLineForm = "" //wBottomA,wBottom,headShoulderBottom,morningStarA,morningStarB,redNGreenRed,greenInRedA";
var klineformanalyser = require("../kline/form/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var valideCheckForms = klineformanalyser.kLineFormMethods(klineForm);
// console.log("valideCheckForms", valideCheckForms)
var listLen = process.argv[3] ? Number(process.argv[3]) : 20;

//0.8313 'reversedHammerA,wBottom' ' of ' [ 'hammerA', 'reversedHammerA', 'wBottom
//"wBottom, wBottomA, headShoulderBottom, on8While21UpVolumeHigh, on8While21Up, 
//red3, redGreenRed, greenInRed, redNGreenRed";
//morningStar, sidewaysCompression

var stocksShowLog = []; //["SZ002158", "SH600061"];//["SH600987"];//["SZ002127"];
var showLogDates = [] //["11/14/2011"];

var stocks = klineio.getAllStockIds();
// stocks = ['SH600802']//['SZ002371', "SZ002158", "SH600061"];
if (cluster.isMaster) {

    var conditionanalyser = require("../kline/form/conditionanalyser");
    var stocksLen = stocks.length;
    // var masterTotal = 0;
    // var masterWins = 0;
    var masterResult = {
        master_total: 0,
        master_win: 0
    };
    var masterSamples = [];
    var masterConditionObj = {
        win: {},
        lose: {}
    };
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen / numCPUs);
    var forkStocksArr = [0, forkStocks - 80, 2 * forkStocks - 160, 3 * forkStocks - 200, 4 * forkStocks - 220,
        5 * forkStocks - 270, 6 * forkStocks - 300, 7 * forkStocks - 160, stocksLen - 1
    ]
    var onForkMessage = function(msg) {
        funName = msg.fun;
        var conditionObj = msg.conditionObj;
        masterSamples = masterSamples.concat(msg.forkSamples);

        delete msg.conditionObj;
        delete msg.fun;

        for (var att in msg) {
            if (att === "fun" || att === "conditionObj" || att === "detailedDateResult") {
                console.log("---------error")
            } else masterResult["master_" + att] = masterResult["master_" + att] ? masterResult["master_" + att] + msg[att] : msg[att];
        }
        for (var att in conditionObj.win) {
            if (!masterConditionObj.win[att]) masterConditionObj.win[att] = {
                "_true": 0,
                "_false": 0,
                true_unionvalid: 0,
                false_unionvalid: 0
            };
            masterConditionObj.win[att]._true += conditionObj.win[att]._true;
            masterConditionObj.win[att]._false += conditionObj.win[att]._false;

            masterConditionObj.win[att].true_unionvalid += conditionObj.win[att].true_unionvalid;
            masterConditionObj.win[att].false_unionvalid += conditionObj.win[att].false_unionvalid;
        }
        for (var att in conditionObj.lose) {
            if (!masterConditionObj.lose[att]) masterConditionObj.lose[att] = {
                "_true": 0,
                "_false": 0,
                true_unionvalid: 0,
                false_unionvalid: 0
            };
            masterConditionObj.lose[att]._true += conditionObj.lose[att]._true;
            masterConditionObj.lose[att]._false += conditionObj.lose[att]._false;


            masterConditionObj.lose[att].true_unionvalid += conditionObj.lose[att].true_unionvalid;
            masterConditionObj.lose[att].false_unionvalid += conditionObj.lose[att].false_unionvalid;
        }

    }

    for (var i = 0; i < numCPUs; i++) {
        if (i * forkStocks >= stocksLen) break;
        var worker = cluster.fork({
            startIdx: i * forkStocks,
            endIdx: Math.min((i + 1) * forkStocks, stocksLen) - 1
        });
        //var worker = cluster.fork({startIdx: forkStocksArr[i], endIdx: forkStocksArr[i+1]});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i == 0) {

            if (intersectionKLineForm) funName = klineForm + " && " + intersectionKLineForm;
            if (unionKLineForm) klineForm + " || " + unionKLineForm;

            //console.log("sortedDates:", sortedDates)

            var winPer = masterResult.master_win / masterResult.master_total;

            console.log(funName, "win:", masterResult.master_win + "/" + masterResult.master_total + "=" + (masterResult.master_win / masterResult.master_total).toFixed(3),
                "   valid:", masterResult.master_valid + "/" + masterResult.master_total + "=" + (masterResult.master_valid / masterResult.master_total).toFixed(3));

            
            console.log("\r\ncondition tune result:");
            var conditionArr = conditionFilter(masterConditionObj, winPer);
            conditionArr.sort(function(att1, att2){
                return conditionSortFun(att1, att2, masterConditionObj, winPer)
            });
            console.log("conditionArr", winPer, conditionArr[0], conditionArr[1], conditionArr[2])
            masterSamples.sort(function(s1, s2){
                if (s1.stockId>s2.stockId) return -1;
                else if (s1.stockId<s2.stockId) return 1;
                else return 0
            })

            console.log("masterSamples:", masterSamples.length)
                                    
            autoTuneCondition(masterSamples, conditionArr, masterConditionObj, valideCheckForms) 

            // for (var ci = 0; ci < listLen && ci < conditionArr.length; ci++) {
            //     catt = conditionArr[ci];
            //     var wincon = masterConditionObj.win[catt];
            //     var losecon = masterConditionObj.lose[catt];
            //     var truewinper = wincon._true / (wincon._true + losecon._true);
            //     var losewinper = wincon._false / (wincon._false + losecon._false);

            //     var per = Math.max(truewinper, losewinper);

            //     var count_unionvalid = truewinper > losewinper ? (wincon.true_unionvalid + losecon.true_unionvalid) : (wincon.false_unionvalid + losecon.false_unionvalid);
            //     if (isNaN(per)) console.log(wincon, losecon)
            //     console.log(per.toFixed(3),
            //         truewinper > losewinper ? wincon._true + "/" + (wincon._true + losecon._true) : wincon._false + "/" + (wincon._false + losecon._false), 
            //             truewinper > losewinper ? "T" : "F", count_unionvalid, catt)
            // }

            console.timeEnd("run");
        }
    });


} else if (cluster.isWorker) {

    // var klineformanalyser = require("../kline/form/analyser").config({
    //     startDate: startDate,
    //     endDate: endDate
    // });
    // var bullKLineFormMethods = klineformanalyser.bullKLineFormMethods();
    // var mtdsidx = bullKLineFormMethods.indexOf(klineForm);
    // bullKLineFormMethods.splice(mtdsidx, 1);
    //    console.log("bullKLineFormMethods:",bullKLineFormMethods)
    var conditionanalyser = require("../kline/form/conditionanalyser");

    // unionKLineForm = klineformanalyser.bullKLineFormMethods().join(",");

    var forkResult = {
        total: 0,
        win: 0
    };
    var forkSamples = [];
    var conditionObj = {
        win: {},
        lose: {}
    };
    //var forkTotal = 0;
    //var forkWins = 0;

    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);

    function dateToString(date) {
        var mth = date.getMonth() + 1;
        return (mth > 9 ? mth : "0" + mth) + "/" + date.getDate() + "/" + date.getFullYear();
    }

    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;
        var showLog = -1 !== stocksShowLog.indexOf(stockId);

        klineio.readKLine(stockId, function(kLineJson) {

            var result = klineformanalyser.traverseForWinning(fun, kLineJson, -0.05, 0.05, 100, {
                passAll: false,
                showLog: showLog,
                showLogDates: showLogDates,
                stockId: stockId,
                union: unionKLineForm,
                intersection: intersectionKLineForm,
                injection: function(stockId, klineJson, idx, mtd) {

                    forkSamples.push({
                        stockId: stockId,
                        index: idx
                    });
                    var unionValid = false;
                    if (!klineformanalyser.unionResult(null, valideCheckForms, klineJson, idx)) {
                        forkResult.valid = forkResult.valid ? forkResult.valid + 1 : 1;
                        unionValid = true;
                    }

                    var iswin = klineJson[idx].winOrLose === "win";
                    // conditionanalyser.scanConditions(klineJson, idx, conditionObj, unionValid, stockId);
                    conditionanalyser.scanConditions(klineJson, idx, conditionObj, function(condition, obj, condObj, boolvalue) {
                    if (undefined === condObj[condition].true_unionvalid) condObj[condition].true_unionvalid = 0;
                    if (undefined === condObj[condition].false_unionvalid) condObj[condition].false_unionvalid = 0;
                    // if (unionValid)
                     // console.log("boolvalue", boolvalue, unionValid, condition, condObj[condition])
                    if (boolvalue) {
                        if (unionValid) condObj[condition].true_unionvalid++;
                    } else {
                        if (unionValid) condObj[condition].false_unionvalid++;
                    }

                })

                }
            });

            forkResult.total += result.total;
            forkResult.win += result.win;

            if (idx === endIdx) {
                forkResult.fun = fun;
                forkResult.forkSamples = forkSamples;
                forkResult.conditionObj = conditionObj;
                forkResult._idx = endIdx;
                process.send(forkResult);
                process.exit(0);
            } else {
                processStock(idx + 1);
            }
        });

    }

    processStock(startIdx);
}

function autoTuneCondition(samples, conditionArr, condObj, valideCheckForms) {
    console.log("autoTuneCondition:", samples.length, ">>", conditionArr[0])
    for (var cdtidx = 0; cdtidx < conditionArr.length; cdtidx++) {
        var cond = conditionArr[cdtidx];
        var wincon = condObj.win[cond];
        var losecon = condObj.lose[cond];
        if (wincon===undefined) continue;
        var truewinper = wincon._true / (wincon._true + losecon._true);
        var losewinper = wincon._false / (wincon._false + losecon._false);
        var isTrue = truewinper > losewinper;

        var total_unionvalid = truewinper > losewinper ? (wincon.true_unionvalid + losecon.true_unionvalid) 
            : (wincon.false_unionvalid + losecon.false_unionvalid);
        
        var total_all = truewinper > losewinper ? (wincon._true + losecon._true) 
            : (wincon._false + losecon._false);

        console.log("autoTuneCondition:", cond, truewinper > losewinper ? "T" : "F", truewinper, losewinper, total_unionvalid, total_all);

        var subCondObj = {
            win: {},
            lose: {}
        };
        var subsamples = [];
        var wincount = 0;
        var lastStockId;
        var testcount = 0;
        for (var smpidx = 0; smpidx < samples.length; smpidx++) {
            var sid = samples[smpidx].stockId;
            var kLineJson;
            if (lastStockId != sid) {
                kLineJson = klineio.readKLineSync(sid);
                lastStockId = sid;
                // console.log(sid)
            }

            var stkidx = samples[smpidx]['index'];
            var obj = kLineJson[stkidx];

            
            var _cond = cond.replace(/<<<</g, "").replace(/ /g, "")
            var _eval = eval(_cond);
            if (isTrue ? _eval : !_eval) {
                testcount++;
                if (obj.winOrLose==="win") wincount++;
                subsamples.push({
                    stockId: sid,
                    index: stkidx
                })
                var unionValid = false;
                if (!klineformanalyser.unionResult(null, valideCheckForms, kLineJson, stkidx)) {
                    unionValid = true;
                }
                conditionanalyser.scanConditions(kLineJson, stkidx, subCondObj, function(condition, obj, _condObj, boolvalue) {
                    if (undefined === _condObj[condition].true_unionvalid) _condObj[condition].true_unionvalid = 0;
                    if (undefined === _condObj[condition].false_unionvalid) _condObj[condition].false_unionvalid = 0;
                    if (boolvalue) {
                        if (unionValid) _condObj[condition].true_unionvalid++;
                    } else {
                        if (unionValid) _condObj[condition].false_unionvalid++;
                    }

                });

            }

        }
        // console.log("subsamples:", subsamples.length, samples.length)

        var subconditionArr = conditionFilter(subCondObj, wincount/subsamples.length);
        // console.log("wincount/samples.length", wincount/subsamples.length, wincount, subsamples.length)

        subconditionArr.sort(function(att1, att2){
                return conditionSortFun(att1, att2, subCondObj, wincount/subsamples.length)
            });
        var subcond = subconditionArr[0];
        var subwincon = subCondObj.win[subcond];
        var sublosecon = subCondObj.lose[subcond];
        
        if (subwincon===undefined) break;

        var subtruewinper = subwincon._true / (subwincon._true + sublosecon._true);
        var sublosewinper = subwincon._false / (subwincon._false + sublosecon._false);

        var subper = Math.max(subtruewinper, sublosewinper);

        var count_unionvalid = subtruewinper > sublosewinper ? (subwincon.true_unionvalid + sublosecon.true_unionvalid) 
            : (subwincon.false_unionvalid + sublosecon.false_unionvalid);
        
        var count_all = subtruewinper > sublosewinper ? (subwincon._true + sublosecon._true) 
            : (subwincon._false + sublosecon._false);
        
        console.log("subsamples:", subcond, subper, subtruewinper > sublosewinper ? "T" : "F", count_all, count_unionvalid);
        console.log("------------------")
        if (subsamples.length>5000) {
            autoTuneCondition(subsamples, subconditionArr, condObj, valideCheckForms)
        }

        break;
    }

}

function conditionFilter(conditionObj, per) {
    var conditionArr = [];
    for (var att in conditionObj.win) {
        var wincon = conditionObj.win[att];
        var losecon = conditionObj.lose[att];

        var truewinper = wincon._true / (wincon._true + losecon._true);
        var falsewinper = wincon._false / (wincon._false + losecon._false);
        // console.log(att, wincon, losecon, truewinper, falsewinper)
        if (truewinper >= falsewinper
            // && truewinper-per>0.005
            && wincon.true_unionvalid + losecon.true_unionvalid > 800
        ) {

            conditionArr.push(att);
        } else if (truewinper < falsewinper
            // && falsewinper-per>0.005
            && wincon.false_unionvalid + losecon.false_unionvalid > 800
        ) {
            conditionArr.push(att);
        }
    }
    return conditionArr;
}

function conditionSortFun(att1, att2, conditionObj, winPer) {
    var wincon1 = conditionObj.win[att1];
    var losecon1 = conditionObj.lose[att1];
    var per1 = 0;
    
    if (wincon1) {
        var truewinper1 = wincon1._true / (wincon1._true + losecon1._true);
        var falsewinper1 = wincon1._false / (wincon1._false + losecon1._false);
        var unionvalid1 = truewinper1 > falsewinper1 ? (wincon1.true_unionvalid + losecon1.true_unionvalid) 
            : (wincon1.false_unionvalid + losecon1.false_unionvalid);
        var perdiff = Math.max(truewinper1, falsewinper1) - winPer;
        per1 = unionvalid1 * perdiff;
    } else {
        console.log(att1, wincon1, losecon1)
    }

    var wincon2 = conditionObj.win[att2];
    var losecon2 = conditionObj.lose[att2];
    var per2 = 0;
    if (wincon2) {
        var truewinper2 = wincon2._true / (wincon2._true + losecon2._true);
        var falsewinper2 = wincon2._false / (wincon2._false + losecon2._false);
        var unionvalid2 = truewinper2 > falsewinper2 ? (wincon2.true_unionvalid + losecon2.true_unionvalid) 
        : (wincon2.false_unionvalid + losecon2.false_unionvalid);
        var perdiff = Math.max(truewinper2, falsewinper2) - winPer;

        per2 = unionvalid2 * perdiff;
    } else {
        console.log(att2, wincon2, losecon2)
    }


    if (per1 > per2) return -1;
    if (per1 < per2) return 1;
    return 0;
}
