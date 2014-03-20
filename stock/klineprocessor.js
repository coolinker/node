var klineutil = require("./klineutil");
var intersectionprocessor = require("./klineform/intersectionprocessor").config(1);
var klineio;
var klineformanalyser;
var pendingcount = 0;
function config(start, end){
    klineio  = require("./klineio").config(start, end);
    klineformanalyser = require("./klineform/analyser").config({
        startDate: start,
        endDate: end
    });

    return this;
}

function highCeilBoxCompare(json1, json2, midValue, offset) {
    var low = midValue - offset;
    var high = midValue + offset;
    var entityHigh1 = json1.high;
    var entityHigh2 = Math.max(json2.close, json2.open);

    var hh = klineutil.inBetween(klineutil.increase(json1.high, json2.high), low, high);
    var ch = klineutil.inBetween(klineutil.increase(entityHigh1, json2.high), low, high);
    var hc = klineutil.inBetween(klineutil.increase(json1.high, entityHigh2), low, high);
    var cc = klineutil.inBetween(klineutil.increase(entityHigh1, entityHigh2), low, high);

  
    if (hh===0 || ch ===0 || hc===0 || cc === 0) return 0;
    if (hh>0) return 1;
    return -1;

}

function markBoxs(klineJson, peakValueField, peakFlag, compareFun) {
    var len = klineJson.length;
    var peaks = [];

    for (var i=0; i<len; i++) {
        if (klineJson[i][peakFlag]) {
            peaks.push(klineJson[i]);
        }
    }

    len = peaks.length;
    for (var m=len-1; m>=0; m--) {
        var startJson = peaks[m];
        var results = [startJson.date];
        for (var n=m-1; n>=0; n--) {
            var curJson = peaks[n];
            var compare = compareFun(startJson, curJson);
            if (compare === 0) {
                results.push(curJson.date);
            } else if (compare > 0) {
                break;
            }
        }


        if (results.length>1) {
            startJson[peakValueField+"Box"+compareFun.name] = results;
            console.log("results", results)
        }
    }
}

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

function markPeaks(klineJson, field, increaseMin, minInterval) {
    var jsonLen = klineJson.length;
    var prePeak = Infinity;
    var prePeakIdx = 0;
    var highLowIdx = 0;
    var highLow = Infinity;
    var peakField = field+"_peak";
    for (var i=0; i<jsonLen; i++) {
        
        if (prePeakIdx===-1) {
            
            if(highLow >= klineJson[i][field]) {
                highLowIdx = i;
                highLow = klineJson[i][field];
            } else {
                if (klineutil.increase(highLow, klineJson[i][field])>increaseMin) {
                    prePeakIdx = i;
                }
            }
            continue;
        }

        if (klineJson[prePeakIdx][field] < klineJson[i][field]) {
            prePeakIdx = i;
        } else {
            if ((i-prePeakIdx) >= minInterval
                && klineutil.increase(klineJson[i][field], klineJson[prePeakIdx][field]) > increaseMin) {
                klineJson[prePeakIdx][peakField] = true;
                prePeakIdx = -1;
                highLowIdx = i;
                highLow = klineJson[highLowIdx][field];
            }
        }

    }

}

function markTroughs(klineJson, field, increaseMin, minInterval) {
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
            if ((i-preTroughIdx) >= minInterval
                && klineutil.increase(klineJson[preTroughIdx].low, klineJson[i].low) > increaseMin) {
                klineJson[preTroughIdx][troughField] = true;
                preTroughIdx = -1;
                lowHighIdx = i;
                lowHigh = klineJson[lowHighIdx].low;
            }
        }

    }

}

