
var klineutil = require("../klineutil");

/**
 * [mTop description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function mTop (klineJson, i) {

}
/**
 *  (-0.05, 0.05, 15) / 50.45%
 *  (-0.1, 0.1, 20)=45.51%
 * [mTop description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function mTop (klineJson, i) {

    var rightTop = klineutil.highIndexOfDownTrend(klineJson, i);
    var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);
    if (klineutil.increase(klineJson[middleBottom].low, klineJson[i].close)>0.03) return false

    var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
    if (0!==klineutil.inBetween(klineutil.increase(klineJson[leftTop].high, klineJson[rightTop].high), -0.2, -0.05)) {
        return false;    
    }   

    var outerLow = klineutil.lowItem(klineJson, leftTop-30, leftTop, "low");
    return 0 === klineutil.inBetween(klineutil.increase(klineJson[leftTop].high, outerLow),-0.25, -0.15)
                && (klineutil.increase(klineJson[rightTop].high, klineJson[i].close) < -0.05
                || klineutil.increase(klineJson[rightTop].high, klineJson[middleBottom].low) < -0.05)
}

/**
 *  (-0.05, 0.05, 12) /49.41%
 * [headShoulderTop description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function headShoulderTop (klineJson, i) {

    var rightTop = klineutil.highIndexOfDownTrend(klineJson, i);
    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);
    if (klineutil.increase(klineJson[rightBottom].low, klineJson[i].close)>0.02) return false;

    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    if (klineutil.increase(klineJson[middleTop].high, klineJson[rightTop].high)>-0.05) return false;

    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
    if(0!==klineutil.inBetween(klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low),-0.12,-0.03)) return false;
    
    var leftTop = klineutil.highIndexOfDownTrend(klineJson, leftBottom);
    var outerLow = klineutil.lowItem(klineJson, leftTop-30, leftTop, "low");
    return 0===klineutil.inBetween(klineutil.increase(klineJson[leftBottom].low, outerLow),-0.20, -0.05);   
}

/**
 *  (-0.05, 0.05, 12) /47.50%
 * [greenNRedGreen description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenNRedGreen (klineJson, i) {
    if(klineutil.increase(klineJson[i].open, klineJson[i].close)>-0.03) return false;
    var bottom = klineutil.lowIndexOfUpTrend(klineJson, i-1);
    var higherItems = klineutil.higherItemsIndex(klineJson, bottom-30, bottom-1, "close", klineJson[bottom-1].high-0.01);
    // if (klineJson[i].date=='12/23/2010')
    //     console.log(higherItems.length>0 , higherItems.length, bottom - higherItems[0])
     
    return higherItems.length>0 && bottom==i-1
            && (bottom - higherItems[higherItems.length-1] < 3 || 0===klineutil.inBetween(higherItems.length, 4, 25))
            && klineutil.increase(klineJson[bottom].low, klineJson[i].close) < klineJson[i].amplitude_ave_8
            && klineutil.increase(klineJson[bottom-2].close, klineJson[bottom-1].close)<-0.025
            && klineutil.increase(klineJson[bottom-1].open, klineJson[i-1].close)>-klineJson[i].amplitude_ave_8;
}

/**
 * (-0.05, 0.05, 12) /48.08%
 * [greenRedGreenA description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenRedGreen (klineJson, i) {
    return greenRedGreenA(klineJson, i) || greenRedGreenB(klineJson, i);
}    
/**
 * (-0.05, 0.05, 12) /49.16%
 * [greenRedGreenA description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenRedGreenA (klineJson, i) {
    return klineutil.increase(klineJson[i-2].open, klineJson[i-1].close) >0.0
            &&klineutil.increase(klineJson[i].open, klineJson[i].close) < 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < 0.0
            && (klineutil.increase(klineJson[i-2].open, klineJson[i].close)> 0.0382)
}

/**
 * (-0.05, 0.05, 12) /47.57%
 * [greenRedGreenA description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function greenRedGreenB (klineJson, i) {
    var higherItems = klineutil.higherItemsIndex(klineJson, i-30, i-2, "close", klineJson[i].open);
    return klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.01
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0.0
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < -0.01
            && klineutil.increase(klineJson[i-2].open, klineJson[i-1].close) <= -0.0
            && klineutil.increase(klineJson[i-2].volume, klineJson[i-2].volume_ave_8) > 0.3
            && higherItems.length>10         
}
/**
 *  (-0.05, 0.05, 12) /47.03%
 * [sidewaysCompression description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function below8While21Down (klineJson, i) {
    
    var fun = function(targetDay) {
        var higherItems = klineutil.higherItemsIndex(klineJson, targetDay-30, targetDay, "close", klineJson[targetDay].high);
        return 0 === klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay].close, klineJson[targetDay].open)
            && klineutil.increase(klineJson[targetDay].open, klineJson[targetDay].close) < -0.03
            && klineutil.increase(klineJson[targetDay-1].close_ave_21, klineJson[i].close_ave_21) < 0.005
            && 0 === klineutil.inBetween(targetDay - higherItems[higherItems.length-1], 5, 10)
            && klineutil.belowAve("close_ave_8", "close", klineJson, targetDay+1, i-targetDay, 0.01)
        
    }
      
      return fun(i-2) || fun(i-3) || fun(i-4);  
}


/**
 * (-0.05, 0.05, 12) / 47.38%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function below8WhileVolumeHigh(klineJson, i) {
    var inc =  klineutil.increase(Math.max(klineJson[i-1].close, klineJson[i].open), klineJson[i].close);
    return 0 === klineutil.inBetween(klineJson[i].close_ave_8, klineJson[i].close, Math.max(klineJson[i-1].close, klineJson[i].open))
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) - inc*10 > 0.8
         && inc < 0.0
}


/**
 * (-0.05, 0.05, 12) / 47.62%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function redInGreen(klineJson, i) {
    var higherItems = klineutil.higherItemsIndex(klineJson, i-30, i, "close", klineJson[i].high);

    return klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.035
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) >=0
            && klineutil.increase(klineJson[i-1].open, klineJson[i].close) < -0.0
            && (higherItems.length >4 && klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.045
            || 0===klineutil.inBetween(i-higherItems[higherItems.length-1], 4,15)
            )

            // return klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.0382
            // && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
            // && klineutil.increase(klineJson[i-1].close, klineJson[i].open) >= -0.01
            // && klineutil.increase(klineJson[i-1].open, klineJson[i].close) > -0.02
}



/**
 * (-0.05, 0.05, 12) / 47.81%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function downpour(klineJson, i) {
    //var higherItems = klineutil.higherItemsIndex(klineJson, i-30, i-1, "high", klineJson[i-1].high);

    return klineutil.increase(klineJson[i-1].close, klineJson[i].close) < -0.0382
    && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > 0
    && klineutil.increase(klineJson[i-1].close, klineJson[i].open) < -0.01
    && klineutil.increase(klineJson[i-1].open, klineJson[i].close) < -0.0
    //&& higherItems.length<3;
}


/**
 * (-0.05, 0.05, 12) / 47.4%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function darkCloud(klineJson, i) {
    //if (klineJson[i].date=="04/22/2011") console.log(i, higherItems, amp)
    
    return (klineutil.increase(Math.min(klineJson[i-1].open, klineJson[i-2].close), klineJson[i-1].close) > 0.025
    && klineutil.increase((klineJson[i-1].open+klineJson[i-1].close)/2, klineJson[i].close) < -0.0
    ||klineutil.increase(Math.min(klineJson[i-1].open, klineJson[i-2].close), klineJson[i-1].close) > 0.01
    && klineutil.increase((klineJson[i-1].open+klineJson[i-1].close)/2, klineJson[i].close) < -0.01)

    && klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.005

}

/**
 * (-0.05, 0.05, 12) /47.19%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */

