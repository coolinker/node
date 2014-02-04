console.time("run");
var klineio = require("../klineio");
var cluster = require('cluster');

var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2013"); 

var klineForm = "redGreenRedA";

var stocks = klineio.getAllStockIds();

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterTotal = 0;
    var masterValid = 0;
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){            
            masterTotal += msg.total;
            masterValid += msg.valid;
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
            console.log(funName, masterValid+"/"+masterTotal+"="+(masterValid/masterTotal).toFixed(10));
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate,
        bullorbear: "bull"
    });

    var klineutil = require("../klineutil");
    var forkTotal = 0;
    var forkValid = 0;
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    

    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;

        klineio.readKLine(stockId, function(kLineJson) {

            var result = klineformanalyser.validateForm(fun, kLineJson);

            forkTotal += result.total;
            forkValid += result.valid;
            
            if (idx === endIdx) {
                process.send({total:forkTotal, valid:forkValid, fun:fun});
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}