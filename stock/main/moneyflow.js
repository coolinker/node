console.time("run");
var moneyflowio = require("../moneyflow/io").config();
var targetDateStr = "04/30/2014";
var daySection = 100;
var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");
 // io.updateMoneyFlowData(0, function(){
 //     console.timeEnd("run");
 // })

//moneyflowio.readMoneyFlowSync("SH600260");

var klineio = require("../kline/klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();
stocks = ["SZ002344"];//["SH600015"];//
stocks.forEach(function(stockId) {
    var kLineJson= klineio.readKLineSync(stockId);
    var len = kLineJson.length;
    
    var maxr0netsum = -100000000000;
    var maxr0xnetsum = -100000000000;
    var r0netsum = 0;
    var maxr0netsumidx = -1;
    var r0xnetsum = 0;
    var i;
    for (i=len-1; i>=0; i--) {
        var klj = kLineJson[i];
        if(klj.date === targetDateStr) break;
    }
    var startidx = i;
    for (; i>=0 && startidx-i<=daySection; i--) {
        var klj = kLineJson[i];
        r0netsum += klj.r0_net;
        //r0xnetsum += klj.netamount-klj.r0_net;
        
        if (r0netsum > maxr0netsum) {
            maxr0netsum = r0netsum;
            //maxr0xnetsum = r0xnetsum;
            maxr0netsumidx = i;
            //console.log(kLineJson[i].date, (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))
        }

    }
    console.log("===", maxr0netsum)
    var maxr0netsum = -100000000000;
    var r0netsum = 0;
    for (i = maxr0netsumidx; i<=startidx; i++) {
        var klj = kLineJson[i];
        r0netsum += klj.r0_net;
        r0xnetsum += klj.netamount-klj.r0_net;
        
        if (r0netsum > maxr0netsum) {
            maxr0netsum = r0netsum;
            maxr0xnetsum = r0xnetsum;
        }

        //console.log(kLineJson[i].date, (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2),
        //   (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))
    }
   
    if (r0netsum-r0xnetsum>100000000) {
        console.log(stockId, kLineJson[maxr0netsumidx].date, kLineJson[startidx].date,
        (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))

    }
});
        