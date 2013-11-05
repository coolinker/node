console.time("run");
var klineio = require("./klineio");
var cluster = require('cluster');

var stocks = klineio.getAllStockIds();

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

    var klineprocesser = require("./klineprocessor");
    var averageanalyer = require("./analysers/averageanalyer");
    var klineutil = require("./klineutil");
    var forkTotal = 0;
    var forkWins = 0;
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);

    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = "morningStar";
        klineio.readKLine(stockId, function(kLineJson) {
            //10=56.14 / 12=58.86 / 15=61.63 / 20=64.22 / 30=66.44 /40=67.17
            var result = averageanalyer.traverse(fun, kLineJson, -0.1, 0.05, 10, false);

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