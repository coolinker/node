
var klineutil = require("../klineutil");

function traverseForAppearance(methods, klineJson, result) {
    var len = klineJson.length;
    var me = this;
    for (var i=50; i<len; i++) {
        var arr = [];
        var rel = klineutil.winOrLoss(klineJson, i, -0.1, 0.05, 15);
        methods.forEach(function(mtd) {
            if(me[mtd](klineJson, i) === true) {
                var date = klineJson[i].date;
                if (result[mtd] === undefined) {
                    result[mtd] = [];
                }

                result[mtd].push({date:date, inc:rel});
                arr.push(mtd);
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
        if (options.passAll || this[method](klineJson, i)) {
                
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

function sidewaysCompression (klineJson, i) {
    var lidx = klineutil.lowItemIndex(klineJson, i-20, i, "low");
    var lval = klineJson[lidx].low;

    var hidx = klineutil.highItemIndex(klineJson, lidx-30, lidx, "high");
    var hval = klineJson[hidx].high;
    
    var midx = Math.round((hidx + lidx)/2);
    var plidx = klineutil.lowItemIndex(klineJson, hidx-20, hidx, "low");
    var plval = klineJson[plidx].low;

    var downhl = klineutil.increase(lval, hval);    
    var downlpl = klineutil.increase(plval, lval);
    if (false && klineJson[i].date==="09/30/2013") {
        console.log(klineJson[hidx].close, klineJson[midx].close_ave_8, klineJson[lidx].close_ave_8);
        console.log(i, lidx, hidx, downhl, downlpl);
    }
    var amp = klineJson[i].amplitude_ave_8;

    return klineutil.increase(klineJson[i].close, klineJson[hidx].high) < 0.0
        && klineutil.increase(klineJson[i-1].close, klineJson[hidx].high) > 0.0
        //&& klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.0
        
        //&& klineJson[i].volume > 1.5 *klineJson[i].volume_ave_8
        //&& klineJson[i].volume < klineJson[hidx].volume
        && hidx < i-20
        //&& lidx > i-20
        //&& downhl< 0.3
        && lval > plval
        //&& klineJson[hidx].close > 1.02*klineJson[midx].close_ave_8
        //&& klineJson[midx].close_ave_8 > 1.02*klineJson[lidx].close_ave_8

        //&& klineJson[hidx].volume_ave_8 > 1.1*klineJson[midx].volume_ave_8
        //&& klineJson[hidx].volume_ave_8 > 1.1*klineJson[lidx].volume_ave_8

}
/**
 * (-0.1, 0.05, 10) / 65.35%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 * 07/31/2009, 03/16/2012
 */
function morningStar(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    var lowIdx = klineutil.lowItemIndex(klineJson, i-40, i, "low");
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -0.03
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02
        && klineutil.increase(klineJson[i-2].close, klineJson[i].close) > -0.01
        && klineutil.increase(klineJson[i-2].volume_ave_8, klineJson[i-2].volume) < 0.618
        && klineutil.increase(klineJson[i-3].volume, klineJson[i-2].volume) < 0.618
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.618
        
}
/**
 * (-0.1, 0.05, 12) / 65%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redNGreenRed(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > amp * 1

            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < amp
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < amp * 0.5
            
            && ((klineutil.increase(klineJson[i-4].open, klineJson[i-1].close) >= 0
            && klineutil.increase(klineJson[i-4].open, klineJson[i-2].close) >= 0
            && klineutil.increase(klineJson[i-4].open, klineJson[i-3].close) >= 0
            && klineutil.increase(klineJson[i-4].open, klineJson[i-4].close) > amp * 0.4)
            ||(klineutil.increase(klineJson[i-3].open, klineJson[i-1].close) >= 0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < amp * 0.5
            && klineutil.increase(klineJson[i-3].open, klineJson[i-3].close) > amp * 0.5))


}

/**
 * (-0.1, 0.05, 15) / 66.45%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRed(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > amp * 0.8
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) <= 0.0
            && klineutil.increase(klineJson[i-1].open, klineJson[i].close) > -0.03

}

/**
 * (-0.1, 0.05, 12) / 63.71%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redGreenRed(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > amp*0.8
            //&& klineutil.increase(klineJson[i-2].close, klineJson[i].close) > -0.05
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > -0.02
}
/**
 * (-0.1, 0.05, 30) / 70.56%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function red3(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_55;
    
    return klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-2].open, klineJson[i].close) === 0
            && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0
            && klineutil.increase(klineJson[i].close, klineJson[i].high) < amp
            && klineutil.increase(klineJson[i-1].close, klineJson[i].close) > 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) <= 0

            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i-1].high) < amp
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) <= 0

            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > 0
            && klineutil.increase(klineJson[i-2].close, klineJson[i-2].high) < amp
            && (klineutil.increase(klineJson[i-3].close, klineJson[i-3].close_ave_55) > 0
              || klineutil.increase(klineJson[i-3].close, klineJson[i-3].close_ave_144) > 0)
}

/**
 * (-0.1, 0.05, 12) / 63.3%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21UpVolumeHigh(klineJson, i) {
    return klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-1].close, klineJson[i].close) === 0
            && klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21) >= 0.0
            && klineutil.inBetween(klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume), -0.25, 0.5) === 0
           
            // && klineutil.increase(klineJson[i-2].close_ave_21, klineJson[i-1].close_ave_21) < 0
            // && klineutil.increase(klineJson[i-10].close_ave_21, klineJson[i-1].close_ave_21) < -0.03
}

/**
 * (0.8, 0.8) / 57.6%
 * 
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21Up(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_55;
    
    var dayoffset = 2;
    var targetDay = i-dayoffset;
    return klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay-1].close, klineJson[targetDay].close) === 0
            && klineutil.inBetween(klineutil.increase(klineJson[targetDay-1].close_ave_21, klineJson[i].close_ave_21), -amp*0.05,amp*1) === 0
            && klineJson[i-1].low > klineJson[targetDay].low+(klineJson[targetDay].high-klineJson[targetDay].low)*0.382
            && klineJson[i].low > klineJson[targetDay].low+(klineJson[targetDay].high-klineJson[targetDay].low)*0.382
            && upTo(klineJson[targetDay].low, "low", klineJson, targetDay+1, dayoffset, 0.02)
            //&& nearLowTrough(klineJson, i, 60, 0.05)
            //&& upLeftTrough(klineJson, targetDay, "low", klineJson[targetDay].low) < 0.05
            //&& detectGapDownStress(klineJson, i) === undefined;
}

function upLeftTrough(klineJson, i, field, price) {
    if (klineJson[i][field+"_trough"]) return 0;

    var troughidx = klineutil.leftTroughIdx(field, klineJson, i);
    if (!troughidx) return 0;

    return klineutil.increase(klineJson[troughidx][field], price);
}

function underAve(aveField, field, klineJson, idx, count, accuracy) {
    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (klineutil.increase(klineJson[i][aveField], klineJson[i][field]) > accuracy) {
            return false;
        }
    }
    return true;
}

function upTo(price, field, klineJson, idx, count, accuracy) {
    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (klineutil.increase(price, klineJson[i][field]) < accuracy) {
            return false;
        }
    }
    return true;
}

function nearLowTrough(klineJson, idx, interval, accuracy){
    var nearTrough = Infinity;
    interval = interval||30;
    accuracy = accuracy || 0.05;
    var nearCount = 2;
    for (var i=idx; i>=0 && idx-i<interval; i--) {
        if (klineutil.increase(klineJson[i].low, klineJson[idx].low) > accuracy) {
            return false;
        }

        if (klineJson[i].low_trough !== true) continue;
        
        if (nearCount > 0) {
            nearCount--;
            nearTrough = Math.min(klineJson[i].low, nearTrough);
            continue;
        } else {
            if (klineutil.increase(nearTrough, klineJson[idx].low) > accuracy
            || klineutil.increase(klineJson[i].low, nearTrough) > accuracy) {

                return false;
            }
        }
    }
    return true;
}

function detectGapDownStress(klineJson, idx, interval, accuracy) {
    interval = interval || 100;
    accuracy = accuracy || 0.05;
    var price = klineJson[idx].close;
    var highPeak = klineJson[idx].high;

    for (var i=idx; i>=0 && idx-i<interval; i--) {
        if (klineJson[i].gapDown !== undefined
            //&& klineJson[i].gapDown < -0.02
            && highPeak < klineJson[i-1].low
            && klineutil.inBetween(klineutil.increase(price, klineJson[i-1].close), 0.01, accuracy) === 0) {
            return klineJson[i].gapDown;            
        }

        if (klineJson[i].high_peak === true) {
            highPeak = Math.max(klineJson[i].high, highPeak);
        }
    }

    return undefined;
}

exports.sidewaysCompression = sidewaysCompression;

exports.morningStar = morningStar;
exports.redNGreenRed = redNGreenRed;
exports.greenInRed = greenInRed;
exports.redGreenRed = redGreenRed;
exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;
exports.traverseForWinning = traverseForWinning;
exports.traverseForAppearance = traverseForAppearance;