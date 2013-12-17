
var klineutil = require("../klineutil");

/**
 *  (-0.05, 0.05, 12) / 55.32%
 * [wBottomA description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function wBottomA (klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    if (klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 1) return false

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    if (klineutil.increase(klineJson[middleTop].high, klineJson[i].close)<-0.03) return false
    
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
    if (0!==klineutil.inBetween(klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low), 0.05, 0.15)) {
        return false;    
    }   

    
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
    return klineutil.increase(klineJson[leftBottom].high, outerHigh)> amp*8
}

/**
 *  (-0.05, 0.05, 12) /55.09%
 * [wBottom description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function wBottom (klineJson, i) {
    var rightBottomIdx = klineutil.lowItemIndex(klineJson, i-10, i, "low");
    var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx-10, rightBottomIdx, "high");

    return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > 0.0
        && klineutil.increase(klineJson[i].close_ave_21,klineJson[i].close_ave_8) > 0.03
        && klineutil.increase(klineJson[i].close_ave_8, klineJson[i].close) < 0.035
        && (function(){
            var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx-10, midTopIdx, "low");
            var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx-30, leftBottomIdx, "high");
            return klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > 0.15;
        })();
        
        //&& klineutil.increase(klineJson[rightBottomIdx].low, klineJson[leftBottomIdx].low) < klineJson[i].amplitude_ave_55*1.1
        //&& klineutil.increase(klineJson[rightBottomIdx].low, klineJson[leftBottomIdx].low) > -klineJson[i].amplitude_ave_55*1.1

}


/**
 *  (-0.05, 0.05, 12) /55.02%
 * [wBottom description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function headShoulderBottom (klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;

   // if (klineutil.increase(klineJson[i].close, klineJson[i-1].close)>amp*1.5) return false

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);
    
    if (klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= 0.03) return false;
    var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);

    if (klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-0.01) return false;

    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");

    return klineutil.increase(klineJson[leftTop].high, outerHigh)>amp*2;
   
}

/**
 *  (-0.05, 0.05, 12) /55.04%
 * [sidewaysCompression description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function sidewaysCompression (klineJson, i) {
    
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.03
        && klineutil.increase(klineJson[i].open, klineJson[i].close) < klineJson[i].amplitude_ave_55
        && klineutil.increase(klineutil.highItem(klineJson, i-60, i-1, "high"), klineJson[i].close) < -0.1
        && klineJson[i].volume < 2 *klineJson[i].volume_ave_8
        && (function(){
            var hidx = klineutil.highItemIndex(klineJson, i-60, i-1, "high");
            var hval = klineJson[hidx].high;
            
            var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "low");
            var lval = klineJson[lidx].low;
            
            var plidx = klineutil.lowItemIndex(klineJson, hidx-20, hidx, "low");
            var plval = klineJson[plidx].low;

            var downhpl = klineutil.increase(plval, hval);    
            var downhl = klineutil.increase(lval, hval);
            return downhpl > downhl;
        })();

}
/**
 * (-0.05, 0.05, 10) /55.16%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 * 07/31/2009, 03/16/2012
 */
function morningStar(klineJson, i) {
    var lowerItems = klineutil.lowerItemsIndex(klineJson, i-30, i-3, "low", klineJson[i-2].open);
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -0.03
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025
        //&& klineutil.increase(klineJson[i-2].close, klineJson[i].close) > -0.02
        && klineutil.increase(klineJson[i-2].volume_ave_8, klineJson[i-2].volume) < 0.618
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.618
        //&& klineutil.increase(klineJson[i-1].close, klineJson[i].open) >= 0.0
        && lowerItems.length > 8
        
        
}

/**
 * (-0.05, 0.05, 12) / 56.46%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */

function redNGreenRed (klineJson, i) {
    if(klineutil.increase(klineJson[i].open, klineJson[i].close) < 0.025) return false;
    var top = klineutil.highIndexOfDownTrend(klineJson, i-1);
    return klineutil.increase(klineJson[top].high, klineJson[i].close) > -klineJson[i].amplitude_ave_8*2.1
            && klineutil.increase(klineJson[top].high, klineJson[i].close) < -klineJson[i].amplitude_ave_8*0.4
            && klineutil.increase(klineJson[top-1].open, klineJson[i-1].close) < klineJson[i].amplitude_ave_8
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-30, top-1, "close", klineJson[top-1].low);
                return  lowerItems.length > 3 && lowerItems.length < 27;
            }())   
            //&& i-top !=2   
}


/**
 * (-0.05, 0.05, 12) / 55.61%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRed(klineJson, i) {
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-30, i, "close", klineJson[i].low);
                return  lowerItems.length > 3 && lowerItems.length < 25;
            }())

}

/**
 * (-0.05, 0.05, 12) / 55.79%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redGreenRed(klineJson, i) {
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.018
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > -0.0
            //&& klineutil.increase(klineJson[i-2].close, klineJson[i].close) > -0.05
            && klineutil.increase(klineJson[i-2].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-30, i, "close", klineJson[i].low);
                return  lowerItems.length > 3 && lowerItems.length < 25;
            }())
}
/**
 * (-0.05, 0.05, 12) / 55.21%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function red3(klineJson, i) {
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.0
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > 0
            && klineutil.increase(klineJson[i-2].open, klineJson[i].close) > 0.06

            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) >= 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close_ave_8) > 0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-30, i-2, "low", klineJson[i-2].low);
                return lowerItems.length > 3;
            }())
}


/**
 * (-0.05, 0.05, 12) / 55.30%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21UpVolumeHigh(klineJson, i) {
    var lowerItems = klineutil.lowerItemsIndex(klineJson, i-30, i, "close", klineJson[i].low);

    return klineutil.inBetween(klineJson[i].close_ave_8, Math.min(klineJson[i-1].close, klineJson[i].open), klineJson[i].close) === 0
            //&& klineutil.increase(klineJson[i-2].close_ave_21, klineJson[i-1].close_ave_21) <= klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21)
            && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.1
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < 0.3
            && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.03
            && lowerItems.length>3

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



exports.headShoulderBottom = headShoulderBottom;
exports.sidewaysCompression = sidewaysCompression;
exports.wBottom = wBottom;
exports.wBottomA = wBottomA;

exports.morningStar = morningStar;
exports.redNGreenRed = redNGreenRed;
exports.greenInRed = greenInRed;
exports.redGreenRed = redGreenRed;
exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;