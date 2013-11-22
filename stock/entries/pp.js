var klineprocesser = require("../klineprocessor");

console.time("run");

klineprocesser.updateKLines();

console.timeEnd("run");
