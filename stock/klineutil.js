
function increase(val1, val2) {
    try{
        return (val2-val1)/val1;
    } catch(e){
        console.log("function increase:", e);
        return undefined;
    }
}

function inBetween(val1, val2, val3) {
    if (val1 < val2) return -1;
    if (val1 > val3) return 1;
    if (val1 >= val2 && val1 <= val3) return 0;
}


function highItemIndex(klineJson, from, to, field) {
    from = from<0 ? 0 : from;
    var idx = from;
    var len = klineJson.length;
    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i][field] > klineJson[idx][field]) idx = i;
    }
    return idx;
}

function highItem(klineJson, from, to, field) {
    var idx = highItemIndex(klineJson, from, to, field);
    return klineJson[idx][field];
}

function lowItemIndex(klineJson, from, to, field) {
    from = from<0 ? 0 : from;
    var idx = from;
    var len = klineJson.length;
    
    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i][field] < klineJson[idx][field]) idx = i;        
    }
    return idx;
}

function lowItem(klineJson, from, to, field) {
    var idx = lowItemIndex(klineJson, from, to, field);
    return klineJson[idx][field];
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

function winOrLoss(klineJson, start, lossStop, winStop, daysStop) {
    lossStop = lossStop||-0.05;
    winStop = winStop || 0.05;
    daysStop = daysStop || 200;
    var price = klineJson[start].close;
    var stopprice = price * (1+lossStop);
    var maxwin = 0;
    for (var i=start+1; i<klineJson.length && (i-start)<=daysStop ; i++) {
        maxwin = Math.max(maxwin, increase(price, klineJson[i].high));
        if (maxwin >= winStop) {
            return maxwin;
        } else if (klineJson[i].low <= stopprice) {
            return increase(price, klineJson[i].low);
        }
    }

    return maxwin;

}


exports.leftTroughIdx = leftTroughIdx;
exports.leftTrough = leftTrough;
exports.lowItemIndex = lowItemIndex;
exports.lowItem = lowItem;
exports.highItemIndex = highItemIndex;
exports.highItem = highItem;
exports.increase = increase;
exports.inBetween = inBetween;
exports.winOrLoss = winOrLoss;