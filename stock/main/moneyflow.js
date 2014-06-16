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
//stocks = ["SH600518"];//["SH600015"];//

var emailbody = "";
var counter = 0, losecounter = 0;
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

    var low_index_5 = klineutil.lowItemIndex(kLineJson, i-5, i, "close");
    var low_index_20 = klineutil.lowItemIndex(kLineJson, i-20, i, "low");
    var low_index_40 = klineutil.lowItemIndex(kLineJson, i-40, i, "low");
    //var aboveitems_15 = klineutil.higherItemsIndex(kLineJson, i-15, i, "low", kLineJson[i].close);
    var belowitems = klineutil.lowerItemsIndex(kLineJson, maxr0netsumidx, i, "high", kLineJson[i].close);
    var belowitems_30 = klineutil.lowerItemsIndex(kLineJson, i-30, i, "high", kLineJson[i].close);
    var belowitems_low = klineutil.lowerItemsIndex(kLineJson, maxr0netsumidx, i-10, "low", kLineJson[i].low);
    var belowitems_high_30 = klineutil.higherItemsIndex(kLineJson, i-30, i, "high", kLineJson[i].close);
    // console.log(stockId, valuablecount, startidx-maxr0netsumidx, kLineJson[maxr0netsumidx].date, 
    //         kLineJson[startidx].date, "aboveitems:"+aboveitems.length, "belowitems:"+belowitems.length,
    //         "sum5:"+(sum5/10000).toFixed(2), "sum10:"+(sum10/10000).toFixed(2),
    //         "sum20:"+(sum20/10000).toFixed(2), "sum40:"+(sum40/10000).toFixed(2),
    //         "aboveitems_half:"+aboveitems_half.length,
    //         "sumabove:"+(sumabove/10000).toFixed(2), "sumbelow:"+(sumbelow/10000).toFixed(2),
    //      (r0netsum/10000).toFixed(2), (r0xnetsum/10000).toFixed(2))
    if (duration>60 
        //&& belowitems_low.length>0
        && belowitems_30.length<10
        && belowitems.length < duration/3
        && klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>0.5*klj.amount_ave_21
        && klj.netsum_r0_above > 1.5*klj.netsum_r0_below
        && klj.netsummin_r0_40 > -0.5*klj.amount_ave_21
        && klj.netsummax_r0x_10 < 0.2*klj.amount_ave_8
        && klj.netsum_r0_40 > -klj.netsum_r0x_40
        && klj.netsum_r0_20 > -klj.netsum_r0x_20
        && klj.netsum_r0_20 > 0
        && klj.netsum_r0_10 > -0.2*klj.amount_ave_8
        && klj.netsummin_r0x_40> -2*klj.amount_ave_21
        && klj.netsummin_r0_10> -0.2*klj.amount_ave_21
        && klj.netsummin_r0_5> -0.05*klj.amount_ave_21
        //***********&& klj.netsummin_r0x_10 + klj.netsummax_r0_10 > -0.8*klj.amount_ave_8
        ) {
        counter++;
        if (klj.winOrLose === "lose") {
         console.log("\r\n", klj.winOrLose, counter, stockId, duration, kLineJson[maxr0netsumidx].date, klj.date, 
                "\r\n",
                "amount_ave_21:"+(klj.amount_ave_21/10000).toFixed(2), "amount_ave_8:"+(klj.amount_ave_8/10000).toFixed(2),
                "\r\n",
                "aboveitems:"+aboveitems.length, "belowitems:"+belowitems.length, "belowitems_30:"+belowitems_30.length,
                "\r\n","\r\n",
                "netsum_r0_5:"+(klj.netsum_r0_5/10000).toFixed(2), 
                "netsum_r0_10:"+(klj.netsum_r0_10/10000).toFixed(2),
                "netsum_r0_20:"+(klj.netsum_r0_20/10000).toFixed(2), 
                "netsum_r0_40:"+(klj.netsum_r0_40/10000).toFixed(2), 
                "\r\n",
                "netsum_r0x_5:"+(klj.netsum_r0x_5/10000).toFixed(2), 
                "netsum_r0x_10:"+(klj.netsum_r0x_10/10000).toFixed(2),
                "netsum_r0x_20:"+(klj.netsum_r0x_20/10000).toFixed(2), 
                "netsum_r0x_40:"+(klj.netsum_r0x_40/10000).toFixed(2), 
                "\r\n","\r\n",
                "netsummax_r0_5:"+(klj.netsummax_r0_5/10000).toFixed(2), 
                "netsummax_r0_10:"+(klj.netsummax_r0_10/10000).toFixed(2),
                "netsummax_r0_20:"+(klj.netsummax_r0_20/10000).toFixed(2), 
                "netsummax_r0_40:"+(klj.netsummax_r0_40/10000).toFixed(2), 
                "\r\n",
                "netsummax_r0x_5:"+(klj.netsummax_r0x_5/10000).toFixed(2), 
                "netsummax_r0x_10:"+(klj.netsummax_r0x_10/10000).toFixed(2),
                "netsummax_r0x_20:"+(klj.netsummax_r0x_20/10000).toFixed(2), 
                "netsummax_r0x_40:"+(klj.netsummax_r0x_40/10000).toFixed(2), 
                "\r\n","\r\n",
                "netsummin_r0_5:"+(klj.netsummin_r0_5/10000).toFixed(2), 
                "netsummin_r0_10:"+(klj.netsummin_r0_10/10000).toFixed(2),
                "netsummin_r0_20:"+(klj.netsummin_r0_20/10000).toFixed(2), 
                "netsummin_r0_40:"+(klj.netsummin_r0_40/10000).toFixed(2), 
                "\r\n",
                "netsummin_r0x_5:"+(klj.netsummin_r0x_5/10000).toFixed(2), 
                "netsummin_r0x_10:"+(klj.netsummin_r0x_10/10000).toFixed(2),
                "netsummin_r0x_20:"+(klj.netsummin_r0x_20/10000).toFixed(2), 
                "netsummin_r0x_40:"+(klj.netsummin_r0x_40/10000).toFixed(2), 
                "\r\n","\r\n",
                "netsum_r0_above:"+(klj.netsum_r0_above/10000).toFixed(2), 
                "netsum_r0_below:"+(klj.netsum_r0_below/10000).toFixed(2),
                "\r\n",
                "netsum_r0_above_60:"+(klj.netsum_r0_above_60/10000).toFixed(2),
                "netsum_r0_below_60:"+(klj.netsum_r0_below_60/10000).toFixed(2),
                "\r\n",
                "netsummax_r0:                "+(klj.netsummax_r0/10000).toFixed(2), 
                "\r\n",
                "netsummax_r0_netsum_r0x:"+(klj.netsummax_r0_netsum_r0x/10000).toFixed(2),
                "\r\n--------------------");
            losecounter++;
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
                        +"duration:"+(duration)+" above:"+aboveitems.length+" below:"+belowitems.length
                        +"<br>"
                        +"amount_ave_21:"+(klj.amount_ave_21/10000).toFixed(2) + " amount_ave_8:"+(klj.amount_ave_8/10000).toFixed(2)
                        +"<br>"
                        +"aboveitems:"+aboveitems.length+ " belowitems:"+belowitems.length+" belowitems_30:"+belowitems_30.length
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
                        +" netsummax_r0:"+(klj.netsummax_r0/10000).toFixed(2) 
                        +" <br>"
                        +" netsummax_r0_netsum_r0x:"+(klj.netsummax_r0_netsum_r0x/10000).toFixed(2)
                        +" <br>"
                        +"<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                        +stockId.toLowerCase()+".gif\" width=\"400\" height=\"250\"><br>"             

    }
});
//emailbody="";
console.log("lose:", losecounter, "counter:", counter);
if (emailbody!=="") {
//console.log(emailbody);
        var mailutil = require("../mailutil");
        mailutil.sendEmail("Flow", "Total:"+counter+"<br>"+emailbody);
}
console.timeEnd("run");