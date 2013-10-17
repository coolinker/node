
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
    var len = klineJson.length;
    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i][field] > klineJson[i-1][field]) idx = i;
    }
    return idx;
}

function lowItemIndex(klineJson, from, to, field) {
    var idx = from;
    var len = klineJson.length;
    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i][field] < klineJson[i-1][field]) idx = i;
    }
    return idx;
}


function leftTroughIdx(field, klineJson, idx) {
    for (var i=idx-1; i>0; i--) {
        if (klineJson[i][field+"_trough"]) return i;
    }
    return undefined;
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


function findBoxes(klineJson) {
    
    var len = klineJson.length;
    laststart = 50;
    for (var i=len-1; i>50; i--) {
        var amp = klineJson[i].amplitude_ave_55;

        var box = inBox(klineJson, i, "high", "low", amp*7);
        
        if (i - box.startIndex > 30 && laststart !== box.startIndex) {
            laststart = box.startIndex;
            console.log(klineJson[box.startIndex].date, box.high, box.low, increase(box.low, box.high).toFixed(2), amp*7, klineJson[i].date);
        }

       
    }
   
}

function inBox(klineJson, idx, peakField, troughField, boxHight) {
    var box = boxLeft(klineJson, idx, peakField, troughField, boxHight);

    if (klineJson[idx][peakField] > box.high || klineJson[idx][troughField] < box.low) {
        return {startIndex:idx, endIndex:idx, high:klineJson[idx][peakField], highIdx: idx,
             low: klineJson[idx][troughField], lowIdx:idx}
    }

    var start = box.startIndex;
    if (klineJson[start][peakField] > box.high) {
        var len = box.endIndex;
        for (var i = start ; i<=len; i++ ) {
            if (klineJson[i][peakField] <= box.high) {
                box.startIndex = i;
                break;
            }
        }
    } else if (klineJson[start][troughField] < box.low) {
        var len = box.endIndex;
        for (var i = start ; i<=len; i++ ) {
            //if (klineJson[idx].date === '08/26/2013') console.log(klineJson[box.startIndex].date, klineJson[i][troughField] ,box.low);
            if (klineJson[i][troughField] >= box.low) {
                box.startIndex = i;
                break;
            }

        }
    }

    return box;

}

function boxLeft(klineJson, idx, peakField, troughField, boxHight) {
    boxHight = boxHight || 0.2;    
    var len = klineJson.length;
    var peak = 0;
    var peakIdx = -1;
    var trough = Infinity;
    var troughIdx = -1;

    for (var i = idx; i>=0; i--) {
        
        if (klineJson[i].exRightsDay) {
            return {startIndex:i, endIndex:idx, high:peak, highIdx: peakIdx, low: trough, lowIdx:troughIdx};
        }

        if (klineJson[i][peakField+"_peak"] === true && klineJson[i][peakField] > peak) {
            
            if (trough!==Infinity && increase(trough, klineJson[i][peakField]) > boxHight)  {
                //if (klineJson[idx].date === '08/26/2013') console.log('peak', klineJson[i].date, klineJson[i][peakField]);
                return {startIndex:i+1, endIndex:idx, high:peak, highIdx: peakIdx, low: trough, lowIdx:troughIdx};
            } else {
                peak = klineJson[i][peakField];
                peakIdx = i;
                //if (klineJson[i].date=== "12/04/2012") console.log(klineJson[i][peakField]);

            }
        }

        if (klineJson[i][troughField+"_trough"] === true && klineJson[i][troughField] < trough) {
            if (increase(klineJson[i][troughField], peak) > boxHight)  {
                //if (klineJson[idx].date === '08/26/2013') console.log('trough', klineJson[i].date, klineJson[i][troughField]);
                return {startIndex:i+1, endIndex:idx, high:peak, highIdx: peakIdx, low: trough, lowIdx:troughIdx};
            } else {
                trough = klineJson[i][troughField];
                troughIdx = i;
                //if (klineJson[i].date=== "12/04/2012") console.log(klineJson[i][troughField]);
            }
        }
        
    }

    return {startIndex:0, endIndex:idx, high:peak, highIdx: peakIdx, low: trough, lowIdx:troughIdx}
}

exports.findBoxes = findBoxes;
exports.inBox = inBox;
exports.leftTroughIdx = leftTroughIdx;
exports.lowItemIndex = lowItemIndex;
exports.highItemIndex = highItemIndex;
exports.increase = increase;
exports.inBetween = inBetween;
exports.winOrLoss = winOrLoss;