var klineutil = require("./klineutil");
var klineio = require("./klineio");
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
    var highLow = Infinity;
    var peakField = field+"_peak";
    for (var i=0; i<jsonLen; i++) {
        if (prePeakIdx===-1) {
            if(highLow >= klineJson[i].high) {
                highLowIdx = i;
                highLow = klineJson[i].high;
            } else {
                if (klineutil.increase(highLow, klineJson[i].high)>increaseMin) {
                    prePeakIdx = i;
                }
            }
            continue;
        }

        if (klineJson[prePeakIdx].high < klineJson[i].high) {
            prePeakIdx = i;
        } else {
            if (klineutil.increase(klineJson[i].high, klineJson[prePeakIdx].high) > increaseMin) {
                klineJson[prePeakIdx][peakField] = true;
                prePeakIdx = -1;
                highLowIdx = i;
                highLow = klineJson[highLowIdx].high;
            }
        }

    }

}

function markTroughs(klineJson, field, increaseMin) {
    var jsonLen = klineJson.length;
    var preTrough = Infinity;
    var preTroughIdx = 0;
    var lowHighIdx = 0;
    var lowHigh = 0;
    var troughField = field+"_trough";
    for (var i=0; i<jsonLen; i++) {
        if (preTroughIdx===-1) {
            if(lowHigh <= klineJson[i].low) {
                //preTroughIdx = i;
                lowHigh = klineJson[i].low;
                lowHighIdx = i;
            } else {
                if (klineutil.increase(klineJson[i].low, lowHigh)>increaseMin) {
                    preTroughIdx = i;
                }
            }
            continue;
        }

        if (klineJson[preTroughIdx].low > klineJson[i].low) {
            preTroughIdx = i;
        } else {
            if (klineutil.increase(klineJson[preTroughIdx].low, klineJson[i].low) > increaseMin) {
                klineJson[preTroughIdx][troughField] = true;
                preTroughIdx = -1;
                lowHighIdx = i;
                lowHigh = klineJson[lowHighIdx].low;
            }
        }

    }

}
/*
function increase(val1, val2) {
    try{
        return (val2-val1)/val1;
    } catch(e){
        console.log("function increase:", e);
        return undefined;
    }
}
*/
function average(klineJson, field, scale) {
    //console.log("average:", field, scale);
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
        var preclose = klineJson[i-1].close;        
        var prehigh = klineJson[i-1].high;
        var prelow = klineJson[i-1].low;

        var close = klineJson[i].close;
        var open = klineJson[i].open;
        var low = klineJson[i].low;
        var high = klineJson[i].high;

        if (klineutil.increase(prehigh, low) > 0 && open < close) {
            klineJson[i].gapUp = klineutil.increase(prehigh, low);
        } else if (klineutil.increase(preclose, open) < -0.11) {
            klineJson[i].exRightsDay = true;
        } else if(klineutil.increase(prelow, high) < 0 && open > close) {
            klineJson[i].gapDown = klineutil.increase(prelow, high);
        }

    }
}


function updateKLines(match) {
    var stocks = klineio.getAllStockIds(match);
    //stocks = ["SZ300215"];
    
    stocks.forEach(
        function (stockId) {
            klineio.readKLineBase(stockId, function(kLineJason) {
            exRightsDay(kLineJason);
            average(kLineJason, "close", 8);
            average(kLineJason, "close", 21);
            average(kLineJason, "close", 55);
            average(kLineJason, "close", 144);
            average(kLineJason, "close", 233);
            average(kLineJason, "volume", 8);
            average(kLineJason, "volume", 21);

            markPeaks(kLineJason, "high", 0.02);
    //klineprocesser.mergePeaks(kLineJason, "high", 2);

            markTroughs(kLineJason, "low", 0.02);
    //klineprocesser.mergeTroughs(kLineJason, "low", 3);

            klineio.writeKLine(stockId, kLineJason);
        });

    });
}

exports.updateKLines = updateKLines;
exports.mergeTroughs = mergeTroughs;
exports.mergePeaks = mergePeaks;
exports.markPeaks = markPeaks;
exports.markTroughs = markTroughs;
exports.average = average;
exports.exRightsDay = exRightsDay;