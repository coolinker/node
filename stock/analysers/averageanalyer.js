
var klineutil = require("../klineutil");

function on8While21Up(klineJson, lossStop, winStop) {
    var result = {total:0, win:0};

    for (var i=8; i<klineJson.length-3; i++) {
        //if (false && klineJson[i].date==="02/11/2011") {
        //    console.log(klineJson[i-1].close_ave_8 , klineJson[i-3].close_ave_8);
        //}
        var min5 = klineJson[i].open+(klineJson[i].close-klineJson[i].open)/5;
        var min3 = klineJson[i].open+(klineJson[i].close-klineJson[i].open)/3;
        if (klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-1].close, klineJson[i].close)
            && klineJson[i].close_ave_21 - klineJson[i-1].close_ave_21 >= 0.0
//            && klineJson[i-1].close_ave_8 < klineJson[i-3].close_ave_8
            && klineJson[i+1].low > min3
            && klineJson[i+2].low > min5
            && klineJson[i+3].low > min5

            && klineutil.increase(klineJson[i+3].close_ave_8, klineJson[i+3].low) < 0.04

            && klineutil.increase(klineJson[i].close, klineJson[i+1].high) < 0.05
            && klineutil.increase(klineJson[i].close, klineJson[i+2].high) < 0.05
            
            && klineutil.inBetween(klineutil.increase(klineJson[i].close_ave_55, klineJson[i-5].close_ave_55), 0, 0.02)
            
            && klineutil.increase(klineJson[i].close_ave_144, klineJson[i].close) > -0.05
            && klineutil.increase(klineJson[i].close - klineJson[i].open, klineJson[i].high - klineJson[i].close) < 0
            ) {
                var stressidx = klineutil.highItemIndex(klineJson, i, i+3, "close");
                var stress = klineutil.detectStress(klineJson, stressidx, 80);
                var support = klineutil.detectSupport(klineJson, i, 80);
                //console.log(klineJson[i].date, stress);
                //if (stress >= 4) continue;

                var rel = klineutil.winOrLoss(klineJson, i+3, lossStop, winStop);
                console.log(klineJson[i].date, klineJson[i+3].date, rel.toFixed(2));
                console.log();

                if (rel>0) {
                    result.win++;
                }
                result.total++;
                
            }

    }
    return result;
}

exports.on8While21Up = on8While21Up;