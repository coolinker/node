var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2016");

var klineprocesser = require("../kline/klineprocessor").config(startDate, endDate);

console.time("run");

//klineprocesser.updateKLinesFromAjax(function(){
//     console.timeEnd("run");
 //});

klineprocesser.updateKLinesFromBase();
console.timeEnd("run");
