
var klineutil = require("../klineutil");
var bearklineforms = require("./bearklineforms");
/**
 *  (-0.05, 0.05, 12) / 55.32%
 *  (-0.05, 0.05, 30) / 65.10%
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

    if (!klineutil.noExRight(klineJson, leftBottom-30, i)) return false;
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
    return klineutil.increase(klineJson[leftBottom].high, outerHigh)> amp*8
}

function wBottomA1 (klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    if (klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 1) return false

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    if (klineutil.increase(klineJson[middleTop].high, klineJson[i].close)<-0.03) return false
    
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
    if (0!==klineutil.inBetween(klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low), 0.05, 0.15)) {
        return false;    
    }

    if (!klineutil.noExRight(klineJson, leftBottom-30, i)) return false;
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
    return klineutil.increase(klineJson[leftBottom].high, outerHigh)> amp*8
}
/**
 *  (-0.05, 0.05, 12) /55.09%
 *  (-0.05, 0.05, 30) /64.71%
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
            if (!klineutil.noExRight(klineJson, leftBottomIdx-30, i)) return false;
            var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx-30, leftBottomIdx, "high");
            return klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > 0.15;
        })();
        
        //&& klineutil.increase(klineJson[rightBottomIdx].low, klineJson[leftBottomIdx].low) < klineJson[i].amplitude_ave_55*1.1
        //&& klineutil.increase(klineJson[rightBottomIdx].low, klineJson[leftBottomIdx].low) > -klineJson[i].amplitude_ave_55*1.1

}


/**
 *  (-0.05, 0.05, 12) /55.02%
 *  (-0.05, 0.05, 30) /62.05%
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

    //if (!klineutil.noExRight(klineJson, leftBottom-30, i)) return false;
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");

    return klineutil.increase(klineJson[leftTop].high, outerHigh)>amp*2;
   
}

/**
 *  (-0.05, 0.05, 12) /55.04%
 *  (-0.05, 0.05, 100) /59.98%
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
            
           // if (!klineutil.noExRight(klineJson, Math.min(hidx-20,i-60), i)) return false;

            var plidx = klineutil.lowItemIndex(klineJson, hidx-20, hidx, "low");
            var plval = klineJson[plidx].low;

            var downhpl = klineutil.increase(plval, hval);    
            var downhl = klineutil.increase(lval, hval);
            return downhpl > downhl;
        })();

}
/**
 * (-0.05, 0.05, 12) /55.16%
 * (-0.05, 0.05, 100) /58.66%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 * 07/31/2009, 03/16/2012
 */
function morningStar(klineJson, i) {
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -0.03
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025
        && klineutil.increase(klineJson[i-2].volume_ave_8, klineJson[i-2].volume) < 0.618
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.618
        && function (){
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-33, i-3, "low", klineJson[i-2].open);
            return lowerItems.length > 8
        }()
        && !bearklineforms.below8WhileVolumeHigh(klineJson, i-2);
        // && !(klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -klineJson[i-2].amplitude_ave_8
        // && klineutil.increase(klineJson[i-2].volume_ave_8, klineJson[i-2].volume) > 0.2)
}

/**
 * (-0.05, 0.05, 12) / 56.46%
 * (-0.05, 0.05, 100) / 60.70%
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
 * (-0.05, 0.05, 100) / 60.21%
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
 * (-0.05, 0.05, 100) / 61.89%
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
 * (-0.05, 0.05, 100) / 60.08%
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

}

/**
 * (0.5, 0.5) / 56.71%
 * (0.5, 0.5, 100) / 65.61%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21Up(klineJson, i) {
    var fun = function(targetDay) {
        return 0 === klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay].open, klineJson[targetDay].close)
            && klineutil.increase(klineJson[targetDay].open, klineJson[targetDay].close) > 0.022
            && klineutil.increase(klineJson[targetDay-1].close_ave_21, klineJson[i].close_ave_21) < 0.0
            && klineutil.aboveAve("close_ave_8", "close", klineJson, targetDay+1, i-targetDay, 0.0)
            && function() {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, targetDay-30, targetDay, "close", klineJson[targetDay].low);
                return 0 === klineutil.inBetween(targetDay - lowerItems[lowerItems.length-1], 5, 11)
                        && lowerItems.length>2
            }();
        
    }
      
      return fun(i-2) || fun(i-3) || fun(i-4) || fun(i-5) || fun(i-6) || fun(i-7) || fun(i-8);  
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



