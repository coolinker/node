console.time("run");
var fs = require("fs");

var startDate = new Date("01/01/2005");
var endDate = new Date("12/01/2015");
var pendingcount = 0;

var klineio = require("../kline/klineio").config(startDate, endDate);

var stocks = klineio.getAllStockIds();

//stocks = ['SH600016'];

var stockCounter = 0;

var datePending = {};

stocks.forEach(function(stockId) {
    var kLineJson = klineio.readKLineSync(stockId);

    stockCounter++;

    for (var i = 0; i < kLineJson.length; i++) {
        var pobj = kLineJson[i].pendings;
        if (pobj) {
            var date = kLineJson[i].date;
            if (!datePending[date]) datePending[date] = {
                count: 0,
                sum: 0,
                latestCount:0,
                latestRatio:0,
                stopCount:0,
                stopWinCount:0
            };
            datePending[date].latestCount++;
            var latestRatio;
            var lastDay;
            for (var d in pobj) {
                datePending[date].count++;
                datePending[date].sum += pobj[d].ratio;
                var pobjdate = new Date(d) ;

                if (!lastDay || pobjdate > lastDay) {
                    lastDay = pobjdate;
                    latestRatio = pobj[d].ratio;
                }
            }
            datePending[date].latestRatio += latestRatio;
        }
        
        if (kLineJson[i].stop) {
            if (!datePending[date]) datePending[date] = {stopCount:0, stopWinCount:0};
            datePending[date].stopCount++;
            var stop = kLineJson[i].stop;
            for (var sdate in stop) {
                if (stop[sdate]==="win") datePending[date].stopWinCount++;
                // else if (stop[sdate]==="lose") datePending[date].stopLoseCount++;
                // else {
                //     console.log("error: not win or lose", stockId, sdate, stop);
                //     pendingcount++;
                // }
            }

        }

    }

    if (stockCounter == stocks.length) {
        var dates = [];
        for (var dt in datePending) {
            datePending[dt].ratio = Number((datePending[dt].sum / datePending[dt].count).toFixed(4));
            delete datePending[dt].sum;
            datePending[dt].latestRatio = Number((datePending[dt].latestRatio / datePending[dt].latestCount).toFixed(4));
            delete datePending[dt].sum;
            //console.log(dt, datePending[dt].count, datePending[dt].ratio, datePending[dt])
            dates.push(dt);
        }

        dates  = dates.sort(function(d1, d2) {
            var dt1 = new Date(d1);
            var dt2 = new Date(d2);
            if (dt1>dt2) return 1;
            if (dt1<dt2) return -1;
            return 0;
        });

        var output="";
        var dateslen = dates.length;
        for (var i=0; i<dateslen; i++) {
            //console.log(dates[i], datePending[dates[i]]);
            output +=  "\""+dates[i]+"\":"+JSON.stringify(datePending[dates[i]]) 
            if (i<dateslen-1) output += ",\r\n";
        }
        output = "{" + output + "}";
        //var output = JSON.stringify(datePending);
        fs.writeFileSync("../config/daypendings.json", output);
        //console.log("pendingcount", pendingcount)
        console.timeEnd("run");

    }
});