function green3(klineJson, i) {
    var amp = klineJson[i].amplitude_ave_8;
    
    return klineutil.increase(klineJson[i].open, klineJson[i].close) < -amp
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < 0
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) >-amp
            && klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) < 0
            && klineutil.increase(klineJson[i-2].open, klineJson[i].close) < -2*amp
            && klineutil.inBetween(klineJson[i].open, klineJson[i-1].close, klineJson[i-1].open) <= 0
            && klineutil.inBetween(klineJson[i-1].open, klineJson[i-2].close, klineJson[i-2].open) <= 0
            
}
/**
 * * (-0.05, 0.05, 12) /48.41%
 * [duskStar description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function duskStar(klineJson, i) {
    return duskStarA(klineJson, i) || duskStarB(klineJson, i);
}

/**
 * (-0.05, 0.05, 12) /47.62%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function duskStarA(klineJson, i) {
    return klineutil.increase(klineJson[i-1].close, klineJson[i].open) < -0.01
            &&klineutil.increase(klineJson[i-2].open, klineJson[i-2].close) > 0
            && Math.abs(klineutil.increase(klineJson[i-1].open, klineJson[i-1].close)) < 0.03
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) > 0.005
            
            && klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.02
            
}

/**
 * (-0.05, 0.05, 12) /48.53%
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function duskStarB(klineJson, i) {
    
    return  klineutil.increase(klineJson[i-1].close, klineJson[i].open) > -0.01
            && klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) > 0.01
            && klineutil.increase(klineJson[i].open, klineJson[i].close) < -0.03
}

function lightningRod(klineJson, i){
    return lightningRodA(klineJson, i) || lightningRodB(klineJson, i) || lightningRodB(klineJson, i);
}
/**
 * (-0.05, 0.05, 100) /52.53%
 * [shootStar description]
 * @return {[type]} [description]
 */
