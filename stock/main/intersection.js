console.time("run");

var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 

var klineio = require("../klineio");
var math = require("../mathutil");
var cluster = require('cluster');
var klineutil = require("../klineutil");

var klineprocesser = require("../klineprocessor");
var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var  formsLen = klineformanalyser.bullKLineFormMethods().length;

var intersetionArray = math.CArr(formsLen,2);
var currentForms = [];

var stocks = klineio.getAllStockIds();
//stocks = ['SZ000970'];

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    var intersetionArrayIndex = 0;
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
    var fun = function(idx) {
        for (i = 0; i < numCPUs; i++) {
            var worker = cluster.fork({intersetionArrayIndex: idx,
                startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});
            worker.on('message', onForkMessage);
        }

    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        
        if (i==0) {            
            if (intersetionArrayIndex<intersetionArray.length) {
                console.log(intersetionArrayIndex);
                fun(++intersetionArrayIndex);
            } else {
                console.log(masterResult);
                console.timeEnd("run");
            }
        } else {
            //console.log('worker ' + worker.process.pid + ' exits', code, masterResult);
        }

    });   

     fun(intersetionArrayIndex);
} else if (cluster.isWorker) {

    // var klineformanalyser = require("../klineform/analyser").config({
    //     startDate: startDate,
    //     endDate: endDate
    // });
    
    var forkResult = {};

    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);
    
    var currentIndexs = intersetionArray[parseInt(process.env.intersetionArrayIndex, 10)];
    var klineForms = klineformanalyser.selectedBullKLineFormMethods(currentIndexs);
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