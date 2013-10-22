
var klineutil = require("../klineutil");


function traverse(method, klineJson, lossStop, winStop) {
    var result = {total:0, win:0};
    var len = klineJson.length;
    for (var i=50; i<len; i++) {

        if (this[method](klineJson, i)) {
                
                var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop);
                //console.log(klineJson[i].date, rel.toFixed(2));
                //console.log();

                if (rel>0) {
                    result.win++;
                }
                result.total++;
                
            }

    }
    return result;
}

function red3(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_55;
    
    return klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-2].open, klineJson[i].close)
            && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0
            && klineutil.increase(klineJson[i].close, klineJson[i].high) < (amp * 1)
            && klineutil.increase(klineJson[i-1].close, klineJson[i].close) > 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) <= 0

            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i-1].high) < amp
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) <= 0

            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > 0
            && klineutil.increase(klineJson[i-2].close, klineJson[i-2].high) < amp * 0.6
}

function on8While21UpVolumeHigh(klineJson, i) {
    return klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i-1].close, klineJson[i].close)
            && klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21) >= 0.0
            && klineutil.inBetween(klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume), -0.25, 0.5)
            //&& nearLowTrough(klineJson, i, 80, 0.5);
            //&& detectGapDownStress(klineJson, i) === undefined;
}

/**
 * [on8While21Up description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21Up(klineJson, i) {
    var dayoffset = 2;
    var targetDay = i-dayoffset;
    return klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay-1].close, klineJson[targetDay].close)
            && klineutil.inBetween(klineutil.increase(klineJson[targetDay-1].close_ave_21, klineJson[targetDay].close_ave_21), -0.008,0.004)
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
            && klineutil.inBetween(klineutil.increase(price, klineJson[i-1].close), 0.01, accuracy)) {
            return klineJson[i].gapDown;            
        }

        if (klineJson[i].high_peak === true) {
            highPeak = Math.max(klineJson[i].high, highPeak);
        }
    }

    return undefined;
}


exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;
exports.traverse = traverse;