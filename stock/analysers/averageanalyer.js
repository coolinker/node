
var klineutil = require("../klineutil");


function traverse(method, klineJson, lossStop, winStop, daysStop, flag) {
    var result = {total:0, win:0};
    var len = klineJson.length;
    for (var i=50; i<len-daysStop; i++) {
        if (flag || this[method](klineJson, i)) {
                
                var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, daysStop);
                //console.log(klineJson[i].date, rel.toFixed(2));
                //console.log();

                if (rel>winStop) {
                    result.win++;
                }
                result.total++;
                
            }

    }
    return result;
}

/**
 * (0.05, 0.05) / 58.3%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function morningStar(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -0.03//-amp*0.2
        //&& klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) <= 0.02
        //&& Math.abs(klineutil.increase(klineJson[i-1].open, klineJson[i-1].close)) < 0.04
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02
        && klineutil.increase(klineJson[i-2].close, klineJson[i].close) > -0.01
        && klineutil.increase(klineJson[i-1].low, klineJson[i-2].low) > 0.01

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
 * (-0.1, 0.05, 15) / 66.49%
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
              || klineutil.increase(klineJson[i-3].close, klineJson[i-3].close_ave_144) > 0
              || klineJson[i-4].low_trough===true
              || klineJson[i-3].low_trough===true
              || klineJson[i-2].low_trough===true
              || klineJson[i-1].low_trough===true)
}

/**
 * (-0.1, 0.05, 12) / 63.3%
 * (0.05, 0.05, 15) 57%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21UpVolumeHigh(klineJson, i) {
    return klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-1].close, klineJson[i].close) === 0
            && klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21) >= 0.0
            && klineutil.inBetween(klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume), -0.25, 0.5) === 0
            //&& nearLowTrough(klineJson, i, 80, 0.5);
            //&& detectGapDownStress(klineJson, i) === undefined;
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


exports.morningStar = morningStar;
exports.redNGreenRed = redNGreenRed;
exports.greenInRed = greenInRed;
exports.redGreenRed = redGreenRed;
exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;
exports.traverse = traverse;