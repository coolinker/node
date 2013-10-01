var klineio = require("./klineio");
var klineprocesser = require("./klineprocessor");
var stockId = "SH600000";
console.log("readKLine: "+stockId);

klineio.readKLineBase(stockId, function(kLineJason) {
    //console.log(kLineJason);
    klineprocesser.exRightsDay(kLineJason);
    klineprocesser.average(kLineJason, "close", 8);
    klineprocesser.average(kLineJason, "close", 21);
    klineprocesser.average(kLineJason, "close", 55);
    klineprocesser.average(kLineJason, "volume", 8);
    klineprocesser.average(kLineJason, "volume", 21);

    //klineprocesser.markPeak(kLineJason, "high", 0.005);
    //klineprocesser.smoothPeak(kLineJason, "high", 2);

    klineprocesser.markTrough(kLineJason, "low", 0.005);
    klineprocesser.smoothTrough(kLineJason, "low", 2);

    klineio.writeKLine(stockId, kLineJason, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});