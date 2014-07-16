console.time("run");
var moneyflowio = require("../moneyflow/io").config();
var klineutil = require("../kline/klineutil");

var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");
var targetDateStr = process.argv[2];

if (!targetDateStr) {
    var today = new Date();
    var _m = 1+today.getMonth();
    var _d = today.getDate();
    var _y = today.getFullYear();

    targetDateStr = (_m>9?_m:"0"+_m) +"/"
        +(_d>9?_d:"0"+_d) +"/"+_y;
}

//targetDateStr = "04/28/2014";
console.log("targetDateStr:"+targetDateStr);     

var klineio = require("../kline/klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();
//stocks = ["SZ002697"];//["SH600015"];//
function _f(amount){
    return (amount/10000).toFixed(2)
}
var emailbody = "";
var counter = 0, losecounter = 0, wincounter = 0;

//stocks = ["SZ002424"]
stocks.forEach(function(stockId) {
    var kLineJson= klineio.readKLineSync(stockId);
    var len = kLineJson.length;
    
    var i = len-1;
    for (; i>=0; i--) {
        var klj = kLineJson[i];
        if(klj.date === targetDateStr) break;
    }
    if (i<0) {
        return;
    }
    var maxr0netsumidx = i-klj.netsummax_r0_duration;
   
    //var inc = klineutil.increase(kLineJson[maxr0netsumidx].open, kLineJson[i].close);
    var duration = klj.netsummax_r0_duration;

    
    var low_index_20 = klineutil.lowItemIndex(kLineJson, i-20, i, "low");
    var low_index_40 = klineutil.lowItemIndex(kLineJson, i-40, i-5, "low");
    var longDownNeedle = 0, longDownNeedleDates = [];
    var bigLowSmallVolume = 0, bigLowSmallVolumeDates = [];
    for (var j=i; j>=1 && i-j<30; j--) {
        //if (!kLineJson[j]) console.log("stockId", stockId, j, kLineJson.length)
        if(klineutil.increase(kLineJson[j].low, kLineJson[j-1].close) > 0.8*kLineJson[j].amplitude_ave_21
            && klineutil.increase(kLineJson[j].amount_ave_21, kLineJson[j].amount) < 0
            || klineutil.increase(kLineJson[j].low, kLineJson[j-1].close) > 0.8*kLineJson[j].amplitude_ave_8
            && klineutil.increase(kLineJson[j].amount_ave_8, kLineJson[j].amount) < 0) {
            bigLowSmallVolume++;
            bigLowSmallVolumeDates.push(kLineJson[j].date)
            //if (stockId==="SH600012")
            //console.log(stockId, kLineJson[j].date, klineutil.increase(kLineJson[j].low, kLineJson[j-1].close) , kLineJson[j].inc_ave_8, kLineJson[j].inc_ave_21)
        }
            

        if ((klineutil.increase(kLineJson[j].low, Math.min(kLineJson[j].close, kLineJson[j].open)) > 0.8*kLineJson[j].inc_ave_8
            || klineutil.increase(Math.max(kLineJson[j].close, kLineJson[j].open), kLineJson[j].high) > 0.8*kLineJson[j].inc_ave_8)
            && kLineJson[j].r0_net>0) {
            longDownNeedle++;
            longDownNeedleDates.push(kLineJson[j].date)
        }
    }   
// console.log(klj.netsum_r0_above_60, 0.5*klj.amount_ave_21, klj.netsum_r0_above_60 - 0.5*klj.amount_ave_21,
//     _f(klj.netsum_r0_above+klj.netsum_r0x_above), 
//     _f(klj.netsum_r0_above_60+klj.netsum_r0x_above_60), _f(klj.amount_ave_21));
//     _f(klj.netsummax_r0+klj.netsummax_r0_netsum_r0x),
//     duration,  i-low_index_40, klineutil.increase(kLineJson[low_index_40].low, kLineJson[i].close), kLineJson[i].inc_ave_21)
    if (duration>60
        && (longDownNeedle> 0 || bigLowSmallVolume>0)
        && i-low_index_40 > 10
        && kLineJson[i].close > kLineJson[low_index_40].low
        && klineutil.increase(kLineJson[low_index_40].low, kLineJson[i].close) < 5 * kLineJson[i].inc_ave_21
        && klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>klj.amount_ave_21
        && (klj.netsum_r0_20 + klj.netsum_r0x_20 > 0 || klj.netsum_r0_40 + klj.netsum_r0x_40 > 0)
        && klj.netsum_r0_above+klj.netsum_r0x_above>0.5*klj.amount_ave_21
        && klj.netsum_r0_above_60> 0.5*klj.amount_ave_21
        && klj.netsum_r0_above > klj.netsum_r0_below
        //***********&& klj.netsummin_r0x_10 + klj.netsummax_r0_10 > -0.8*klj.amount_ave_8
        ) {
        counter++;
        if (klj.winOrLose === "win") {
            wincounter++;
        }
        //console.log(stockId, longDownNeedle, _f(klj.netsum_r0_40 + klj.netsum_r0x_40), _f(klj.netsummax_r0+klj.netsummax_r0_netsum_r0x))
        if (klj.winOrLose === "lose") {
            losecounter++;
         console.log("\r\n"+stockId, duration, kLineJson[maxr0netsumidx].date, klj.date)
         console.log("bigLowSmallVolume:", bigLowSmallVolumeDates, "longDownNeedle", longDownNeedleDates);
         console.log(_f(klj.netsum_r0_above), _f(klj.netsum_r0x_above), " / ", _f(klj.netsum_r0_below), _f(klj.netsum_r0x_below))
         console.log(_f(klj.netsummax_r0), " / ", _f(klj.netsummax_r0_netsum_r0x), (klj.netsummax_r0/klj.amount_ave_8).toFixed(2));
         //console.log(_f(klj.netsummax_r0+klj.netsummax_r0_netsum_r0x));
        }         
        /*
        emailbody += "<a href='http://vip.stock.finance.sina.com.cn/moneyflow/#!ssfx!"+stockId.toLowerCase()+"'>"
                        +stockId+"</a> "
                        + kLineJson[maxr0netsumidx].date+"-"+targetDateStr+" <br>"
                        +"duration:"+(duration)+" above:"+aboveitems.length+" below:"+belowitems.length
                        +"<br>"
                        +"r0netsum:"+(klj.netsummax_r0/10000).toFixed(2)
                        +" r0xnetsum:"+(klj.netsummax_r0_netsum_r0x/10000).toFixed(2)
                        +"<br>"
                        +"r0netsum_above:"+(klj.netsum_r0_above/10000).toFixed(2)
                        +" r0netsum_below:"+(klj.netsum_r0_below/10000).toFixed(2)
                        +"<br>"
                        +"r0xnetsum_above:"+(klj.netsum_r0x_above/10000).toFixed(2)
                        +" r0xnetsum_below:"+(klj.netsum_r0x_below/10000).toFixed(2)
                        +"<br>"
                        +"netsummax_r0:"+(klj.netsummax_r0_5/10000).toFixed(2)+" | "+(klj.netsummax_r0_10/10000).toFixed(2)
                        +" | "+(klj.netsummax_r0_20/10000).toFixed(2)+" | "+(klj.netsummax_r0_40/10000).toFixed(2)
                        +"<br>"
                        +"netsummax_r0x:"+(klj.netsummax_r0x_5/10000).toFixed(2)+" | "+(klj.netsummax_r0x_10/10000).toFixed(2)
                        +" | "+(klj.netsummax_r0x_20/10000).toFixed(2)+" | "+(klj.netsummax_r0x_40/10000).toFixed(2)+"<br>"
                        +"<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                        +stockId.toLowerCase()+".gif\" width=\"400\" height=\"250\"><br>"
          */
           emailbody += "<a href='http://vip.stock.finance.sina.com.cn/moneyflow/#!ssfx!"+stockId.toLowerCase()+"'>"
                        +stockId+"</a> "
                        + kLineJson[maxr0netsumidx].date+"-"+targetDateStr+" <br>"
                        //+"duration:"+(duration)+" above:"+aboveitems.length+" below:"+belowitems.length
                        +"<br>"
                        +"amount_ave_21:"+(klj.amount_ave_21/10000).toFixed(2) + " amount_ave_8:"+(klj.amount_ave_8/10000).toFixed(2)
                        +"<br>"
                        //+"aboveitems:"+aboveitems.length+ " belowitems:"+belowitems.length+" belowitems_30:"+belowitems_30.length
                        +"<br>"
                        +" netsum_r0_5:"+(klj.netsum_r0_5/10000).toFixed(2)
                        +" netsum_r0_10:"+(klj.netsum_r0_10/10000).toFixed(2)
                        +" netsum_r0_20:"+(klj.netsum_r0_20/10000).toFixed(2) 
                        +" netsum_r0_40:"+(klj.netsum_r0_40/10000).toFixed(2) 
                        +" <br>"
                        +" netsum_r0x_5:"+(klj.netsum_r0x_5/10000).toFixed(2)
                        +" netsum_r0x_10:"+(klj.netsum_r0x_10/10000).toFixed(2)
                        +" netsum_r0x_20:"+(klj.netsum_r0x_20/10000).toFixed(2) 
                        +" netsum_r0x_40:"+(klj.netsum_r0x_40/10000).toFixed(2) 
                        +" <br>"+" <br>"
                        +" netsummax_r0_5:"+(klj.netsummax_r0_5/10000).toFixed(2)
                        +" netsummax_r0_10:"+(klj.netsummax_r0_10/10000).toFixed(2)
                        +" netsummax_r0_20:"+(klj.netsummax_r0_20/10000).toFixed(2)
                        +" netsummax_r0_40:"+(klj.netsummax_r0_40/10000).toFixed(2)
                        +" <br>"
                        +" netsummax_r0x_5:"+(klj.netsummax_r0x_5/10000).toFixed(2)
                        +" netsummax_r0x_10:"+(klj.netsummax_r0x_10/10000).toFixed(2)
                        +" netsummax_r0x_20:"+(klj.netsummax_r0x_20/10000).toFixed(2)
                        +" netsummax_r0x_40:"+(klj.netsummax_r0x_40/10000).toFixed(2) 
                        +" <br>"+" <br>"
                        +" netsummin_r0_5:"+(klj.netsummin_r0_5/10000).toFixed(2) 
                        +" netsummin_r0_10:"+(klj.netsummin_r0_10/10000).toFixed(2)
                        +" netsummin_r0_20:"+(klj.netsummin_r0_20/10000).toFixed(2) 
                        +" netsummin_r0_40:"+(klj.netsummin_r0_40/10000).toFixed(2) 
                        +" <br>"
                        +" netsummin_r0x_5:"+(klj.netsummin_r0x_5/10000).toFixed(2) 
                        +" netsummin_r0x_10:"+(klj.netsummin_r0x_10/10000).toFixed(2)
                        +" netsummin_r0x_20:"+(klj.netsummin_r0x_20/10000).toFixed(2) 
                        +" netsummin_r0x_40:"+(klj.netsummin_r0x_40/10000).toFixed(2) 
                        +" <br>"+" <br>"
                        +" netsum_r0_above:"+(klj.netsum_r0_above/10000).toFixed(2) 
                        +" netsum_r0_below:"+(klj.netsum_r0_below/10000).toFixed(2)
                        +" <br>"
                        +" netsum_r0_above_60:"+(klj.netsum_r0_above_60/10000).toFixed(2)
                        +" netsum_r0_below_60:"+(klj.netsum_r0_below_60/10000).toFixed(2)
                        +" <br>"
                        +" netsummax_r0:"+(klj.netsummax_r0/10000).toFixed(2) +" div day amount:"+(klj.netsummax_r0/klj.amount_ave_8).toFixed(2)
                        +" <br>"
                        +" netsummax_r0_netsum_r0x:"+(klj.netsummax_r0_netsum_r0x/10000).toFixed(2)
                        +" <br>"
                        +"<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                        +stockId.toLowerCase()+".gif\" width=\"400\" height=\"250\"><br>"             

    }
});
//emailbody="";
console.log("win:", wincounter, "lose:", losecounter, "counter:", counter);
if (emailbody!=="") {
//console.log(emailbody);
        var mailutil = require("../mailutil");
        mailutil.sendEmail("Flow", "Total:"+counter+"<br>"+emailbody);
}
console.timeEnd("run");