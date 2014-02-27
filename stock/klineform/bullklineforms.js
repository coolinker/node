
var klineutil = require("../klineutil");
var bearklineforms = require("./bearklineforms");
/**
 *  (-0.05, 0.05, 12) / 55.32%
 *  (-0.05, 0.05, 100) / 66.84%
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

/**
 *  (-0.05, 0.05, 12) /55.09%
 *  (-0.05, 0.05, 100) /66.38%
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
 *  (-0.05, 0.05, 100) /66.09%
 * [wBottom description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function headShoulderBottom (klineJson, i) {
    var amp = klineJson[i].inc_ave_8;

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);
    
    if (klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= amp*3) return false;
    var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);

    if (klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-amp*0.5) return false;

    //if (!klineutil.noExRight(klineJson, leftBottom-30, i)) return false;
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "low");

    return klineutil.increase(klineJson[leftTop].high, outerHigh)>amp*2;
   
}

/**
 *  (-0.05, 0.05, 100) /65.37%
 * [sidewaysCompression description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function sidewaysCompression (klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;

    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.028
        && klineutil.increase(klineJson[i].open, klineJson[i].close) < inc_ave*3
        //&& klineutil.increase(klineutil.highItem(klineJson, i-60, i-1, "high"), klineJson[i].close) < -2*inc_ave
        && klineJson[i].volume < 0.6 *klineJson[i].volume_ave_8
        && (function(){
            var hidx = klineutil.highItemIndex(klineJson, i-60, i-1, "close");
            var hval = klineJson[hidx].close;
            
            var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
            var lval = klineJson[lidx].close;
            
            if (!klineutil.noExRight(klineJson, Math.min(hidx-20,i-60), i)) return false;

            var plidx = klineutil.lowItemIndex(klineJson, hidx-20, hidx, "close");
            var plval = klineJson[plidx].close;

            var downhpl = klineutil.increase(plval, hval);    
            var downhl = klineutil.increase(lval, hval);
            return downhpl > 1.1*downhl;
        })();

}
/**
 * (-0.05, 0.05, 100) /65.59%
 * [morningStarA description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function morningStarA(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -inc_ave*1
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > inc_ave*1
        && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) <  inc_ave*0.1
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.5
        && function (){
            var lower = klineutil.lowerItemsIndex(klineJson, i-33, i-3, "close", klineJson[i].close);
             return i - lower[0]>10 && i - lower[0] < 22
        }()
}
/**
 * (-0.05, 0.05, 100) /65.24%
 * [morningStarB description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function morningStarB(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
    
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -inc_ave*0.8
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > inc_ave*1.2
        && klineutil.increase(klineJson[i-2].close_ave_8 , klineJson[i].close_ave_8) > -inc_ave*0.6
        && klineutil.increase(midhigh, klineJson[i-2].close) > -inc_ave*0.8
        && klineutil.increase(klineJson[i].volume_ave_8 , klineJson[i].volume) < 0.5
        && function (){
            //var higher = klineutil.higherItemsIndex(klineJson, i-53, i-3, "low", klineJson[i].close);
            var lower = klineutil.lowerItemsIndex(klineJson, i-62, i-2, "low", klineJson[i-2].high);
             return lower.length<25
        }()
 }

/**
 * (-0.05, 0.05, 12) / 56.46%
 * (-0.05, 0.05, 100) / 66.16%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */

function redNGreenRed (klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    
    return klineutil.increase(klineJson[i].open, klineJson[i].close) >  inc_ave*1.4
            && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1.2
            && klineutil.increase(klineJson[i-1].volume_ave_8, klineJson[i-1].volume_ave_21) < 0.2
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) > -0.4
            && klineutil.increase(klineJson[i].open, klineJson[i].close) < 0.08
            && (function(){
                var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
                
                if (klineutil.increase(klineJson[top].high, klineJson[i].close) > -inc_ave*3.5
                    && klineutil.increase(klineJson[top].high, klineJson[i].close) <  inc_ave*1.5) {
                    var lowerItems = klineutil.lowerItemsIndex(klineJson, top-120, top-1, "low", klineJson[top-1].high);
                    return lowerItems.length >6 && lowerItems.length <20;
                }
                 return false;
            }())
            
}

