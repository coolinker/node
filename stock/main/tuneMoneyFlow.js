console.time("run");
var moneyflowio = require("../moneyflow/io").config();
var klineutil = require("../kline/klineutil");

var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");

var today = new Date();
var _m = 1+today.getMonth();
var _d = today.getDate();
var _y = today.getFullYear();

var targetDateStr = (_m>9?_m:"0"+_m) +"/"
        +(_d>9?_d:"0"+_d) +"/"+_y;

targetDateStr = "05/12/2014";
console.log("targetDateStr:"+targetDateStr);     

var daySection = 150;
 
var klineio = require("../kline/klineio").config(startDate, endDate);
var moneyflowforms = require("../kline/form/moneyflowforms")
var stocks = klineio.getAllStockIds();
stocks = ["SH600260"];//["SH600015"];//

var emailbody = "";
var counter = 0;

stocks.forEach(function(stockId) {
    var kLineJson= klineio.readKLineSync(stockId);
    var len = kLineJson.length;
    
    var i;
    for (i=len-1; i>=0; i--) {
        var klj = kLineJson[i];
        if(klj.date === targetDateStr) break;
    }
    if (i===-1) return;

    moneyflowforms.moneyFlowInOut(kLineJson, i, stockId);

});
emailbody="";
if (emailbody!=="") {
//console.log(emailbody);
        var mailutil = require("../mailutil");
        mailutil.sendEmail("Flow", "Total:"+counter+"<br>"+emailbody);
}
console.timeEnd("run");