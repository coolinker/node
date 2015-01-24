 var ignoreEx = false;

function increase(val1, val2) {
    try{
        return (val2-val1)/val1;
    } catch(e){
        console.log("function increase:", e);
        return undefined;
    }
}

function inBetween(val1, val2, val3) {
    if (val1 < val2) return increase(val2,val1);
    if (val1 > val3) return increase(val3,val1);
    if (val1 >= val2 && val1 <= val3) return 0;
}


function entityMiddle(dayJson) {
    return (dayJson.close+dayJson.open)/2;
}

function entityCompare(dayJson1, dayJson2) {
    var high1 = Math.max(dayJson1.close, dayJson1.open);
    var low1 = Math.min(dayJson1.close, dayJson1.open);

    var high2 = Math.max(dayJson2.close, dayJson2.open);
    var low2 = Math.min(dayJson2.close, dayJson2.open);

    if (high1>high2 && low1>low2) {
        return 1;
    } else if (high1< high2 && low1<low2) {
        return -1;
    } else if (entityMiddle(dayJson1) > entityMiddle(dayJson2)){
        return 1;
    } else if(entityMiddle(dayJson1) < entityMiddle(dayJson2)) {
        return -1
    } else return 0;
}

function lowIndexOfUpTrend(klineJson, from){
    var idx = from;
    for (var idx = from; idx>=3; idx--) {
        var cp01 = entityCompare(klineJson[idx], klineJson[idx-1]);
        var cp12 = entityCompare(klineJson[idx-1], klineJson[idx-2]);
        if (cp01>0 && cp12>0) {
            continue;
        } else if (cp01<0 && cp12<0) { 
            return idx;
        } else if (cp01>0) {
            continue;
        } else if (cp01<=0){
            var cp02 = entityCompare(klineJson[idx], klineJson[idx-2]);
            if (cp02>0) continue;
            else return idx;
        }

    }
    
    return 0;
}

function highIndexOfDownTrend(klineJson, from){
    var idx = from;
    for (var idx = from; idx>=3; idx--) {
        var cp01 = entityCompare(klineJson[idx], klineJson[idx-1]);
        var cp12 = entityCompare(klineJson[idx-1], klineJson[idx-2]);
        if (cp01<0 && cp12<0) {
            continue;
        } else if (cp01>0 && cp12>0) { 
            return idx;
        } else if (cp01<0) {
            continue;
        } else if (cp01>=0){
            var cp02 = entityCompare(klineJson[idx], klineJson[idx-2]);
            if (cp02<0) continue;
            else return idx;
        }

    }

    return 0;
}

function higherItemsIndex(klineJson, from, to, field, value) {
    from = from<0 ? 0 : from;
    var len = klineJson.length;
    var items = [];
    var exRight = 1;
    for (var i=from; i>=1 && i<len && i<=to; i++) {
        if (!ignoreEx && klineJson[i].exRightsDay) {
            if (exRight===1) {
                exRight = klineJson[i].open/klineJson[i-1].close;
                value = value/exRight;
                items.length = 0;
                i = from;
                continue;
            } else {
                vlaue = value*exRight;
            }
            
        }
        if(klineJson[i][field] > value) items.push(i);
    }

    return items;
}

function lowerItemsIndex(klineJson, from, to, field, value) {
    from = from<0 ? 0 : from;
    var len = klineJson.length;
    var items = [];
    var exRight = 1;
    for (var i=from; i<len && i<=to; i++) {
        if (!ignoreEx && klineJson[i].exRightsDay) {
            if (exRight===1) {
                exRight = klineJson[i].open/klineJson[i-1].close;
                value = value/exRight;
                items.length = 0;
                i = from;
                continue;
            } else {
                vlaue = value*exRight;
            }
            
        }
        if(klineJson[i][field] < value) items.push(i);
    }

    return items;
}


