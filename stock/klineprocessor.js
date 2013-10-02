
function mergeTroughs(klineJson, field, interval, threshold) {
    var troughField = field+"_trough";
    var lastTroughIdx = -1;
    var peakIdxInBetween = 0;

    for (var i=0; i<klineJson.length; i++) {
        
        if (klineJson[peakIdxInBetween].low < klineJson[i].low) {
            peakIdxInBetween = i;
        }

        if (klineJson[i][troughField]!==true) {
            continue;
        }
        
        if (lastTroughIdx===-1) {
            lastTroughIdx = i;
            peakIdxInBetween = lastTroughIdx;
        } else {

            if (i - lastTroughIdx <= interval) {
                var j=i+1;
                for (; j<klineJson.length; j++) {
                    if (klineJson[j][troughField]===true) {
                        break;
                    }
                }
            
                if (j===klineJson.length) break;

                if (i - lastTroughIdx <= j-i) {
                    if(klineJson[lastTroughIdx].low <= klineJson[i].low){
                        delete klineJson[i][troughField];
                    } else {
                        delete klineJson[lastTroughIdx][troughField];
                        lastTroughIdx = i;
                        peakIdxInBetween = lastTroughIdx;
                    } 
                } else {
                    if(klineJson[i].low <= klineJson[j].low){
                        delete klineJson[j][troughField];
                        i--;
                    } else {
                        delete klineJson[i][troughField];
                    }
                }
                
            } else {
                lastTroughIdx = i;
                peakIdxInBetween = lastTroughIdx;
            }

        }

    }

}

function mergePeaks(klineJson, field, interval, threshold) {
    var peakField = field+"_peak";
    var lastPeakIdx = -1;
    var troughIdxInBetween = 0;

    for (var i=0; i<klineJson.length; i++) {
        if (klineJson[troughIdxInBetween].high > klineJson[i].high) {
            troughIdxInBetween = i;
        }

        if (klineJson[i][peakField]!==true) {
            continue;
        }
        
        if (lastPeakIdx===-1) {
            lastPeakIdx = i;
            troughIdxInBetween = lastPeakIdx;
        } else {
            
            if (i - lastPeakIdx <= interval) {
                var j=i+1;
                for (; j<klineJson.length; j++) {
                    if (klineJson[j][peakField]===true) {
                        break;
                    }
                }
                
                if (j===klineJson.length) break;

                if (i - lastPeakIdx <= j-i) {
                    if(klineJson[lastPeakIdx].high>=klineJson[i].high){
                        delete klineJson[i][peakField];
                    } else {
                        delete klineJson[lastPeakIdx][peakField];
                        lastPeakIdx = i;
                        troughIdxInBetween = lastPeakIdx;
                    } 
                } else {
                    if(klineJson[i].high>=klineJson[j].high){
                        delete klineJson[j][peakField];
                        i--;
                    } else {
                        delete klineJson[i][peakField];
                    }
                }
                
            } else {
                lastPeakIdx = i;
                troughIdxInBetween = lastPeakIdx;
            }

        }

    }

}

function markPeaks(klineJson, field, increaseMin) {
    var jsonLen = klineJson.length;
    var prePeak = Infinity;
    var prePeakIdx = 0;
    var highLowIdx = 0;
    var peakField = field+"_peak";
    for (var i=1; i<jsonLen; i++) {
        if (prePeakIdx===-1) {
            if(klineJson[i-1].high >= klineJson[i].high) {
                highLowIdx = i;
            } else {
                if (increase(klineJson[highLowIdx].high, klineJson[i].high)>increaseMin) {
                    prePeakIdx = i;
                }
            }
            continue;
        }

        if (klineJson[prePeakIdx].high < klineJson[i].high) {
            prePeakIdx = i;
        } else {
            if (increase(klineJson[i].high, klineJson[prePeakIdx].high) > increaseMin) {
                klineJson[prePeakIdx][peakField] = true;
                prePeakIdx = -1;
                highLowIdx = i;
            }
        }

    }

}

function markTroughs(klineJson, field, increaseMin) {
    var jsonLen = klineJson.length;
    var preTrough = Infinity;
    var preTroughIdx = 0;
    var lowHighIdx = 0;
    var troughField = field+"_trough";
    for (var i=1; i<jsonLen; i++) {
        if (preTroughIdx===-1) {
            if(klineJson[i-1].low <= klineJson[i].low) {
                //preTroughIdx = i;
                lowHighIdx = i;
            } else {
                if (increase(klineJson[i].low, klineJson[lowHighIdx].low)>increaseMin) {
                    preTroughIdx = i;
                }
            }
            continue;
        }

        if (klineJson[preTroughIdx].low > klineJson[i].low) {
            preTroughIdx = i;
        } else {
            if (increase(klineJson[preTroughIdx].low, klineJson[i].low) > increaseMin) {
                klineJson[preTroughIdx][troughField] = true;
                preTroughIdx = -1;
                lowHighIdx = i;
            }
        }

    }

}

function increase(val1, val2) {
    try{
        return (val2-val1)/val1;
    } catch(e){
        console.log("function increase:", e);
        return undefined;
    }
}

function average(klineJson, field, scale) {
    console.log("average:", field, scale);
    var scaleSum = 0;
    var jsonLen = klineJson.length;
    var aveField = field+"_ave_"+scale;
    for (var i= jsonLen-1; i>0; i--) {
        var kl = klineJson[i];
        scaleSum = scaleSum + kl[field];
        if (jsonLen-i == scale) {
            klineJson[jsonLen-1][aveField] = Math.round(100*scaleSum/scale)/100;
        } else if (jsonLen-i > scale) {
            scaleSum = scaleSum - klineJson[i+scale][field];
            klineJson[i+scale-1][aveField] = Math.round(100*scaleSum/scale)/100;
        }

    }
    
}

function exRightsDay(klineJson) {
    var jsonLen = klineJson.length;
    for (var i=1; i<jsonLen; i++) {
        var close = klineJson[i-1].close;
        var open = klineJson[i].open;
        if ((close-open)/close > 0.11) {
            klineJson[i].exRightsDay = true;
        }    
    }
}

//exports.markPeakAndTrough = markPeakAndTrough;
exports.mergeTroughs = mergeTroughs;
exports.mergePeaks = mergePeaks;
exports.markPeaks = markPeaks;
exports.markTroughs = markTroughs;
exports.average = average;
exports.exRightsDay = exRightsDay;