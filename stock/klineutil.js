
function increase(val1, val2) {
    try{
        return (val2-val1)/val1;
    } catch(e){
        console.log("function increase:", e);
        return undefined;
    }
}

function inBetween(val1, val2, val3) {
    return val1 > val2 && val1 < val3;
}

function highItemIndex(klineJson, from, to, field) {
    var idx = from;
    for (var i=from+1; i<klineJson.length && i<=to; i++) {
        if (klineJson[i][field] > klineJson[i-1][field]) idx = i;
    }
    return idx;
}

function detectSupport(klineJson, idx, interval) {
    var support = 0;
    var hasGapUp = false;
    var price = klineJson[idx].close;
    var lowTrough = Infinity;
    var lowTroughCount = 0;
    var highPeakCount = 0;
    for (var i=idx; i>=0 && idx-i<interval; i--) {
        var weight = interval-idx+i;
        if (!hasGapUp 
            && klineJson[i].gapUp
            && lowTrough > klineJson[i-1].close
            && inBetween(increase(klineJson[i-1].close, price), 0, 0.1)) {
            hasGapUp = true;
            support += interval*Math.max(1, Math.round(increase(klineJson[i-1].close, klineJson[i].open)/0.01));

            console.log(klineJson[i-1].date, interval*Math.max(1, Math.round(-increase(klineJson[i-1].close, klineJson[i].open)/0.01)));
        }

        if (klineJson[i].low_trough === true) {
            lowTrough = Math.min(klineJson[i].low, lowTrough);
            
            if(lowTroughCount<3 && inBetween(increase(klineJson[i].low, price), 0, 0.1)) {
                support += weight;
                lowTroughCount++;
            } 
        } 
            

        if (highPeakCount<3 && klineJson[i].high_peak === true 
            && inBetween(increase(klineJson[i].high, price), 0, 0.05)) {
            support += weight;
            highPeakCount++;
        }
    }
    
    console.log("support:", support-(hasGapUp?1:0), hasGapUp?1:0);
    return support;
}

function detectStress(klineJson, idx, interval) {
    var price = klineJson[idx].close;
    var stress = 0;
    var hasGapDown = false;
    var peakStress = 0;
    var highPeak = 0;
    var lowTrough = Infinity;

    var lowTroughCount = 0;
    var highPeakCount = 0;

    for (var i=idx; i>=0 && idx-i<interval; i--) {
        var weight = interval-idx+i;
        if (!hasGapDown 
            && klineJson[i].gapDown
            && highPeak < klineJson[i-1].close
            && inBetween(increase(price, klineJson[i].open), 0, 0.05)) {
            hasGapDown = true;
            stress += interval*Math.max(1, Math.round(-increase(klineJson[i-1].close, klineJson[i].open)/0.01));
            console.log(klineJson[i-1].date, interval*Math.max(1, Math.round(-increase(klineJson[i-1].close, klineJson[i].open)/0.01)))
        }

        if (klineJson[i].high_peak === true) {
            highPeak = Math.max(klineJson[i].high, highPeak);

            
            if(highPeakCount<3 && increase(price, klineJson[i].high) > 0.05 && increase(price, klineJson[i].high) < 0.20) {
                stress += weight;
                highPeakCount++;
            } /*else if(increase(price, klineJson[i].high) > 0.01 
                && increase(price, klineJson[i].high) < 0.05
                && increase(klineJson[i].close, klineJson[i].high) > 0.01) {
                stress++;
            }
            */
        } 
            

        if (lowTroughCount<3 && klineJson[i].low_trough === true 
            && increase(price, klineJson[i].low) > 0
            && increase(price, klineJson[i].low) < 0.05) {
            stress += weight;
            lowTroughCount++;
        }

    }

    peakStress = stress;
/*
    var kLine = klineJson[idx];
    var preKLine = klineJson[idx-1];
    var high = klineJson[idx].high;

    if (preKLine.close_ave_8 >= kLine.close_ave_8
        && (inBetween(increase(high, kLine.close_ave_8), -0.001, 0.001)
        || inBetween(increase(price, kLine.close_ave_8), -0.001, 0.001))) stress++;
    else if (preKLine.close_ave_21 >= kLine.close_ave_21
        && (inBetween(increase(high, kLine.close_ave_21), -0.001, 0.001)
        || inBetween(increase(price, kLine.close_ave_21), -0.001, 0.001))) stress++;
    else if (preKLine.close_ave_55 >= kLine.close_ave_55
        && (inBetween(increase(high, kLine.close_ave_55), -0.001, 0.001)
        || inBetween(increase(price, kLine.close_ave_55), -0.001, 0.001))) stress++;
    else if (preKLine.close_ave_144 >= kLine.close_ave_144
        && (inBetween(increase(high, kLine.close_ave_144), -0.001, 0.001)
        || inBetween(increase(price, kLine.close_ave_144), -0.001, 0.001))) stress++;
    else if (preKLine.close_ave_233 >= kLine.close_ave_233
        && (inBetween(increase(high, kLine.close_ave_233), -0.001, 0.001)
        || inBetween(increase(price, kLine.close_ave_233), -0.001, 0.001))) stress++;
    */
    //console.log("stress:", peakStress-(hasGapDown?1:0), hasGapDown?1:0);

    return stress;
}

function winOrLoss(klineJson, start, lossStop, winStop) {
    lossStop = lossStop||0.05;
    winStop = winStop || 0.1;
    var price = klineJson[start].close;
    var stopprice = price * (1-lossStop);
    var maxwin = 0;
    for (var i=start+1; i<klineJson.length; i++) {
        maxwin = Math.max(maxwin, increase(price, klineJson[i].high));
        if (maxwin > winStop) {
            return maxwin;
        } else if (klineJson[i].low < stopprice) {
            return increase(price, klineJson[i].low);
        }
    }

    return maxwin;

}
exports.detectStress = detectStress;
exports.detectSupport = detectSupport;
exports.highItemIndex = highItemIndex;
exports.increase = increase;
exports.inBetween = inBetween;
exports.winOrLoss = winOrLoss;