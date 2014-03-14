console.time("run");

var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 

var cluster = require('cluster');

var klineio = require("../klineio").config(startDate, endDate);
var math = require("../mathutil");
var klineutil = require("../klineutil");


//var intersetionArray = math.CArr(35,3);
//console.log(intersetionArray.length)


var intersectionprocessor = require("../klineform/intersectionprocessor").config(2);
var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });


var stocks = klineio.getAllStockIds();
//stocks = ['SZ000970'];

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var masterResult = {};

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){

            for (var att in msg) {
                if (!masterResult[att]) {
                    masterResult[att] = msg[att];
                } else {
                    masterResult[att].total += msg[att].total;
                    masterResult[att].win += msg[att].win;
                    masterResult[att].lose += msg[att].lose;
                    masterResult[att].pending += msg[att].pending;
                }

            }
            //console.log("onForkMessage", msg, masterResult);
    }
    var i = 0;
    var fun = function() {
        var klineForms = intersectionprocessor.getFormsCombination();
        console.log("klineForms",klineForms);
        for (i = 0; i < numCPUs; i++) {
            var worker = cluster.fork({combinationArrayIndex: intersectionprocessor.getIndex(),
                startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});
            worker.on('message', onForkMessage);
        }

    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        
        if (i==0) {            
            if (intersectionprocessor.next()) {
                setImmediate(fun);
                //fun();
            } else {

                intersectionprocessor.merge(masterResult);
                intersectionprocessor.writeJson();
                console.timeEnd("run");
            }
        } else {
            //console.log('worker ' + worker.process.pid + ' exits', code, masterResult);
        }

    });   
    if (intersectionprocessor.next()) {
        fun();
    }
} else if (cluster.isWorker) {

    var forkResult = {};

    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    var cmbidx = parseInt(process.env.combinationArrayIndex, 10);

    var klineForms = intersectionprocessor.getFormsCombinationAt(cmbidx);
 
    function processStock(idx) {
        var stockId = stocks[idx];

        klineio.readKLine(stockId, function(kLineJson) {
            var result = {};
            klineformanalyser.traverseForIntersection(klineForms, kLineJson, forkResult);

            if (idx === endIdx) {
                process.send(forkResult);
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}