console.time("run");
var klineio = require("../klineio");
var cluster = require('cluster');

var klineForm = "red3";
var unionKLineForm = "";//"headShoulderBottom";
var intersectionKLineForm = "";
var stocksShowLog = [];//["SZ002158", "SH600061"];//["SH600987"];//["SZ002127"];
var showLogDates = [];//["05/29/2013"];

var stocks = klineio.getAllStockIds();
//stocks = ["SH600061",/*"SZ002158"*/]//['SZ002127'];

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterTotal = 0;
    var masterWins = 0;
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){            
            masterTotal += msg.forkTotal;
            masterWins += msg.forkWins;
            funName = msg.fun;
        }

    for (var i = 0; i < numCPUs; i++) {
        if (i*forkStocks >= stocksLen) break;
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i==0) {
            console.log(funName, masterWins+"/"+masterTotal+"="+(masterWins/masterTotal).toFixed(10));
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineprocesser = require("../klineprocessor");
    var klineformanalyser = require("../klineform/analyser");
    var klineutil = require("../klineutil");
    var forkTotal = 0;
    var forkWins = 0;
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    
    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;
        var showLog = -1 !== stocksShowLog.indexOf(stockId);
        klineio.readKLine(stockId, function(kLineJson) {
            //10=56.14 / 12=58.86 / 15=61.63 / 20=64.22 / 30=66.44 /40=67.17
            // 30=52.5 / 50=58.3
            // 12=45.16
            //console.log("stockId", stockId, kLineJson[kLineJson.length-1].date)

            var result = klineformanalyser.traverseForWinning(fun, kLineJson, -0.05, 0.05, 12, 
                 {passAll:false, showLog:showLog, showLogDates:showLogDates, stockId:stockId,
                    union:unionKLineForm,
                    intersection:intersectionKLineForm});

            forkTotal += result.total;
            forkWins += result.win; 
            
            if (idx === endIdx) {
                process.send({forkTotal:forkTotal, forkWins:forkWins, fun:fun});
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}