/**
 * (-0.05, 0.05, 100) / 66.22%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRedA(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < -0.2
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-45, i, "high", klineJson[i].low);
                return  lowerItems.length > 13 && lowerItems.length < 40;
            }())

}


/**
 * (-0.05, 0.05, 100) / 66.18%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRedB(klineJson, i) {
    
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < -0.1
            && (function(){
                var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "low", klineJson[i].high);
                return  i-higherItems[0] < 30;
            }())

}

/**
 * (-0.05, 0.05, 100) / 66.41%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRedC(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.028
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -0.0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) < 0.02
            && klineutil.increase(klineJson[i-1].close, klineJson[i].low) > -inc_ave*0.5
            && klineutil.increase(klineJson[i-1].open-klineJson[i-1].close, klineJson[i].close-klineJson[i].open) < 0.6
            //&& klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0.1
            //&& klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < 0.1
            && (function(){
                var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "high", klineJson[i].high);
                return  i-higherItems[0] < 98;
            }())

}

/**
 * (-0.05, 0.05, 100) / 66.19%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenInRedD(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.028
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -0.0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) < 0.02
            && klineutil.increase(klineJson[i-1].close, klineJson[i].low) > -inc_ave*0.6
            && klineutil.increase(klineJson[i-1].volume, klineJson[i-2].volume) > -0.3
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < -0.15
            
}
/**
 * (-0.05, 0.05, 100) / 66.40%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redGreenRedB(klineJson, i) {
    //var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.018
            && klineutil.increase(klineJson[i-1].open, klineJson[i].close) < 0.00
            //&& klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > -0.05
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) > -0.02
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0.1
            
            && (function(){
                var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "low", klineJson[i].high);
                return  i-higherItems[0] < 30;
            }())
}
/**
 * (-0.05, 0.05, 100) / 66.25%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redGreenRedA(klineJson, i) {
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.018
            && klineutil.increase(klineJson[i-1].open, klineJson[i].close) < 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > -0.02
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) > -0.005
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > 0.0
            
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-50, i, "high", klineJson[i].low);
                return  lowerItems.length > 12 && lowerItems.length < 40;
            }())
}

/**
 * (-0.05, 0.05, 12) / 55.21%
 * (-0.05, 0.05, 100) / 66.22%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function red3(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i].open, klineJson[i].close) > -inc_ave//-0.03
            //&& klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > -inc_ave*4
            && klineutil.increase(klineJson[i-2].open, klineJson[i].close) > 0.045

            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) >= -0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close_ave_8) > inc_ave//-0.0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0.15
            && klineutil.increase(klineJson[i].volume_ave_21, klineJson[i].volume_ave_8) < -0.1
            && (function(){
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-200, i-2, "high", klineJson[i-2].low);
                return lowerItems.length > 50;
            }())
}

/**
 * (-0.05, 0.05, 12) / 55.30%
 * (-0.05, 0.05, 100) / 66.27%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21UpVolumeHigh(klineJson, i) {
    return klineutil.increase(klineJson[i].close_ave_8, klineJson[i-1].close) < 0
            && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < -0.1
            && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < -0.2
            && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025
            && function() {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-200, i, "high", klineJson[i].low);
                return lowerItems.length>50;
            }()

}

/**
 * (0.5, 0.5) / 56.71%
 * (0.5, 0.5, 100) / 66.61%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function on8While21Up(klineJson, i) {
    var fun = function(targetDay) {
        return klineutil.increase(klineJson[targetDay].close_ave_8, klineJson[targetDay].open) < 0
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

/**
 * (0.5, 0.5, 100) / 66.28%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function dawnA(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -inc_ave
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.028
        && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0.3
        && klineutil.increase(klineJson[i].volume, klineJson[i-1].volume) > 0
        && function() {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, i-120, i, "high", klineJson[i].low);
                return lowerItems.length>10;
            }()

}

/**
 * (0.5, 0.5, 100) / 66.40%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function dawnB(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -inc_ave
        && klineutil.increase(klineJson[i].open, klineJson[i].close) >0.018
        && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) > -0.3
        && klineutil.increase(klineJson[i].volume, klineJson[i-1].volume) > -0
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-120, i, "low", klineJson[i].low);
                return higherItems.length<20;
            }()

}

/**
 * (0.5, 0.5, 100) / 66.24%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function reversedHammerA(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linehigh > klineJson[i].close*inc_ave*0.1
        && linehigh < 0.1
        && linelow< 0.05
        && klineutil.increase(klineJson[i].volume_ave_21, klineJson[i].volume_ave_8) > -0
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 0.1
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1
        && function() {
                var hidx = klineutil.highItemIndex(klineJson, i-80, i, "close");
                return klineutil.increase(klineJson[i].open, klineJson[hidx].close) > inc_ave*13
            }()
}

/**
 * (0.5, 0.5, 100) / 66.23%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function reversedHammerB(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linelow< 0.05
        && linehigh < klineJson[i].close*inc_ave*1.5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 0.1
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1
        && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < 0.5
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-15, i, "close", klineJson[i].low);
                return higherItems.length>1 && higherItems.length<5;
            }()
        && function() {
                var hidx = klineutil.highItemIndex(klineJson, i-60, i, "close");
                return klineutil.increase(klineJson[i].high, klineJson[hidx].close) > inc_ave*0.6
            }()
}

/**
 * (0.5, 0.5, 100) / 66.56%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function reversedHammerC(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linelow< 0.3
        && Math.abs(entity - linehigh) < klineJson[i].close*inc_ave*0.3
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-20, i, "close", klineJson[i].low);
                return higherItems.length<2;
            }()
}

/**
 * (0.5, 0.5, 100) / 66.10%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function hammerA(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linelow < 0.15 //klineJson[i].close*inc_ave*2//
        && linehigh< 0.05
        //&& entity > linelow
        && klineutil.increase(klineJson[i].volume_ave_21, klineJson[i].volume_ave_8) > -0
        //&& klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -1
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1.5
        && function() {
                var hidx = klineutil.highItemIndex(klineJson, i-80, i, "close");
                return klineutil.increase(klineJson[i].open, klineJson[hidx].close) > inc_ave*9
            }()
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-20, i, "close", klineJson[i].low);
                return higherItems.length<5;
            }()
}

/**
 * (0.5, 0.5, 100) / 66.23%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function hammerB(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linelow < 0.05
        && linehigh>= 0.05
        && linehigh< 0.2
        && klineutil.increase(klineJson[i].volume_ave_21, klineJson[i].volume_ave_8) > 0
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -0.3
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1.5
        && function() {
                var hidx = klineutil.highItemIndex(klineJson, i-80, i, "close");
                return klineutil.increase(klineJson[i].open, klineJson[hidx].close) > inc_ave*12
            }()
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-20, i, "close", klineJson[i].low);
                return higherItems.length<10;
            }()
}


/**
 * (0.5, 0.5, 100) / 66.29%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function hammerC(klineJson, i) {
    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;
    return linehigh< 0.5
        && Math.abs(entity - linelow) < klineJson[i].close*inc_ave*0.3
        && function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, i-20, i, "close", klineJson[i].low);
                return higherItems.length<2;
            }()
}


/**
 * (0.5, 0.5, 100) / 66.10%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function flatBottom(klineJson, i) {
    var tdfun = function (bottomDays) {
        var td = i-bottomDays;
        return Math.abs(klineutil.increase(klineJson[i].low, klineJson[td].low)) < klineJson[i].inc_ave_8*0.6//0.01
            //&& klineutil.increase(klineJson[td].volume, klineJson[i].volume) > -0.2
            && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -0.3
            && function() {
                var inc_ave = klineJson[i].inc_ave_8;
                var hidx = klineutil.highItemIndex(klineJson, td-70, td, "close");
                return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > inc_ave*16
            }()
            &&function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, td-20, i, "close", klineJson[i].close);
                return higherItems.length<7;
            }()
    }

    return tdfun(1) || tdfun(2) || tdfun(3) || tdfun(4);
}


/**
 * (0.5, 0.5, 100) / 66.28%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function towerBottom(klineJson, i) {
    
    var fun = function() {
        var n=i-1;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_8;
            if (klineutil.increase(klineJson[n].open, klineJson[n].close)>inc_ave*1.5) {
                return false;
            } else if (klineutil.increase(klineJson[n].open, klineJson[n].close)<=-inc_ave*1.3) {
                break;
            }
        }

        return klineutil.increase(klineJson[n].volume_ave_8, klineJson[n].volume) < 0.3
            && klineutil.increase(klineJson[n].volume_ave_8, klineJson[n].volume) > -0.2
            && klineutil.increase(klineJson[n].close, klineJson[i].open) < inc_ave
            && klineutil.increase(klineJson[n].open, klineJson[n].close) < -inc_ave*1.5
            &&function() {
                var higherItems = klineutil.higherItemsIndex(klineJson, n-17, n, "close", klineJson[n].low);
                return higherItems.length<12;
            }();
    }

    return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.025//klineJson[i].inc_ave_8*1.5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.1
         && fun();
}

/**
 * (0.5, 0.5, 100) / 66.31%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function roundBottomDerivedA(klineJson, i) {
    return klineutil.increase(klineJson[i-1].high, klineJson[i].low) > 0.0
         && klineutil.increase(klineJson[i-1].close, klineJson[i].close) > klineJson[i].inc_ave_8*0.8 //0.02
         //&& klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.2
         && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.2
}
/**
 * (0.5, 0.5, 100) / 66.27%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function roundBottomDerivedB(klineJson, i) {
    /*
    var lowidx = klineutil.lowIndexOfUpTrend(klineJson, i);
    var highidx = klineutil.highIndexOfDownTrend(klineJson, lowidx);
    var fun = function() {
        var n=i-1;
        for (; n>=highidx; n--) {
            var inc_ave = klineJson[n].inc_ave_8;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close))>inc_ave*1.5) {
                if (n>=lowidx) return true;
                break;
            }
        }
        
        return true;
    }
    */
    return klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.015 //klineJson[i].inc_ave_8*0.2
         && klineutil.increase(klineJson[i-1].close, klineJson[i].close) > -klineJson[i].inc_ave_8*0.5 //-0.01
         && klineutil.increase(klineJson[i-1].high, klineJson[i].high) > 0.025
         && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.05

         //&& fun();
}

