console.time("run");
var moneyflowio = require("../moneyflow/io").config();
var klineutil = require("../kline/klineutil");
var today = new Date();
var _m = 1+today.getMonth();
var _d = today.getDate();
var _y = today.getFullYear();

var targetDateStr = (_m>9?_m:"0"+_m) +"/"
        +(_d>9?_d:"0"+_d) +"/"+_y;
console.log("targetDateStr:"+targetDateStr);     
//targetDateStr = "04/30/2014";
var daySection = 150;
var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");
 // io.updateMoneyFlowData(0, function(){
 //     console.timeEnd("run");
 // })

//moneyflowio.readMoneyFlowSync("SH600260");

var klineio = require("../kline/klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();
//stocks = ["SZ002638"];//["SH600015"];//

var emailbody = "";
var counter = 0;
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
    if (i===-1) return;
    var startidx = i;
    for (; i>=0 && startidx-i<=daySection; i--) {
        var klj = kLineJson[i];

        if (klj.r0_net===undefined) break;

        r0netsum += klj.r0_net;
        //r0xnetsum += klj.netamount-klj.r0_net;
        if (isNaN(r0netsum)) {
            console.log(stockId, klj.date, maxr0netsumidx, i, r0netsum, klj.r0_net, maxr0netsum)
            
        }
        if (r0netsum > maxr0netsum) {
            maxr0netsum = r0netsum;
            //maxr0xnetsum = r0xnetsum;
            maxr0netsumidx = i;
            //console.log(kLineJson[i].date, (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))
        }

    }

    var maxr0netsum = -100000000000;
    var r0netsum = 0;
    var valuablecount = 0;
    var midprice = kLineJson[startidx].close;
    var sumbelow = 0, sumabove = 0;
    var sum40 = 0;
    var sum20 = 0;
    var sum10 = 0;
    var sum5 = 0;

    for (i = maxr0netsumidx; i>0 && i<=startidx; i++) {
        var klj = kLineJson[i];
        
        r0netsum += klj.r0_net;
        r0xnetsum += klj.netamount-klj.r0_net;
        if(startidx-i<40) sum40+=klj.r0_net;
        if(startidx-i<20) sum20+=klj.r0_net;
        if(startidx-i<10) sum10+=klj.r0_net;
        if(startidx-i<5) sum5+=klj.r0_net;

        if (klj.close<midprice) sumbelow += klj.r0_net;
        else if (klj.close>midprice) sumabove += klj.r0_net;

        if (klj.netamount-klj.r0_net<0 && klj.r0_net>0
            || kLineJson[i].close < kLineJson[i-1].close && klj.r0_net>0) {
            //console.log(kLineJson[i].date,(klj.r0_net/10000).toFixed(2), ((klj.netamount-klj.r0_net)/10000).toFixed(2), (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2),
            //   (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))
            if(startidx-i<8) valuablecount++

        }

        if (r0netsum > maxr0netsum) {
            maxr0netsum = r0netsum;
            maxr0xnetsum = r0xnetsum;
        }

        //console.log(kLineJson[i].date, (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2),
        //   (maxr0netsum/10000).toFixed(2), (maxr0xnetsum/10000).toFixed(2))
    }
   //600016 600515
   
    var inc = klineutil.increase(kLineJson[maxr0netsumidx].open, kLineJson[startidx].close);
    var duration = startidx-maxr0netsumidx;
    var durationmiddle = maxr0netsumidx+Math.floor(duration/2);
    var aboveitems = klineutil.higherItemsIndex(kLineJson, maxr0netsumidx, startidx, "low", kLineJson[startidx].close);
    var aboveitems_half = klineutil.higherItemsIndex(kLineJson, 
            maxr0netsumidx, startidx-Math.round((startidx-maxr0netsumidx)/2), "low", kLineJson[startidx].close);
    var belowitems = klineutil.lowerItemsIndex(kLineJson, maxr0netsumidx, startidx, "high", kLineJson[startidx].close);
    // console.log(stockId, valuablecount, startidx-maxr0netsumidx, kLineJson[maxr0netsumidx].date, 
    //         kLineJson[startidx].date, "aboveitems:"+aboveitems.length, "belowitems:"+belowitems.length,
    //         //"sum10:"+(sum10/10000).toFixed(2), "sum20:"+(sum20/10000).toFixed(2),
    //         "aboveitems_half:"+aboveitems_half.length,
    //         "sumabove:"+(sumabove/10000).toFixed(2), "sumbelow:"+(sumbelow/10000).toFixed(2),
    //      (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2))
    if (valuablecount>=0 
        //&& inc<2*kLineJson[startidx].inc_ave_21 
        && duration>40 
        //&& aboveitems.length>duration*0.1
        && belowitems.length>duration*0.1
        && (aboveitems_half.length> duration*0.05
            || aboveitems.length>duration*0.3
            || aboveitems[0] < durationmiddle)
        && r0xnetsum<-50000000 && r0netsum>100000000
        && sumbelow>0
        && sumabove>sumbelow
        && sum5>10000000
        //&& sum20>10000000
        && sum40>10000000) {
        counter++;
        console.log(stockId, valuablecount, startidx-maxr0netsumidx, kLineJson[maxr0netsumidx].date, 
            kLineJson[startidx].date, "aboveitems:"+aboveitems.length, "belowitems:"+belowitems.length,
            //"sum10:"+(sum10/10000).toFixed(2), "sum20:"+(sum20/10000).toFixed(2),
            "aboveitems_half:"+aboveitems_half.length,
            "sumabove:"+(sumabove/10000).toFixed(2), "sumbelow:"+(sumbelow/10000).toFixed(2),
         (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2))

        emailbody += //"<a href='http://image.sinajs.cn/newchart/daily/n/"+stockId.toLowerCase()+".gif'>"
                        "<a href='http://vip.stock.finance.sina.com.cn/moneyflow/#!ssfx!"+stockId.toLowerCase()+"'>"
                        +stockId+"</a> "
                        + kLineJson[maxr0netsumidx].date+"-"+targetDateStr+" <br>"
                        +"duration:"+(startidx-maxr0netsumidx)+" above:"+aboveitems.length+" below:"+belowitems.length
                        + " above_half:"+aboveitems_half.length+"<br>"
                        +"r0netsum:"+(r0netsum/10000).toFixed(2)+" r0xnetsum:"+(r0xnetsum/10000).toFixed(2)+"<br>"
                        +"r0netsum_above:"+(sumabove/10000).toFixed(2)+" r0netsum_below:"+(sumbelow/10000).toFixed(2)+"<br>"
                        +"sum5:"+(sum5/10000).toFixed(2)+" | sum10:"+(sum10/10000).toFixed(2)
                        +" | sum20:"+(sum20/10000).toFixed(2)+" | sum40:"+(sum40/10000).toFixed(2)+"<br>"
                        +"<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                        +stockId.toLowerCase()+".gif\" width=\"400\" height=\"250\"><br>"
                        

    }
});
//emailbody="";
if (emailbody!=="") {
//console.log(emailbody);
        var mailutil = require("../mailutil");
        mailutil.sendEmail("Flow", "Total:"+counter+"<br>"+emailbody);
}
console.timeEnd("run");