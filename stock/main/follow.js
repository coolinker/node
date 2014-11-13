var extend = require('util')._extend;

var bullOrBear = "bull";
var startDate = new Date("01/01/2010"); 
var endDate = new Date("01/01/2015"); 

var displayMinCount = 0;
var displayInfoFromDate = new Date("06/01/2014");
var displayInfoToDate = new Date("07/01/2015");
var displayEveryCase = false;
var showDetailOn = "_all";
var klineForms = "";//bullPulsing"; //"wBottom,wBottomA,headShoulderBottom,sidewaysCompression";

var klineio = require("../kline/klineio").config(startDate, endDate);
var intersectionratehelper = require("../kline/form/intersectionratehelper").config(startDate, endDate);

// intersectionratehelper.getIntersectionRate(["wBottom"])
// return;

var cluster = require('cluster');

var stocks = klineio.getAllStockIds();
//stocks = ["SZ000420"];

if (cluster.isMaster) {

    console.time("run");

    var fs = require("fs");
    
    var stocksLen = stocks.length;
    var masterToFollow = {};
    var funName;

    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen / numCPUs);
    var onForkMessage = function(toFollow) {
        for (var stockId in toFollow) {
           masterToFollow[stockId] = toFollow[stockId];
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
            var stockIds = [];

            for (var stockid in masterToFollow) {
                    stockIds.push(stockid);
            }

            stockIds.sort(function(sid1, sid2){
                var rgt1 = (masterToFollow[sid1].sum_r0+masterToFollow[sid1].sum_r0x)/masterToFollow[sid1].amount_ave_21;
                var rgt2 = (masterToFollow[sid2].sum_r0+masterToFollow[sid2].sum_r0x)/masterToFollow[sid2].amount_ave_21;
                if (rgt1>rgt2) return -1;
                else if (rgt1<rgt2) return 1;
                else return 0;
            })

            for (var j=0; j<20 && j<stockIds.length; j++) {
                var stkid = stockIds[j];
                console.log(stkid, masterToFollow[stkid].date, (masterToFollow[stkid].sum_r0/10000).toFixed(2), 
                    (masterToFollow[stkid].sum_r0x/10000).toFixed(2))
            }
            
        }
        console.timeEnd("run");

    });


} else if (cluster.isWorker) {

    var klineformanalyser = require("../kline/form/analyser").config({
        bullorbear: bullOrBear,
        startDate: startDate,
        endDate: endDate
    });


    var klineutil = require("../kline/klineutil");
    var toFollow = {};
    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);

    function processStock(idx) {
        var stockId = stocks[idx];
        
        //mtds = ["sidewaysCompression", "wBottom"];
        klineio.readKLine(stockId, function(kLineJson) {
            var _idx = kLineJson.length-1;
            var price = kLineJson[_idx].close;
            var sum_r0 = 0, sum_r0x = 0;
            var klj;
            for(; _idx>0; _idx--) {
                klj = kLineJson[_idx];

                if (klj.close>price) {
                    sum_r0 +=  klj.r0_net;
                    var r0x_net = klj.netamount-klj.r0_net
                    sum_r0x += r0x_net;

                }

                if(klj.match) {
                    break;
                }

                if (klj.exRightsDay) {
                    price = price/(kLineJson[_idx].open/kLineJson[_idx-1].close);
                }
            }

            if (_idx>0 && kLineJson.length-_idx<40
                && klj.match.length>0
                && sum_r0 > 100000000//1.5*kLineJson[kLineJson.length-1].amount_ave_8
                && sum_r0+sum_r0x > 100000000//1.5*kLineJson[kLineJson.length-1].amount_ave_8
                ) {
                klj.sum_r0 = sum_r0;
                klj.sum_r0x = sum_r0x;
                toFollow[stockId] = klj
                // console.log("=====", stockId, klj.date, klj.close, price, klj.match.toString(), sum_r0, sum_r0x)
            }


            if (idx === endIdx) {
                process.send(toFollow);
                process.exit(0);
            } else {
                processStock(idx + 1);
            }

        });

    }

    processStock(startIdx);
}