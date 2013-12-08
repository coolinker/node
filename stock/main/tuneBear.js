console.time("run");
var klineio = require("../klineio");
var cluster = require('cluster');

var klineForm = "shootStar";
var unionKLineForm = "";//"headShoulderBottom";
var intersectionKLineForm = "";
var stocksShowLog = [];
//stocksShowLog = ["SZ000510"];//["SZ002158", "SH600061"];//["SH600987"];//["SZ002127"];
var showLogDates = [];//["12/23/2010"];

var stocks = klineio.getAllStockIds();
//stocks = ["SZ000510",/*"SZ002158"*/]//['SZ002127'];

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterTotal = 0;
    var masterLosts = 0;
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){            
            masterTotal += msg.forkTotal;
            masterLosts += msg.forkLosts;
            funName = msg.fun;
        }

    for (var i = 0; i < numCPUs; i++) {
        if (i*forkStocks >= stocksLen) break;
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterLosts, masterTotal);
        if (i==0) {
            console.log(funName, masterLosts+"/"+masterTotal+"="+(masterLosts/masterTotal).toFixed(10));
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineprocesser = require("../klineprocessor");
    var klineformanalyser = require("../klineform/analyser");
    var klineutil = require("../klineutil");
    var forkTotal = 0;
    var forkLosts = 0;
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    
    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;
        var showLog = -1 !== stocksShowLog.indexOf(stockId);
        klineio.readKLine(stockId, function(kLineJson) {
            //(-0.05,0.05,10)=38.06%
            //(-0.05,0.05,12)=40.37%
            //(-0.05,0.05,15)=42.7%
            //
            //(-0.1, 0.1, 20)=30.41%
            var result = klineformanalyser.traverseForLosing(fun, kLineJson, -0.05, 0.05, 12, 
                {passAll:false, showLog:showLog, showLogDates:showLogDates, stockId:stockId,
                    union:unionKLineForm,
                    intersection:intersectionKLineForm});

            forkTotal += result.total;
            forkLosts += result.lost;
            
            if (idx === endIdx) {
                process.send({forkTotal:forkTotal, forkLosts:forkLosts, fun:fun});
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}