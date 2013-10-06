var klineio = require("./klineio");
var klineprocesser = require("./klineprocessor");
var averageanalyer = require("./analysers/averageanalyer");

var stockId = "SH600778";//"SH600778";//

var stocks = klineio.getAllStockIds();
stocks = ["SH600778", "SH600163", "SH600000"];

var stockidx=0;

totalsample = 0;
winsample = 0;
winstocks = 0;


doit(stockidx);

//klineprocesser.updateKLines("SZ");

function doit(index) {
    if (index>=stocks.length) {
        console.log(winsample+"/"+totalsample+"="+(winsample/totalsample).toFixed(3), winstocks);
        return;
    }
    var stockId = stocks[index];

    klineio.readKLine(stockId, function(kLineJason) {
        if (stockId.indexOf("SZ300")>=0) {
            doit(index+1);  
            return;
        }
        var result = averageanalyer.on8While21Up(kLineJason, 0.05, 0.05);

        totalsample += result.total;
        winsample +=result.win;
        console.log(stockId, result.total>0?(result.win/result.total).toFixed(3):"--", result);
        console.log("===================");
        if (result.total > 0 && result.win/result.total < 0.5) {
            doit(index+1);  

        } else {
            winstocks++;
            doit(index+1);
        }

        
    });

}