/**
 * (0.5, 0.5, 100) / 66.31%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lowRedDoubleB(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -inc_ave
        && klineutil.increase(klineJson[i-1].low, klineJson[i].high) < inc_ave*1.3
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > inc_ave*0.5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.3
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume_ave_21) > -0.3
        && function () {
            var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "high", klineJson[i].low);
            return higherItems.length<50;
        }()
}

/**
 * (0.5, 0.5, 100) / 66.23%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lowRedDoubleA(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -inc_ave
        && klineutil.increase(klineJson[i-2].low, klineJson[i-1].high) < inc_ave
        && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > inc_ave*0.3
        //&& klineutil.increase(klineJson[i].open, klineJson[i].close) <  inc_ave*1.5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0.2
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume_ave_21) > -0.2
        && function () {
            var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "high", klineJson[i].low);
            return higherItems.length<50;
        }()
        
}

/**
 * (0.5, 0.5, 100) / 66.20%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lowRedDoubleC(klineJson, i) {
    var inc_ave = klineJson[i].inc_ave_8;
    return klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -inc_ave
        && klineutil.increase(klineJson[i-1].low, klineJson[i].high) < inc_ave*1.3
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > inc_ave*0.3
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 0
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume_ave_21) > -0.3
        && function () {
            var lidx = klineutil.lowItemIndex(klineJson, i-90, i, "low");
            return i-lidx>80;
        }()
}


/**
 * (0.5, 0.5, 100) / 66.20%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lowRedsA(klineJson, i) {
    var fun = function() {
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_8;
            if (klineutil.increase(klineJson[n].open, klineJson[n].close) < 0) {
                break;
            } else if (klineutil.increase(klineJson[n].open, klineJson[n].close)>inc_ave*1
                && klineutil.increase(klineJson[n].volume_ave_8, klineJson[n].volume)>0.2){
                return false;
            } 
        }

        return i-n>=4;
    }
    var inc_ave = klineJson[i].inc_ave_8;
    return fun()
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -0.3
        && function () {
            var lidx = klineutil.lowItemIndex(klineJson, i-180, i, "low");
            return i-lidx>135;
        }()
        && function () {
            var higherItems = klineutil.higherItemsIndex(klineJson, i-60, i, "low", klineJson[i].high);
            return higherItems.length>20;
        }()
}

/**
 * (0.5, 0.5, 100) / 66.51%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lowRedsB(klineJson, i) {
    var fun = function() {
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_8;
            if (klineutil.increase(klineJson[n].open, klineJson[n].close) < 0) {
                break;
            } 
        }

        return i-n>=4;
    }
    var inc_ave = klineJson[i].inc_ave_8;
    return fun()
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) < 1.5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -0.3
        && klineutil.increase(klineJson[i-1].volume_ave_8, klineJson[i-1].volume_ave_21) > 0.05
        && function () {
            var lidx = klineutil.lowItemIndex(klineJson, i-180, i, "low");
            return i-lidx>135 && klineutil.increase(klineJson[lidx].low, klineJson[i].close)> inc_ave*1.5;
        }()
        && function () {
            var higherItems = klineutil.higherItemsIndex(klineJson, i-60, i, "low", klineJson[i].high);
            return i-higherItems[higherItems.length-1] > 10 && higherItems.length>10;
        }()
}

/**
 * (0.5, 0.5, 100) / 66.51%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function smallRedsAndGreens(klineJson, i) {
    var fun = function() {
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*1.3) {
                break;
            } 
        }

        return i-n>=8 
            && klineutil.increase(klineJson[i-4].close_ave_8, klineJson[i].close_ave_8) > klineJson[i].inc_ave_8*0.5
    }
    var inc_ave = klineJson[i].inc_ave_8;
    return fun()
        && klineutil.increase(klineJson[i].open, klineJson[i].close) >-inc_ave*0.3
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume_ave_21) > -0.2
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > -0.2  
        && function () {
            var lowerItems = klineutil.higherItemsIndex(klineJson, i-80, i, "low", klineJson[i].high);
            return lowerItems.length>30
        }()
}

exports.smallRedsAndGreens = smallRedsAndGreens;

exports.lowRedsB = lowRedsB;
exports.lowRedsA = lowRedsA;

exports.lowRedDoubleC = lowRedDoubleC;
exports.lowRedDoubleB = lowRedDoubleB;
exports.lowRedDoubleA = lowRedDoubleA;

exports.roundBottomDerivedA = roundBottomDerivedA;
exports.roundBottomDerivedB = roundBottomDerivedB;

exports.towerBottom = towerBottom;
exports.flatBottom = flatBottom;

exports.hammerA = hammerA;
exports.hammerB = hammerB;
exports.hammerC = hammerC;

exports.reversedHammerA = reversedHammerA;
exports.reversedHammerB = reversedHammerB;
exports.reversedHammerC = reversedHammerC;

exports.dawnA = dawnA;
exports.dawnB = dawnB;
exports.headShoulderBottom = headShoulderBottom;
exports.sidewaysCompression = sidewaysCompression;
exports.wBottom = wBottom;
exports.wBottomA = wBottomA;

exports.morningStarB = morningStarB;
exports.morningStarA = morningStarA;
exports.redNGreenRed = redNGreenRed;

exports.greenInRedA = greenInRedA;
exports.greenInRedB = greenInRedB;
exports.greenInRedC = greenInRedC;
exports.greenInRedD = greenInRedD;

exports.redGreenRedA = redGreenRedA;
exports.redGreenRedB = redGreenRedB;
exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;



