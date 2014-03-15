console.time("run");
var fs = require("fs");

var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 

var klineio = require("../klineio").config(startDate, endDate);

var stocks = klineio.getAllStockIds();

//stocks = ['SZ000970'];

var stockCounter = 0;

var datePending = {};

stocks.forEach(function (stockId) {
        klineio.readKLine(stockId, function(kLineJson) {

            stockCounter++;

            for (var i=0; i<kLineJson.length; i++) {                
                var pobj = kLineJson[i].pendings;
                if (pobj) {
                    var date = kLineJson[i].date;
                    if (!datePending[date]) datePending[date] = {count:0, sum:0};
                    for (var d in pobj) {
                        datePending[date].count++;
                        datePending[date].sum += pobj[d].ratio;
                    }

                }
                
            }

            if (stockCounter==stocks.length) {
                for (var dt in datePending) {
                    datePending[dt].ratio = Number((datePending[dt].sum/datePending[dt].count).toFixed(4));
                    delete datePending[dt].sum;
                }
                //console.log(datePending);
                var output = JSON.stringify(datePending);    
                fs.writeFileSync("../config/daypendings.json", output);

                console.timeEnd("run");

            }
        });

    });
