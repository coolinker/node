console.time("run");
var klineio = require("./klineio");
var cluster = require('cluster');

var stocks = klineio.getAllStockIds();

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterTotal = 0;
    var masterWins = 0;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){            
            masterTotal += msg.forkTotal;
            masterWins += msg.forkWins;
        }

    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i==0) {
            console.log(masterWins+"/"+masterTotal+"="+(masterWins/masterTotal).toFixed(10));
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

        klineio.readKLine(stockId, function(kLineJson) {
            var result = averageanalyer.traverse("red3", kLineJson, 0.05, 0.05);

            forkTotal += result.total;
            forkWins += result.win; 
            
            if (idx === endIdx) {
                process.send({forkTotal:forkTotal, forkWins:forkWins});
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}