
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
    var i;
    for (i=idx-1; i>0; i--) {
        if (klineJson[i][field+"_trough"]) {
            break;
        }
    }

    return i;
}

function leftTrough(field, klineJson, idx) {
    var troughIdx =  leftTroughIdx(field, klineJson, idx);
    if (troughIdx >= 0) {
        return klineJson[troughIdx][field];
    }
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
        
        if (klineJson[i].high_peak !== true) continue;
        var box = ceilBox(klineJson, i, "high");
        
        if (box) {            
            console.log(klineJson[box.start].date, klineJson[box.end].date, box.floor, box.ceil,
                increase(klineJson[box.start].high, klineJson[box.end].high));
        }

       
    }
   
}

function ceilBox(klineJson, idx, peakField, maxInterval, minDiff) {
    peakField = peakField || "high";
    maxInterval = maxInterval || 233;
    minDiff = minDiff || 0.02;
    var ceil = klineJson[idx][peakField];
    var floor = ceil;
    var startCeilIdx;

    for (var i=idx-1; i>0 && idx-i<maxInterval; i--) {
        floor = Math.min(floor, klineJson[i].low);
        if (klineJson[i][peakField+"_peak"] === true) {
            if ( increase(ceil, klineJson[i][peakField]) > minDiff) {
                break;
            }

            
            if (Math.abs(increase(klineJson[i][peakField], ceil)) < minDiff) {
                startCeilIdx = i;
            }

        }

    }

    return startCeilIdx===undefined?undefined:{start: startCeilIdx, floor: floor, ceil:ceil, end: idx};
}

function inBox(klineJson, idx, peakField, troughField, boxHight) {
    var box = roughBoxAtLeft(klineJson, idx, peakField, troughField, boxHight);

    if (klineJson[idx].date === '04/11/2013') 
        console.log("==", klineJson[box.startIndex].date, klineJson[box.endIndex].date, box.low, box);

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

function roughBoxAtLeft(klineJson, idx, peakField, troughField, boxHight) {
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
        } else if (klineJson[i][troughField+"_trough"] === true && klineJson[i][troughField] < trough) {
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
exports.leftTrough = leftTrough;
exports.lowItemIndex = lowItemIndex;
exports.highItemIndex = highItemIndex;
exports.increase = increase;
exports.inBetween = inBetween;
exports.winOrLoss = winOrLoss;