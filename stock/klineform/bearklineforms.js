
var klineutil = require("../klineutil");

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
     
    return higherItems.length>0 
            && (bottom - higherItems[higherItems.length-1] < 3 || 0===klineutil.inBetween(higherItems.length, 4, 25))
            && klineutil.increase(klineJson[bottom].low, klineJson[i].close) < klineJson[i].amplitude_ave_8
            && klineutil.increase(klineJson[bottom-2].close, klineJson[bottom-1].close)<-0.025
            && klineutil.increase(klineJson[bottom-1].open, klineJson[i-1].close)>-klineJson[i].amplitude_ave_8;
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
         // if (klineJson[targetDay].date=='09/15/2010')
         //    console.log(targetDay , higherItems,
         //        klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay].close, klineJson[targetDay].open)
         //        , klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21)
         //        , klineutil.increase(klineJson[targetDay].close_ave_21, klineJson[i].close_ave_21))
     
        return 0 === klineutil.inBetween(klineJson[targetDay].close_ave_8, klineJson[targetDay].close, klineJson[targetDay].open)
            && klineutil.increase(klineJson[targetDay].open, klineJson[targetDay].close) < -0.03
            && klineutil.increase(klineJson[targetDay-1].close_ave_21, klineJson[i].close_ave_21) < 0.005
            //&& klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21) < 0.01
            //&& klineutil.increase(klineJson[i-1].close_ave_21, klineJson[i].close_ave_21) < klineutil.increase(klineJson[targetDay].close_ave_21, klineJson[i].close_ave_21)
            && 0 === klineutil.inBetween(targetDay - higherItems[higherItems.length-1], 5, 10)
            && belowAve("close_ave_8", "close", klineJson, targetDay+1, i-targetDay, 0.01)
        
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
    var amp = klineJson[i].amplitude_ave_8;
    
    //var higherItems = klineutil.higherItemsIndex(klineJson, i-30, i, "close", klineJson[i].open);
    //if (klineJson[i].date=="04/22/2011") console.log(i, higherItems, amp)
    
    // return klineutil.increase(Math.min(klineJson[i-1].open, klineJson[i-2].close), klineJson[i-1].close) > 0.01
    // && klineutil.increase((klineJson[i-1].open+klineJson[i-1].close)/2, klineJson[i].close) < -0.01
    // && klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.005
    
    return (klineutil.increase(Math.min(klineJson[i-1].open, klineJson[i-2].close), klineJson[i-1].close) > 0.025
    && klineutil.increase((klineJson[i-1].open+klineJson[i-1].close)/2, klineJson[i].close) < -0.0
    ||klineutil.increase(Math.min(klineJson[i-1].open, klineJson[i-2].close), klineJson[i-1].close) > 0.01
    && klineutil.increase((klineJson[i-1].open+klineJson[i-1].close)/2, klineJson[i].close) < -0.01)

    && klineutil.increase(klineJson[i-1].close, klineJson[i].open) > 0.005

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
            //&& upLeftTrough(klineJson, targetDay, "low", klineJson[targetDay].low) < 0.05
            //&& detectGapDownStress(klineJson, i) === undefined;
}

function belowAve(aveField, field, klineJson, idx, count, accuracy) {

    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (klineutil.increase(klineJson[i][aveField], klineJson[i][field]) > accuracy) {
            return false;
        }
    }
    return true;
}

function belowPrice(price, field, klineJson, idx, count, accuracy) {
    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (klineutil.increase(price, klineJson[i][field]) > accuracy) {
            return false;
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



exports.headShoulderTop = headShoulderTop;
exports.greenNRedGreen = greenNRedGreen;
exports.mTop = mTop;
exports.below8While21Down = below8While21Down;
exports.below8WhileVolumeHigh = below8WhileVolumeHigh;

exports.redInGreen = redInGreen;
exports.downpour = downpour;
exports.darkCloud = darkCloud;

exports.red3 = red3;
exports.on8While21Up = on8While21Up;
exports.on8While21UpVolumeHigh = on8While21UpVolumeHigh;