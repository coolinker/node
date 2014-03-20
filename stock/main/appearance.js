var bullOrBear = "bull";
var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");

var displayMinCount = -1
var displayInfoFromDate = new Date("01/01/2014");
var displayInfoToDate = new Date("11/16/2015");
var displayEveryCase = false;
var displayInfo = "moreinfo1";
var klineForms = ""; //"wBottom,wBottomA,headShoulderBottom,sidewaysCompression";

console.time("run");
var klineio = require("../klineio").config(startDate, endDate);
var cluster = require('cluster');

var stocks = klineio.getAllStockIds();
//stocks = ["SH600089"];

if (cluster.isMaster) {
    var fs = require("fs");
    var content = fs.readFileSync("../config/daypendings.json","utf8");
    var pendings = JSON.parse(content);

    var stocksLen = stocks.length;
    var masterResult = {};
    var masterRatioResult = {};
    var funName;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen / numCPUs);
    var onForkMessage = function(result) {
        var incResult = result.incResult;
        for (var mtd in incResult) {
            var dates = incResult[mtd];
            if (masterResult[mtd] === undefined) {
                masterResult[mtd] = {};
            }

            for (var date in dates) {
                if (masterResult[mtd][date] === undefined) {
                    masterResult[mtd][date] = 0;
                }
                masterResult[mtd][date] += dates[date];
            }
        }

        var formsRatio = result.formsRatio;
        for (var date in formsRatio) {
            var ratioObj = formsRatio[date];
            if (!masterRatioResult[date]) masterRatioResult[date] = ratioObj;
            else {
                masterRatioResult[date].stockNumber += ratioObj.stockNumber;
                masterRatioResult[date].ratioSum += ratioObj.ratioSum;
            }
        }

    }

    for (var i = 0; i < numCPUs; i++) {
        if (i * forkStocks >= stocksLen) break;
        var worker = cluster.fork({
            startIdx: i * forkStocks,
            endIdx: Math.min((i + 1) * forkStocks, stocksLen) - 1
        });
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        var masterDays = {};
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i == 0) {

            for (var mtd in masterResult) {
                var dates = masterResult[mtd];

                for (var date in dates) {
                    if (date.indexOf("win") > -1) continue;
                    if (masterDays[date] === undefined) {
                        masterDays[date] = 0;
                    }
                    masterDays[date] += dates[date];
                    //if (dates[date] < 0) delete dates[date];

                }
                //console.log(mtd);
            }

            var sortedDates = []

            for (var date in masterDays) {
                if (date.indexOf("win") > -1) continue;

                if (masterDays[date] >= displayMinCount) {
                    sortedDates.push(date);
                }

                //if (date.indexOf("2013")<0) delete masterDays[date];
            }

            
            sortedDates.sort(function(d1, d2) {
                var dt1 = new Date(d1);
                var dt2 = new Date(d2);
                return dt1 > dt2 ? 1 : (dt1 < dt2 ? -1 : 0);
            });

            sortedDates.forEach(function(date) {
                var dObj = new Date(date);
                if (dObj < displayInfoFromDate || dObj > displayInfoToDate) return;

                var dayTotal = masterDays[date];
                var perStr = "";
                if (displayInfo === 'moreinfo') {
                    for (var mtd in masterResult) {
                        var mtdtotal = masterResult[mtd][date];
                        if (mtdtotal === undefined) continue;
                        perStr += (mtd + ": " + masterResult[mtd][date + "_win"] + "/" + mtdtotal + "(" + (100 * mtdtotal / dayTotal).toFixed(2) + ")  ");
                    }

                }

                if (displayInfo !== undefined) {
                    console.log(date, masterRatioResult[date].stockNumber + "/" + dayTotal, 
                        perStr, (masterRatioResult[date].ratioSum / masterRatioResult[date].stockNumber).toFixed(4),
                        pendings[date]?(pendings[date].latestCount+"/"+pendings[date].count):"",  
                        pendings[date]?(pendings[date].latestRatio+"/"+pendings[date].ratio):"");

                        if (!pendings[date]) console.log("-------------------", date)
                }
            });

            console.timeEnd("run");
        }
    });


} else if (cluster.isWorker) {

    var klineformanalyser = require("../klineform/analyser").config({
        bullorbear: bullOrBear,
        startDate: startDate,
        endDate: endDate
    });

    var intersectionprocessor = require("../klineform/intersectionprocessor").config(3);

    var klineutil = require("../klineutil");
    var resultTotal = {};
    var formsResultTotal = {};
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    var mtds;
    if (!klineForms) {
        mtds = klineformanalyser.kLineFormMethods();
    } else {
        mtds = klineForms.split(",");
    }

    function processStock(idx) {
        var stockId = stocks[idx];
        
        //mtds = ["sidewaysCompression", "wBottom"];
        klineio.readKLine(stockId, function(kLineJson) {

            var incResult = {};

            klineformanalyser.traverseForAppearance(mtds, kLineJson, {
                formHandler: function(form, klineJson, i) {

                    var date = klineJson[i].date;
                    if (incResult[form] === undefined) {
                        incResult[form] = [];
                    }
                    //incResult[form].push({date:date, inc:rel, win: rel>=winStop, lose: rel<=lossStop});
                    incResult[form].push({
                        date: date,
                        inc: klineJson[i].incStop,
                        win: klineJson[i].winOrLose == "win",
                        lose: klineJson[i].winOrLose == "lose"
                    });

                    if (!displayEveryCase) return;

                    var dObj = new Date(date);
                    if (dObj >= displayInfoFromDate && dObj <= displayInfoToDate) {
                        console.log(date, stockId);
                    }

                },
                formsHandler: function(forms, klineJson, i) {
                    var date = klineJson[i].date;
                    if (forms.length > 0) {
                        if (!formsResultTotal[date]) {
                            formsResultTotal[date] = {};
                        }

                        formsResultTotal[date][stockId] = forms;
                    }
                }
            });


            for (var mtd in incResult) {
                var dates = incResult[mtd];
                if (resultTotal[mtd] === undefined) {
                    resultTotal[mtd] = {};
                }

                dates.forEach(function(dayObj) {
                    var date = dayObj.date;
                    if (resultTotal[mtd][date] === undefined) {
                        resultTotal[mtd][date] = 0;
                    }
                    if (resultTotal[mtd][date + "_win"] === undefined) {
                        resultTotal[mtd][date + "_win"] = 0;
                    }

                    resultTotal[mtd][date]++;
                    if (bullOrBear === "bull" && dayObj.win || bullOrBear === "bear" && dayObj.inc <= -0.05) {
                        resultTotal[mtd][date + "_win"]++;
                    }
                });

            }

            if (idx === endIdx) {
                var formsRatio = {};
                for (var dt in formsResultTotal) {
                    var stocks = formsResultTotal[dt];
                    var counter = 0;
                    var ratioSum = 0;
                    for (var sid in stocks) {
                        counter++;
                        var sforms = stocks[sid];
                        var ratio = intersectionprocessor.matchRatio(sforms);
                        ratioSum += ratio;
                    }
                    formsRatio[dt] = {
                        stockNumber: counter,
                        ratioSum: ratioSum
                    };
                }

                process.send({
                    incResult: resultTotal,
                    formsRatio: formsRatio
                });
                process.exit(0);
            } else {
                processStock(idx + 1);
            }

        });

    }

    processStock(startIdx);
}