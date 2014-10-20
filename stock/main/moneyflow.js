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
//stocks = ["SH600250"];//["SH600015"];//
function _f(amount){
    var str = (amount/10000).toFixed(2);
    if (str.indexOf(".")>(amount<0?4:3)) {
        str = str.substring(0,str.indexOf(".")-3)+","+str.substring(str.indexOf(".")-3);
    }
    return str;
}
var emailbody = "";
var counter = 0, losecounter = 0, wincounter = 0;

//stocks = ["SZ002199"]
stocks.forEach(function(stockId) {
    var klineJson= klineio.readKLineSync(stockId);
    var len = klineJson.length;
    
    var i = len-1;
    for (; i>=0; i--) {
        var klj = klineJson[i];
        if(klj.date === targetDateStr) break;
    }
    if (i<0) {
        return;
    }
    var maxr0netsumidx = i-klj.netsummax_r0_duration;
   
    //var inc = klineutil.increase(klineJson[maxr0netsumidx].open, klineJson[i].close);
    var duration = klj.netsummax_r0_duration;

    
    var low_index_20 = klineutil.lowItemIndex(klineJson, i-20, i, "low");
    var low_index_40 = klineutil.lowItemIndex(klineJson, i-40, i-5, "low");
    var low_index_60 = klineutil.lowItemIndex(klineJson, i-60, i-5, "low");
    var longDownNeedle = 0, longDownNeedleDates = [];
    var bigLowSmallVolume = 0, bigLowSmallVolumeDates = [];
    var bigDownBigAmount = 0;
    for (var j=i; j>=1 && i-j<10; j--) {
        //if (!klineJson[j]) console.log("stockId", stockId, j, klineJson.length)
        if(klineutil.increase(klineJson[j].close, klineJson[j-1].close) > 0
            //&& klineutil.increase(klineJson[j].amount, klineJson[j-1].amount_ave_8)>0
            && (klineutil.increase(klineJson[j].low, klineJson[j-1].close) > 0.8*klineJson[j].amplitude_ave_21
            && klineutil.increase(klineJson[j].amount_ave_21, klineJson[j].amount) < -0.1
            && klineutil.increase(klineJson[j].low, klineJson[j-1].close) > 0.8*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j].amount_ave_8, klineJson[j].amount) < -0.1)) {
            bigLowSmallVolume++;
            bigLowSmallVolumeDates.push(klineJson[j].date)
            //if (stockId==="SH600012")
            //console.log(stockId, klineJson[j].date, klineutil.increase(klineJson[j].low, klineJson[j-1].close) , klineJson[j].inc_ave_8, klineJson[j].inc_ave_21)
        }
            
        // console.log(klineJson[j].date, 
        //     klineutil.increase(klineJson[j].close, klineJson[j].open),
        //     0.3*klineJson[j].amplitude_ave_21,
        //     klineutil.increase(klineJson[j].volume_ave_21, klineJson[j].volume),
        //     klineutil.increase(klineJson[j].volume_ave_8, klineJson[j].volume),
        //     klineutil.increase(klineJson[j-1].volume, klineJson[j].volume))
        
        if(i-j<5 && klineutil.increase(klineJson[j].close, klineJson[j].open) > 0
            && (klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.3*klineJson[j].amplitude_ave_21
            && klineutil.increase(klineJson[j].volume_ave_21, klineJson[j].volume) > 0.05
            || klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.3*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j].volume_ave_8, klineJson[j].volume) > 0.05)
            || klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.3*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j-1].volume, klineJson[j].volume) > 0.1) {
            bigDownBigAmount++;
            //bigLowSmallVolumeDates.push(klineJson[j].date)
            //if (stockId==="SH600012")
            //console.log("------")
        }  

        // console.log(klineJson[j].date, klineutil.increase(klineJson[j].low, Math.min(klineJson[j].close, klineJson[j].open)), 0.5*klineJson[j].amplitude_ave_8,
        //     "+++", klineutil.increase(Math.max(klineJson[j].close, klineJson[j].open), klineJson[j].high))
        if ((klineutil.increase(klineJson[j].low, Math.min(klineJson[j].close, klineJson[j].open)) > 0.3*klineJson[j].amplitude_ave_8
            || klineutil.increase(Math.max(klineJson[j].close, klineJson[j].open), klineJson[j].high) > 0.3*klineJson[j].amplitude_ave_8)
            &&klineJson[j].r0_net>=0) {
            longDownNeedle++;
            longDownNeedleDates.push(klineJson[j].date)
        }
    }   
 // console.log((longDownNeedle> 0 || bigLowSmallVolume>0)
 //        , i-low_index_40 > 10
 //        , klj.close > klineJson[low_index_40].low*0.99
 //        , klineutil.increase(klineJson[low_index_40].low, klj.close) < 2 * klj.amplitude_ave_21
 //        , klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>klj.amount_ave_21
 //        , (klj.netsum_r0_20 > 0 || klj.netsum_r0_40 > 0)
 //        ,klj.netsum_r0_above_60> 0.5*klj.amount_ave_21
 //        , klj.netsum_r0_above > klj.netsum_r0_below
 //        )
    if (duration>60
        //&& bigDownBigAmount < 1
        && (longDownNeedle> 0 || bigLowSmallVolume>0)
        
        // && i-low_index_20 > 13
        // && klineJson[i].close > 0.99*klineJson[low_index_20].low
        // && klineutil.increase(klineJson[low_index_20].low, klineJson[i].close) < 1.5*klineJson[i].amplitude_ave_21

        && i-low_index_40 > 10
        // && klj.close > klineJson[low_index_40].low*0.99
        && klineutil.increase(klineJson[low_index_40].low, klj.close) < 2 * klj.amplitude_ave_21
        
        && klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>klj.amount_ave_21
        && (klj.netsum_r0_20 > 0 || klj.netsum_r0_40 > 0)

        //&& klj.netsum_r0_above+klj.netsum_r0x_above>0.5*klj.amount_ave_21
        && klj.netsum_r0_above_60> 0.5*klj.amount_ave_21
        //&& klj.netsum_r0_above > klj.netsum_r0_below
        //***********&& klj.netsummin_r0x_10 + klj.netsummax_r0_10 > -0.8*klj.amount_ave_8
        ) {
        counter++;
        if (klj.winOrLose === "win") {
            wincounter++;
        }
        //console.log(stockId, longDownNeedle, _f(klj.netsum_r0_40 + klj.netsum_r0x_40), _f(klj.netsummax_r0+klj.netsummax_r0_netsum_r0x))
        if (klj.winOrLose === "lose") {
            losecounter++;
         console.log("\r\n"+stockId, duration, klineJson[maxr0netsumidx].date, klj.date)
         console.log("bigLowSmallVolume:", bigLowSmallVolumeDates.length, "longDownNeedle", longDownNeedleDates.length, "bigDownBigAmount", bigDownBigAmount);
         console.log(_f(klj.netsum_r0_above), _f(klj.netsum_r0x_above), " / ", _f(klj.netsum_r0_below), _f(klj.netsum_r0x_below))
         console.log(_f(klj.netsummax_r0), " / ", _f(klj.netsummax_r0_netsum_r0x), (klj.netsummax_r0/klj.amount_ave_8).toFixed(2));
         //console.log(_f(klj.netsummax_r0+klj.netsummax_r0_netsum_r0x));
        }         
        /*
        emailbody += "<a href='http://vip.stock.finance.sina.com.cn/moneyflow/#!ssfx!"+stockId.toLowerCase()+"'>"
                        +stockId+"</a> "
                        + klineJson[maxr0netsumidx].date+"-"+targetDateStr+" <br>"
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
                        + "<b>"+klineJson[maxr0netsumidx].date+"-"+targetDateStr+"</b> "+klj.winOrLose+"<br>"
                        //+"duration:"+(duration)+" above:"+aboveitems.length+" below:"+belowitems.length
                        //+"<br>"
                        +"amount_ave_21:"+_f(klj.amount_ave_21) + " amount_ave_8:"+_f(klj.amount_ave_8)
                        +"<br>"
                        //+"aboveitems:"+aboveitems.length+ " belowitems:"+belowitems.length+" belowitems_30:"+belowitems_30.length
                        +"<br>"
                        +" netsum_r0_5:"+_f(klj.netsum_r0_5)
                        +" netsum_r0_10:"+_f(klj.netsum_r0_10)
                        +" netsum_r0_20:"+_f(klj.netsum_r0_20) 
                        +" netsum_r0_40:"+_f(klj.netsum_r0_40)
                        +" <br>"
                        +" netsum_r0x_5:"+_f(klj.netsum_r0x_5)
                        +" netsum_r0x_10:"+_f(klj.netsum_r0x_10)
                        +" netsum_r0x_20:"+_f(klj.netsum_r0x_20) 
                        +" netsum_r0x_40:"+_f(klj.netsum_r0x_40) 
                        +" <br>"//+" <br>"
                        +"<font color='#888888' size='2'>"
                        +" netsummax_r0_5:"+_f(klj.netsummax_r0_5)
                        +" netsummax_r0_10:"+_f(klj.netsummax_r0_10)
                        +" netsummax_r0_20:"+_f(klj.netsummax_r0_20)
                        +" netsummax_r0_40:"+_f(klj.netsummax_r0_40)
                        +" <br>"
                        +" netsummax_r0x_5:"+_f(klj.netsummax_r0x_5)
                        +" netsummax_r0x_10:"+_f(klj.netsummax_r0x_10)
                        +" netsummax_r0x_20:"+_f(klj.netsummax_r0x_20)
                        +" netsummax_r0x_40:"+_f(klj.netsummax_r0x_40) 
                        +" <br>"//+" <br>"
                        +" netsummin_r0_5:"+_f(klj.netsummin_r0_5) 
                        +" netsummin_r0_10:"+_f(klj.netsummin_r0_10)
                        +" netsummin_r0_20:"+_f(klj.netsummin_r0_20) 
                        +" netsummin_r0_40:"+_f(klj.netsummin_r0_40) 
                        +" <br>"
                        +" netsummin_r0x_5:"+_f(klj.netsummin_r0x_5) 
                        +" netsummin_r0x_10:"+_f(klj.netsummin_r0x_10)
                        +" netsummin_r0x_20:"+_f(klj.netsummin_r0x_20) 
                        +" netsummin_r0x_40:"+_f(klj.netsummin_r0x_40) 
                        +" <br>"//+" <br>"
                        +"</font>"
                        +" netsum_r0_above:"+_f(klj.netsum_r0_above) 
                        +" netsum_r0_below:"+_f(klj.netsum_r0_below)
                        //+" <br>"
                        +" netsum_r0_above_60:"+_f(klj.netsum_r0_above_60)
                        +" netsum_r0_below_60:"+_f(klj.netsum_r0_below_60)
                        +" <br><b>"
                        +" netsummax_r0:"+_f(klj.netsummax_r0) +" ("+(klj.netsummax_r0/klj.amount_ave_8).toFixed(2)+")"
                        //+" <br>"
                        +"+ netsummax_r0_netsum_r0x:"+_f(klj.netsummax_r0_netsum_r0x)
                        +" = "+_f((klj.netsummax_r0+klj.netsummax_r0_netsum_r0x)) 
                        +" ("+((klj.netsummax_r0+klj.netsummax_r0_netsum_r0x)/klj.amount_ave_8).toFixed(2)+")"
                        +"</b> <br>"
                        +"<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                        +stockId.toLowerCase()+".gif\" width=\"400\" height=\"250\"><br>"             

    }
});
//emailbody="";
console.log("win:", wincounter, (wincounter/counter).toFixed(2), "lose:", losecounter, (losecounter/counter).toFixed(2), "counter:", counter);
if (emailbody!=="") {
//console.log(emailbody);
        var mailutil = require("../mailutil");
        mailutil.sendEmail("Flow", "Total:"+counter+"<br>"+emailbody);
}
console.timeEnd("run");