function highItemIndex(klineJson, from, to, field) {
    from = from<0 ? 0 : from;
    var idx = from;
    var len = klineJson.length;
    var exRight = 1;
    var exRightIdx;
    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i].exRightsDay) {
            exRight = klineJson[i].open/klineJson[i-1].close;
            exRightIdx = i;
        }

        if (!ignoreEx && exRightIdx!==undefined) {
            if (klineJson[i][field]/exRight > klineJson[idx][field] / (idx >= exRightIdx ? exRight : 1)) idx = i;
        } else if (klineJson[i][field] > klineJson[idx][field]) idx = i;
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
    var exRight = 1;
    var exRightIdx;

    for (var i=from+1; i<len && i<=to; i++) {
        if (klineJson[i].exRightsDay) {
            exRight = klineJson[i].open/klineJson[i-1].close;
            exRightIdx = i;
        }

        if (!ignoreEx && exRightIdx!==undefined) {
            if (klineJson[i][field]/exRight < klineJson[idx][field] / (idx >= exRightIdx ? exRight : 1)) idx = i;
        } else if (klineJson[i][field] < klineJson[idx][field]) idx = i;        
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

function noExRight(klineJson, from, to) {
    for (var i=Math.max(0,from); i<=to; i++) {
        if (klineJson[i].exRightsDay) return false;
    }
    return true;
}

function winOrLoss(klineJson, start, lossStop, winStop, daysStop, resultObj) {
    lossStop = lossStop||-0.05;
    winStop = winStop || 0.05;
    daysStop = daysStop || 200;
    var price = klineJson[start].close;
    var stoplossprice = price * (1+lossStop);
    var stopwinprice = price * (1+winStop);
    var exRight = 1;
    var i;

    for ( i=start+1; i<klineJson.length && (i-start)<=daysStop ; i++) {
        if (klineJson[i].exRightsDay) {
            exRight = klineJson[i].open/klineJson[i-1].close;
        }
        var close = klineJson[i].close/exRight;
        var high = klineJson[i].high/exRight;
        var low = klineJson[i].low/exRight;
        if (low <= stoplossprice) {
            var inc =  increase(price, low);
            if (resultObj) {
                resultObj.inc = inc;
                resultObj.days = i-start;
                resultObj.stopDate = klineJson[i].date;
            }
            return inc;
        }
        
        if (high >= stopwinprice) {
            var inc =  increase(price, high);
            if (resultObj) {
                resultObj.inc = inc;
                resultObj.days = i-start;
                resultObj.stopDate = klineJson[i].date;
            }
            return inc;
        } 
    }

    var inc = increase(price, klineJson[i-1].close/exRight);
    if (resultObj) {
        resultObj.inc = inc;
        resultObj.days = i-start;
    }
    return inc;
}

function winOrLossA(klineJson, start, lossStop, winStop, daysStop) {
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

function belowAve(aveField, field, klineJson, idx, count, accuracy) {
    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (increase(klineJson[i][aveField], klineJson[i][field]) > accuracy) {
            return false;
        }
    }
    return true;
}

function aboveAve(aveField, field, klineJson, idx, count, accuracy) {
    accuracy = accuracy || 0;
    for (var i=idx; i<idx+count; i++) {
        if (increase(klineJson[i][aveField], klineJson[i][field]) < -accuracy) {
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

function getSpports(klineJson, idx, price, range, unit){
    var priceMap = {};
    var priceArr = [];
    var klj = klineJson[idx];
    price = price!==undefined? price: klj.close;
    range = range!==undefined? range: 0.1;
    unit = unit!==undefined? unit: 0.005;
    
    var ceil = price;
    var floor = price*(1-range);
    var x = Math.ceil(100*price*unit)/100;

    // console.log("x", x, klj.close)
    var fun = function(price) {
        if (price>ceil || price<floor) return;
        if (priceMap[price]) {
            priceMap[price]++;
        } else {
            priceMap[price] = 1;
            priceArr.push(price);
        }
    }

    for (var j=idx; j>=1 && idx-j<100; j--) {
        var _klj = klineJson[j];
        fun(_klj.close);
        if (_klj.low !== _klj.high) {
            fun(_klj.open);
            fun(_klj.low);
            fun(_klj.high);
        }
    }

    var priceMapNew = {};
    var priceArrNew = [];

    for (var k = ceil; k>=floor+x; k-=0.01) {
        var rangesum = 0;
        k = Math.floor(k*100)/100;
        for (var m = k; m>k-x; m-=0.01) {
            m = Math.floor(m*100)/100;           
            if (priceMap[m]) rangesum += priceMap[m];
        }
        priceMapNew[k] = rangesum;

        var len = priceArrNew.length;
        if (len>0 ) {
            var pre = priceArrNew[len-1];
            if (pre-k<x/2) {
                if (priceMapNew[pre] <= priceMapNew[k]) {
                    priceArrNew.pop();
                    priceArrNew.push(k);
                } 
            } else {
                priceArrNew.push(k);
            }
        } else {
           priceArrNew.push(k); 
        }

    }

    priceArrNew.sort(function(p1, p2){
        if (priceMapNew[p1] > priceMapNew[p2]) return -1;
        else if(priceMapNew[p1] < priceMapNew[p2]) return 1;
        return 0;
    })
    
    var supportArr = priceArrNew.slice(0,5);

    supportArr.sort(function(p1, p2) {
        var d1 = klj.close-p1;
        var d2 = klj.close-p2;
        if(d1>d2) return 1;
        else if (d1<d2) return -1;
        return 0;
    })
    for (var s=0;s<supportArr.length;s++) {
        var p = supportArr[s];
        supportArr[s] = priceMapNew[p]+"@"+p;
        // console.log(p, priceMapNew[p])
    }
    
    return supportArr;
}

exports.getSpports = getSpports;
exports.leftTroughIdx = leftTroughIdx;
exports.leftTrough = leftTrough;
exports.lowItemIndex = lowItemIndex;
exports.lowItem = lowItem;
exports.highItemIndex = highItemIndex;
exports.highItem = highItem;
exports.increase = increase;

exports.higherItemsIndex = higherItemsIndex;
exports.lowerItemsIndex = lowerItemsIndex;

exports.inBetween = inBetween;
exports.winOrLoss = winOrLoss;

exports.highIndexOfDownTrend = highIndexOfDownTrend;
exports.lowIndexOfUpTrend = lowIndexOfUpTrend;

exports.belowAve = belowAve;
exports.aboveAve = aboveAve;

exports.noExRight = noExRight;