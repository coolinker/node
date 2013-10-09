
var klineutil = require("../klineutil");

function on8While21Up(klineJson, lossStop, winStop) {
    var result = {total:0, win:0};

    for (var i=8; i<klineJson.length-3; i++) {
        //if (false && klineJson[i].date==="02/11/2011") {
        //    console.log(klineJson[i-1].close_ave_8 , klineJson[i-3].close_ave_8);
        //}
        var min3 = klineJson[i].open+(klineJson[i].close-klineJson[i].open)/3;
        var min5 = klineJson[i].open+(klineJson[i].close-klineJson[i].open)/5;
        if (klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-1].close, klineJson[i].close)
            && klineJson[i+3].close_ave_21 >= klineJson[i].close_ave_21
            && klineJson[i+1].low > min3
            && klineJson[i+2].low > min3
            && klineJson[i+3].low > min3

            && klineutil.increase(klineJson[i-1].close_ave_8, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i-2].close_ave_8, klineJson[i-2].close) < 0.0
            && klineutil.increase(klineJson[i-3].close_ave_8, klineJson[i-3].close) < 0.0

            
            && klineutil.inBetween(klineutil.increase(klineJson[i].close_ave_55, klineJson[i-5].close_ave_55), 0.0, 0.04)
            && klineutil.increase(klineJson[i].close_ave_144, klineJson[i].close) > -0.05
            ) {
                if (detectGapDownStress(klineJson, i+3)!==undefined)  continue;

                var rel = klineutil.winOrLoss(klineJson, i+3, lossStop, winStop);
                //console.log(klineJson[i].date, klineJson[i+3].date, rel.toFixed(2));
                //console.log();

                if (rel>0) {
                    result.win++;
                }
                result.total++;
                
            }

    }
    return result;
}

function detectGapDownStress(klineJson, idx, interval, upper) {
    interval = interval || 100;
    upper = upper || 0.05;
    var price = klineJson[idx].close;
    var highPeak = klineJson[idx].high;

    for (var i=idx; i>=0 && idx-i<interval; i--) {
        var weight = interval-idx+i;
        if (klineJson[i].gapDown !== undefined
            //&& klineJson[i].gapDown < -0.02
            && highPeak < klineJson[i-1].low
            && klineutil.inBetween(klineutil.increase(price, klineJson[i-1].close), 0.01, upper)) {
            return klineJson[i].gapDown;            
        }

        if (klineJson[i].high_peak === true) {
            highPeak = Math.max(klineJson[i].high, highPeak);
        }
    }

    return undefined;
}
exports.on8While21Up = on8While21Up;