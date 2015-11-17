var extend = require('util')._extend;

var bullOrBear = "bull";
var startDate = new Date("01/01/2010"); 
var endDate = new Date("01/01/2016"); 

var displayMinCount = 0;
var displayInfoFromDate = new Date("01/01/2014");
var displayInfoToDate = new Date("07/01/2016");
var displayEveryCase = false;
var showDetailOn = "";
var klineForms = "";//bullPulsing"; //"wBottom,wBottomA,headShoulderBottom,sidewaysCompression";

var klineio = require("../kline/klineio").config(startDate, endDate);
//var intersectionratehelper = require("../kline/form/intersectionratehelper").config(startDate, endDate);

// intersectionratehelper.getIntersectionRate(["wBottom"])
// return;

var cluster = require('cluster');

var stocks = klineio.getAllStockIds();
//stocks = ["SZ000420"];
var minMatch = 1;

if (cluster.isMaster) {

    console.time("run");

    var fs = require("fs");
    
    var stocksLen = stocks.length;
    var masterformsDateTotal = {};
    var funName;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen / numCPUs);
    var onForkMessage = function(formsDateTotal) {
        
        for (var date in formsDateTotal) {
            if (!masterformsDateTotal[date]) masterformsDateTotal[date] = {total:0, mstotal:0, win:0, lose:0, pending:0, mspending:0, stocks:{}};
            masterformsDateTotal[date].total += formsDateTotal[date].total;
            masterformsDateTotal[date].mstotal += formsDateTotal[date].mstotal;
            masterformsDateTotal[date].win += formsDateTotal[date].win;
            masterformsDateTotal[date].lose += formsDateTotal[date].lose;
            masterformsDateTotal[date].pending += formsDateTotal[date].pending;
            masterformsDateTotal[date].mspending += formsDateTotal[date].mspending;
            masterformsDateTotal[date].stocks = extend(masterformsDateTotal[date].stocks, formsDateTotal[date].stocks)
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
            var sortedDates = [];

            for (var date in masterformsDateTotal) {
                if (masterformsDateTotal[date].total >= displayMinCount) {
                    sortedDates.push(date);
                }
            }

            
            sortedDates.sort(function(d1, d2) {
                var dt1 = new Date(d1);
                var dt2 = new Date(d2);
                return dt1 > dt2 ? 1 : (dt1 < dt2 ? -1 : 0);
            });

            sortedDates.forEach(function(date) {
                var dObj = new Date(date);
                if (dObj < displayInfoFromDate || dObj > displayInfoToDate) return;
                console.log(date, "(",masterformsDateTotal[date].win, masterformsDateTotal[date].lose, ")/", masterformsDateTotal[date].total
                    +"(" + masterformsDateTotal[date].mstotal+")",                     
                    (masterformsDateTotal[date].win/masterformsDateTotal[date].total).toFixed(4), masterformsDateTotal[date].pending+
                    "("+masterformsDateTotal[date].mspending+")"
                    );

                if (showDetailOn==="all" || showDetailOn.indexOf(date)>-1) {
                    var stks = masterformsDateTotal[date].stocks;
                    for (var stockId in stks) {
                        var forms = stks[stockId];
                        console.log(stockId, forms.toString());
                    }
                    

                }
            });

        }
        // var forms = ["hammer","reversedHammer"]; //hammer","reversedHammer" 0.8125
        // forms = ["bullPulsing","flatBottom","greenInRed","hammer","headShoulderBottom","lowRedsB","morningStarA"
        // ,"morningStarB","reversedHammer","sidewaysCompression","smallRedsAndGreensA","sz002424_201405","wBottom"]
        //forms = ["bullPulsing","flatBottom","hammer","headShoulderBottom","lowRedsB","morningStarA","morningStarB","sidewaysCompression","smallRedsAndGreensA"];
        //bullPulsing,flatBottom,hammer,headShoulderBottom,lowRedsB,morningStarA,morningStarB,sidewaysCompression,smallRedsAndGreensA 0.926
        //bullPulsing,flatBottom,greenInRed,hammer,headShoulderBottom,lowRedsB,morningStarA,morningStarB,reversedHammer,sidewaysCompression,smallRedsAndGreensA,sz002424_201405,wBottom 0.9435
        // console.log(forms.toString(), intersectionratehelper.getIntersectionRate(forms));
        console.timeEnd("run");

    });


} else if (cluster.isWorker) {

    var klineformanalyser = require("../kline/form/analyser").config({
        bullorbear: bullOrBear,
        startDate: startDate,
        endDate: endDate,
        form: "./form80.js"
    });


    var klineutil = require("../kline/klineutil");
    var formsDateTotal = {};
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
            for(var i=0; i<kLineJson.length; i++) {
                if (!kLineJson[i].pending)  continue;
                var dt = new Date(kLineJson[i].date);
                if (dt>=startDate && dt<=endDate) {

                    var date = kLineJson[i].date;
                    if (!formsDateTotal[date]) formsDateTotal[date] = {total:0, mstotal:0, win:0, lose:0, pending:0, mspending:0, stocks:{}};
                    formsDateTotal[date].pending += kLineJson[i].pending;
                    if (stockId.indexOf("SZ300")===0 || kLineJson[i].marketCap<5000000000) {
                        formsDateTotal[date].mspending += kLineJson[i].pending;
                    }
                    
                }
            }

            klineformanalyser.traverseForAppearance(mtds, kLineJson, {
                formsHandler: function(forms, klineJson, i) {
                    if (forms.length<minMatch) return;
                    var date = klineJson[i].date;
                    if (!formsDateTotal[date]) formsDateTotal[date] = {total:0, mstotal:0, win:0, lose:0, pending:0, mspending:0, stocks:{}};
                    formsDateTotal[date].total++;
                    if (stockId.indexOf("SZ300")===0 || kLineJson[i].marketCap<5000000000) {
                        formsDateTotal[date].mstotal++;
                    }
                    if (klineJson[i].winOrLose === "win") formsDateTotal[date].win++;
                    if (klineJson[i].winOrLose === "lose") formsDateTotal[date].lose++;
                    formsDateTotal[date].stocks[stockId] = forms;
                }
            });


            if (idx === endIdx) {
                process.send(formsDateTotal);
                process.exit(0);
            } else {
                processStock(idx + 1);
            }

        });

    }

    processStock(startIdx);
}