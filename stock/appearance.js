console.time("run");
var klineio = require("./klineio");
var cluster = require('cluster');

var stocks = klineio.getAllStockIds();
//stocks = ["SH600777","SH600778"];
if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterResult = {};
    var funName;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(result){            
        for (var mtd in result) {
            var dates = result[mtd];
            if (masterResult[mtd] === undefined) {
                masterResult[mtd] = {};
            }


            for(var date in dates) {
                if (masterResult[mtd][date] === undefined) {
                    masterResult[mtd][date] = 0;
                }
                 masterResult[mtd][date] += dates[date];
            }
         }

    }

    for (var i = 0; i < numCPUs; i++) {
        if (i*forkStocks >= stocksLen) break;
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        var masterDays = {};
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i==0) {

            for (var mtd in masterResult) {
                var dates = masterResult[mtd];
                for (var date in dates) {
                    if (date.indexOf("win") > -1) continue;
                    if (masterDays[date]===undefined) {
                        masterDays[date] = 0;
                    }
                    masterDays[date] += dates[date];
                    //if (dates[date] < 0) delete dates[date];

                }
                //console.log(mtd, dates);
            }

            var sortedDates = []
            for (var date in masterDays) {
                if (date.indexOf("win") > -1) continue;
                if (masterDays[date] >= process.argv[2]) {
                    sortedDates.push(date);
                }

                //if (date.indexOf("2013")<0) delete masterDays[date];
            }

            sortedDates.sort(function(d1,d2) {
                var dt1 = new Date(d1);
                var dt2 = new Date(d2);
                return dt1>dt2?1:(dt1<dt2?-1:0);
            });

            sortedDates.forEach(function(date){
                var dayTotal = masterDays[date];

                var perStr = "";

                if (process.argv[3]==='info') {
                    for (var mtd in masterResult) {
                        var  mtdtotal = masterResult[mtd][date];
                        if (mtdtotal === undefined) mtdtotal = 0;
                        perStr += (mtd + ": " + masterResult[mtd][date+"_win"]+"/"+mtdtotal + "(" + (100*mtdtotal/dayTotal).toFixed(2)+")  ");
                    }
                }
                console.log(date,dayTotal, perStr);
                console.log("");
            });
            
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineprocesser = require("./klineprocessor");
    var klineformanalyser = require("./klineform/analyser");
    var klineutil = require("./klineutil");
    var resultTotal = {};
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    
    function processStock(idx) {
        var stockId = stocks[idx];
        var mtds = ["morningStar", "redNGreenRed", "greenInRed","on8While21UpVolumeHigh", "on8While21Up", "red3", 
        "sidewaysCompression", "wBottom"];
        //mtds = ["sidewaysCompression", "wBottom"];
        klineio.readKLine(stockId, function(kLineJson) {
            var result = {};
            klineformanalyser.traverseForAppearance(mtds, kLineJson, result);

             for (var mtd in result) {
                var dates = result[mtd];
                if (resultTotal[mtd] === undefined) {
                    resultTotal[mtd] = {};
                }
                
                dates.forEach(function (dayObj) {
                    var date = dayObj.date;
                    if (resultTotal[mtd][date] === undefined) {
                        resultTotal[mtd][date] = 0;
                    }
                    if (resultTotal[mtd][date+"_win"] === undefined) {
                        resultTotal[mtd][date+"_win"] = 0;
                    }

                     resultTotal[mtd][date]++;
                     if (dayObj.inc>=0.05) {
                        resultTotal[mtd][date+"_win"]++;
                     }
                });

            }

            if (idx === endIdx) {
                process.send(resultTotal);
                process.exit(0);
            } else {
                processStock(idx+1);
            }
            
        });

    }
    
    processStock(startIdx);    
}