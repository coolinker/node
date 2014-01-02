var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");

var klineprocesser = require("../klineprocessor").config(startDate, endDate);

console.time("run");

klineprocesser.updateKLines();

console.timeEnd("run");
