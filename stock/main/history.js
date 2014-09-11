var bullOrBear = "bull";
var startDate = new Date("01/01/2009"); 
var endDate = new Date("01/01/2015"); 

var displayMinCount = 100;
var displayInfoFromDate = new Date("01/01/2014");
var displayInfoToDate = new Date("01/01/2015");
var displayEveryCase = false;
var displayInfo = "info";
var klineForms = "";//bullPulsing"; //"wBottom,wBottomA,headShoulderBottom,sidewaysCompression";

console.time("run");
var klineio = require("../kline/klineio").config(startDate, endDate);
var cluster = require('cluster');

var stocks = klineio.getAllStockIds();
//stocks = ["SH600089"];

if (cluster.isMaster) {
    var fs = require("fs");
    var content = fs.readFileSync("../config/daypendings.json","utf8");
    var pendings = JSON.parse(content);

    var stocksLen = stocks.length;
    var masterformsDateTotal = {};
    var funName;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen / numCPUs);
    var onForkMessage = function(formsDateTotal) {
        
        for (var date in formsDateTotal) {
            if (!masterformsDateTotal[date]) masterformsDateTotal[date] = {total:0, win:0};
            masterformsDateTotal[date].total += formsDateTotal[date].total;
            masterformsDateTotal[date].win += formsDateTotal[date].win;

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
                console.log(date, masterformsDateTotal[date].win, "/", masterformsDateTotal[date].total, 
                    (masterformsDateTotal[date].win/masterformsDateTotal[date].total).toFixed(4))
            });

            console.timeEnd("run");
        }
    });


} else if (cluster.isWorker) {

    var klineformanalyser = require("../kline/form/analyser").config({
        bullorbear: bullOrBear,
        startDate: startDate,
        endDate: endDate
    });

    var intersectionprocessor = require("../kline/form/intersectionprocessor").config(3);

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

            klineformanalyser.traverseForAppearance(mtds, kLineJson, {
                formsHandler: function(forms, klineJson, i) {
                    var date = klineJson[i].date;
                    if (!formsDateTotal[date]) formsDateTotal[date] = {total:0, win:0};
                    formsDateTotal[date].total++;
                    if (klineJson[i].winOrLose === "win") formsDateTotal[date].win++;
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