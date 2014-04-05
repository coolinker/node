
var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");
targetDate = "04/04/2014";
targetRatio = 0.75;

var intersectionprocessor = require("../klineform/intersectionprocessor").config(3);
var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var klineutil = require("../klineutil");
var klineio = require("../klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();

var counter = 0;
console.time("run");
var mtds = klineformanalyser.kLineFormMethods();

for (var stockidx=0; stockidx<stocks.length; stockidx++) {
    var stockId = stocks[stockidx];

    var kLineJson = klineio.readKLineSync(stockId);
    for (var i=kLineJson.length-1; i>=0; i--) {
        
        if (kLineJson[i].date===targetDate) {
            var forms = klineformanalyser.tryForms(mtds, kLineJson, i);
            if (forms.length>0) {
                
                var ratio = intersectionprocessor.matchRatio(forms);
                if (ratio>targetRatio) {
                    console.log(stockId, ratio, forms);
                    counter++;
                }
            }
            break;
        }
    }
}
console.log(counter);
console.timeEnd("run");