function lightningRodA(klineJson, i){
    var inc_ave_8 = klineJson[i].inc_ave_8;
    var needle =klineutil.increase(Math.max(klineJson[i].open, klineJson[i].close), klineJson[i].high);
    var higherItems = klineutil.higherItemsIndex(klineJson, i-20, i, "close", klineJson[i].high);
    return needle > inc_ave_8*0.8
        && higherItems.length <18
        && higherItems.length >5
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 0.3
        //&& klineutil.increase(klineJson[i-1].close, klineJson[i].open) > inc_ave_8*0.2
}

/**
 * * (-0.05, 0.05, 100) /52.32%
 * [lightningRodB description]
 * @param  {[type]} klineJson [description]
 * @param  {[type]} i         [description]
 * @return {[type]}           [description]
 */
function lightningRodB(klineJson, i){
    var inc_ave_8 = klineJson[i].inc_ave_8;
    
    return klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 0.6
        && klineutil.increase(klineJson[i-1].close, klineJson[i].open) > inc_ave_8*0
        && klineutil.increase(klineJson[i-1].close, klineJson[i-1].open) > -inc_ave_8*1
        && (function(){
            var needle =klineutil.increase(Math.max(klineJson[i].open, klineJson[i].close), klineJson[i].high);
            return needle > inc_ave_8*0;
        })()
        && (function(){
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-20, i, "high", klineJson[i].high);
            return lowerItems.length > 15
        })()
        
}

function lightningRodC(klineJson, i){
    var inc_ave_8 = klineJson[i].inc_ave_8;
    var needle =klineutil.increase(Math.max(klineJson[i].open, klineJson[i].close), klineJson[i].high);
    
    var lowerItems = klineutil.lowerItemsIndex(klineJson, i-20, i, "high", klineJson[i].high);
    return needle > inc_ave_8*0
        && lowerItems.length > 15
        && klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume) > 1
        && klineutil.increase(klineJson[i-1].volume_ave_8, klineJson[i-1].volume) > 0.1
        
        //&& klineutil.increase(klineJson[i-2].close, klineJson[i-1].open) < -inc_ave_8*0.1
        //&& klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) > inc_ave_8*1.2
}


/**
 * (-0.05, 0.05, 12) /47.85%
 * [shootStar description]
 * @return {[type]} [description]
 */
function shootStar(klineJson, i){
    var entity = Math.abs(klineJson[i].open - klineJson[i].close);
    var needle = klineJson[i].high-Math.max(klineJson[i].open, klineJson[i].close);
    var inc_ave_8 = klineJson[i].inc_ave_8;
    //var higherItems = klineutil.higherItemsIndex(klineJson, i-30, i-1, "low", klineJson[i].close);
    return  klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.01
            && klineutil.increase(klineJson[i-1].close, klineJson[i-1].open) < -0.0
            && needle > entity*0
            //&& i-higherItems[higherItems.length-1] > 0
            //&& higherItems.length > 3
            && (klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) < -0.3
             || klineutil.increase(klineJson[i-1].volume, klineJson[i-1].volume_ave_8) < 0.1)

}

/**
 * (-0.05, 0.05, 12) /48.78%
 * [shootStar description]
 * @return {[type]} [description]
 */
function hangNeck(klineJson, i){
    var entity = Math.abs(klineJson[i].open - klineJson[i].close);
    var needle = Math.min(klineJson[i].open, klineJson[i].close) - klineJson[i].low;
    
    return klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.01
            && needle > entity*0
            && klineutil.increase(klineJson[i].volume, klineJson[i].volume_ave_8) < -0.5;

}



exports.headShoulderTop = headShoulderTop;
exports.greenNRedGreen = greenNRedGreen;
exports.greenRedGreen = greenRedGreen;

exports.mTop = mTop;
exports.below8While21Down = below8While21Down;
exports.below8WhileVolumeHigh = below8WhileVolumeHigh;

exports.redInGreen = redInGreen;
exports.downpour = downpour;
exports.darkCloud = darkCloud;
exports.green3 = green3;
exports.duskStar = duskStar;
exports.shootStar = shootStar;
exports.hangNeck = hangNeck;

exports.lightningRod = lightningRod;
// exports.lightningRodB = lightningRodB;
// exports.lightningRodC = lightningRodC;