function average(klineJson, field, interval, ignoreEx, valFun) {
    //console.log("average:", field, interval);
    var scaleSum = 0;
    var jsonLen = klineJson.length;
    var aveField = field+"_ave_"+interval;
    if (valFun===undefined) {
        valFun = function(klj, n) {
            return klj[n][field];
        }
    }
    for (var i= jsonLen-1; i>0; i--) {
        if (!ignoreEx && klineJson[i].exRightsDay) {
            scaleSum = scaleSum * (klineJson[i].open/klineJson[i-1].close);
        }
        scaleSum = scaleSum + valFun(klineJson, i);
        if (jsonLen-i === interval) {
            klineJson[jsonLen-1][aveField] = Math.round(1000*scaleSum/interval)/1000;
        } else if (jsonLen-i > interval) {
            scaleSum = scaleSum - valFun(klineJson, i+interval);
            klineJson[i+interval-1][aveField] = Math.round(1000*scaleSum/interval)/1000;
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
       
       if (klineutil.increase(preclose, open) < -0.105) {
            klineJson[i].exRightsDay = true;
        } else if (klineutil.increase(preclose, open) > 0.105) {
            klineJson[i].exRightsDay = true;
        } 

        // if (klineutil.increase(prehigh, low) > 0 && open < close) {
        //     klineJson[i].gapUp = klineutil.increase(prehigh, low);
        // } else if(klineutil.increase(prelow, high) < 0 && open > close) {
        //     klineJson[i].gapDown = klineutil.increase(prelow, high);
        // }

    }
}

function matchForms(kLineJson) {
    var jsonLen = kLineJson.length;
    var bullforms = klineformanalyser.bullKLineFormMethods();
     klineformanalyser.traverseForAppearance(bullforms, kLineJson, {
                formHandler: function(form, klineJson, i) {},
                formsHandler: function(forms, klineJson, i) {
                    klineJson[i].match = forms;
                    var reObj = {};
                    var inc_ave_8 = kLineJson[i].inc_ave_8;
                    if (!inc_ave_8) return;

                    var winStop = Math.min(3.7*inc_ave_8, 0.15);
                    var lossStop = Math.max(-3.7*inc_ave_8, -0.15);

                    var rel = klineutil.winOrLoss(kLineJson, i, lossStop, winStop, 100, reObj);
                    var days = reObj.days;
                    var date = kLineJson[i].date;
                    var j=1;
                    for (; j<days && i+j<jsonLen; j++) {
                        if(!kLineJson[i+j].pendings) {
                            kLineJson[i+j].pendings = {};
                        }
                        var pobj = {"day": j};
                        //pobj.date = date;
                        pobj.ratio = intersectionprocessor.matchRatio(forms);
                        kLineJson[i+j].pendings[date] = pobj;

                    }
                    if (j===days && i+j<jsonLen) {
                        if(!kLineJson[i+j].stop) kLineJson[i+j].stop = {};
                        kLineJson[i+j].stop[date] = kLineJson[i].winOrLose;
                        var wl = (rel >= winStop? "win": (rel<=lossStop?"lose":"pending"));
                        if (kLineJson[i].winOrLose!=wl) console.log("error",wl, kLineJson[i].winOrLose, date);
                    }

                }
            });
}

function winOrLose(kLineJson) {
    var jsonLen = kLineJson.length;
    for (var i=0; i<jsonLen; i++) {
        var inc_ave_8 = kLineJson[i].inc_ave_8;
        if (!inc_ave_8) continue;

        var winStop = Math.min(3.7*inc_ave_8, 0.15);
        var lossStop = Math.max(-3.7*inc_ave_8, -0.15);
        //var reObj = {};
        var rel = klineutil.winOrLoss(kLineJson, i, lossStop, winStop, 100/*, reObj*/);
        //var days = reObj.days;
        // var date = kLineJson[i].date;
        // for (var j=1; j<days && i+j<jsonLen; j++) {
        //     if(!kLineJson[i+j].pendings) {
        //         kLineJson[i+j].pendings = {};
        //     }
        //     kLineJson[i+j].pendings[date] = j;
        // }

        kLineJson[i].incStop = rel;
        kLineJson[i].winOrLose = rel>=winStop ? "win" : (rel<=lossStop?"lose":"pending");
    }
}

function updateKLines(match) {
    var stocks = klineio.getAllStockIds(match);
    //stocks = ["SH600016"];
    
    stocks.forEach(
        function (stockId) {
            klineio.readKLineBaseSync(stockId, function(kLineJson) {
            exRightsDay(kLineJson);
            average(kLineJson, "close", 8);
            average(kLineJson, "close", 21);
            average(kLineJson, "close", 55);
            average(kLineJson, "close", 144);
            average(kLineJson, "close", 233);
            average(kLineJson, "volume", 8, true);
            average(kLineJson, "volume", 21, true);

            average(kLineJson, "amplitude", 8, true, function (klj, n) {
                var kl = klj[n];
                return klineutil.increase(kl.low, kl.high);
            });

            average(kLineJson, "amplitude", 55, true, function (klj, n) {
                var kl = klj[n];
                return klineutil.increase(kl.low, kl.high);
            });

            average(kLineJson, "inc", 8, true, function (klj, n) {
                if (n===0) return 0;
                var klc = klj[n].close;
                var klc1 = klj[n-1].close;
                if (klj[n].exRightsDay) {
                    klc1 = klc1*(klj[n].open/klj[n-1].close);
                }
                return Math.abs(klineutil.increase(klc1, klc));
            });

            average(kLineJson, "inc", 21, true, function (klj, n) {
                if (n===0) return 0;
                var klc = klj[n].close;
                var klc1 = klj[n-1].close;
                if (klj[n].exRightsDay) {
                    klc1 = klc1*(klj[n].open/klj[n-1].close);
                }
                return Math.abs(klineutil.increase(klc1, klc));
            });
            //console.log(stockId);
            winOrLose(kLineJson);
            matchForms(kLineJson);
            //average(kLineJson, "amplitude", 144, function (kl) {
            //    return klineutil.increase(kl.low, kl.high);
            //});

            //markPeaks(kLineJson, "high", 0.02, 3);
            
            //mergePeaks(kLineJson, "high", 3);

            //markTroughs(kLineJson, "low", 0.02, 3);
            
           //mergeTroughs(kLineJson, "low", 3);


            // markBoxs(kLineJson, "high", "high_peak", function highCeilBoxCompareWrapper(json1, json2) {
            //     return highCeilBoxCompare(json1, json2, 0, (json1.amplitude_ave_8+json2.amplitude_ave_8)/12);
            // });


            klineio.writeKLineSync(stockId, kLineJson);
        });

    });
}

exports.config = config;
exports.updateKLines = updateKLines;
exports.mergeTroughs = mergeTroughs;
exports.mergePeaks = mergePeaks;
exports.markPeaks = markPeaks;
exports.markTroughs = markTroughs;
//exports.average = average;
exports.exRightsDay = exRightsDay;