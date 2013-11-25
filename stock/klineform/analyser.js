var klineutil = require("../klineutil");
var bullklineforms = require("./bullklineforms");

function traverseForAppearance(methods, klineJson, result, options) {
    var len = klineJson.length;
    var displayEveryCase = options.displayEveryCase;
    var displayInfoToDate = options.displayInfoToDate;
    var displayInfoFromDate = options.displayInfoFromDate;

    for (var i=50; i<len; i++) {
        var arr = [];
        var rel = klineutil.winOrLoss(klineJson, i, -0.1, 0.05, 15);
        methods.forEach(function(mtd) {
            if(bullklineforms[mtd](klineJson, i) === true) {
                var date = klineJson[i].date;
                if (result[mtd] === undefined) {
                    result[mtd] = [];
                }

                result[mtd].push({date:date, inc:rel});
                arr.push(mtd);
               
                if (!displayEveryCase) return;

                var dObj = new Date(date);
                if (dObj >= displayInfoFromDate && dObj <= displayInfoToDate) {
                    console.log(date, options.stockId);
                }

            }
        });

        if(false && arr.length>1) {
            //var rel = klineutil.winOrLoss(klineJson, i, -0.1, 0.05, 10);
            console.log(klineJson[i].date, arr, rel);
        }
    }

}

function traverseForWinning(method, klineJson, lossStop, winStop, daysStop, options) {
    var result = {total:0, win:0};
    var len = klineJson.length;
    var showLog = options.showLog;
    var showLogDates = options.showLogDates
    for (var i=50; i<len; i++) {
        if (options.passAll || bullklineforms[method](klineJson, i) 
            || (options.overlap && bullklineforms[options.overlap](klineJson, i))) {
                
                var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, daysStop);
                //console.log(options.stockId, klineJson[i].date, rel.toFixed(2));
                //console.log();
                // '02/20/2013' '03/05/2013'
                if (showLog) console.log(options.stockId, klineJson[i].date, rel);
                else if (showLogDates.indexOf(klineJson[i].date)>-1) console.log(options.stockId, klineJson[i].date, rel);

                if (rel>winStop) {
                    result.win++;
                }
                result.total++;
                
            }

    }
    return result;
}

function bullKLineFromMethods() {
    var methods = [];
    for (var attr in bullklineforms) {
        methods.push(attr);
    }

    return methods;
}

exports.bullKLineFromMethods = bullKLineFromMethods;

exports.traverseForWinning = traverseForWinning;
exports.traverseForAppearance = traverseForAppearance;