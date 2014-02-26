var klineutil = require("../klineutil");
var startDate = new Date("01/01/2005"); 
var endDate = new Date("01/01/2014"); 


var bullklineforms = require("./bullklineforms");
var bearklineforms = require("./bearklineforms");

var klineforms = undefined;

function traverseForAppearance(methods, klineJson, result, options) {
    var len = klineJson.length;
    var displayEveryCase = options.displayEveryCase;
    var displayInfoToDate = options.displayInfoToDate;
    var displayInfoFromDate = options.displayInfoFromDate;
    
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;

                
        var arr = [];
        
        var rel = klineutil.winOrLoss(klineJson, i, -0.05, 0.05, 100);
        methods.forEach(function(mtd) {
            if(klineforms[mtd](klineJson, i) === true) {
                var date = klineJson[i].date;
                if (result[mtd] === undefined) {
                    result[mtd] = [];
                }
                result[mtd].push({date:date, inc:rel});
                arr.push(mtd);

                if (!displayEveryCase) return;

                var dObj = new Date(date);
                if (dObj >= displayInfoFromDate && dObj <= displayInfoToDate) {
                    console.log(date, options.stockId);
                }

            }
        });

        if(false && arr.length>1) {
            //var rel = klineutil.winOrLoss(klineJson, i, -0.1, 0.05, 10);
            console.log(klineJson[i].date, arr, rel);
        }
    }

}

function traverseForWinning(method, klineJson, lossStop, winStop, daysStop, options) {
    var result = {total:0, win:0};
    var len = klineJson.length;
    var showLog = options.showLog;
    var showLogDates = options.showLogDates
    
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);
        if (date < startDate) continue;
        if (date > endDate) break;
        
        if (options.passAll || 
            (bullklineforms[method](klineJson, i) || (options.union && unionResult(bullklineforms, options.union.split(","), klineJson, i))) 
            && (!options.intersection|| intersectionResult(bullklineforms, options.intersection.split(","), klineJson, i))
            ) {
                // var amp = klineJson[i].amplitude_ave_8;
                // winStop = 1.25*amp;
                // lossStop = -1.25*amp;

                var inc_ave_8 = klineJson[i].inc_ave_8;
                winStop = 3.7*inc_ave_8;
                lossStop = -3.7*inc_ave_8;

                var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, daysStop);
                
                //console.log();
                // '02/20/2013' '03/05/2013'
                if (showLog) console.log(options.stockId, klineJson[i].date, rel);
                else if (showLogDates.indexOf(klineJson[i].date)>-1) console.log(options.stockId, klineJson[i].date, rel);
                
                if (rel>=winStop) {
                    result.win++;

                }
                result.total++;
                
                if (options.injection) options.injection(method, options.stockId, date, rel>=winStop);
                // if (dateSections !== undefined) {
                //     var sec = getDateSection(date, dateSections);
                //     result['total_'+sec]++;
                    
                //     if (rel>winStop) {
                //         result['win_'+sec]++;
                //     }

                // }
            }

    }
    return result;
}

function traverseForLosing(method, klineJson, lossStop, winStop, daysStop, options) {
    var result = {total:0, lost:0};
    var len = klineJson.length;
    var showLog = options.showLog;
    var showLogDates = options.showLogDates

    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);
        if (date < startDate) continue;
        if (date > endDate) break;

        if (options.passAll || 
            (bearklineforms[method](klineJson, i) 
            || (options.union && unionResult(bearklineforms, options.union.split(","), klineJson, i))) 
            && (!options.intersection|| intersectionResult(bearklineforms, options.intersection.split(","), klineJson, i))
            ) {
                

                var inc_ave_8 = klineJson[i].inc_ave_8;
                winStop = 1.3*inc_ave_8;
                lossStop = -1.3*inc_ave_8;

                var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, daysStop);
                if (showLog) console.log(options.stockId, klineJson[i].date, rel);
                else if (showLogDates.indexOf(klineJson[i].date)>-1) console.log(options.stockId, klineJson[i].date, rel);

                if (rel<=lossStop) {
                    result.lost++;
                }
                result.total++;
                
                if (options.injection) options.injection(method, options.stockId, date, rel<=lossStop);
            }

    }
    return result;
}

function validateForm(formMethod, klineJson) {
    var result = {total:0, valid: 0}
    var len = klineJson.length;
    var mtds = kLineFormMethods();
    var mtdsidx = mtds.indexOf(formMethod);
    mtds.splice(mtdsidx,1);
    for (var i=50; i<len; i++) {
        if (klineforms[formMethod](klineJson, i)) {
            result.total++;
            if(!unionResult(klineforms, mtds, klineJson, i)) {
                result.valid++;
            }
        }
    }
    return result;
}

function unionResult (klineforms, methods, klineJson, idx) {
    for (var i=0; i<methods.length; i++) {
        if (klineforms[methods[i]](klineJson, idx)) {
            return true;
        }
    }
    return false;
}

function intersectionResult (klineforms, methods, klineJson, idx) {
    for (var i=0; i<methods.length; i++) {
        if (!klineforms[methods[i]](klineJson, idx)) {
            return false;
        }
    }
    return true;
}

function bullKLineFormMethods() {
    var methods = [];
    for (var attr in bullklineforms) {
        methods.push(attr);
    }

    return methods;
}

function bearKLineFormMethods() {
    var methods = [];
    for (var attr in bearklineforms) {
        methods.push(attr);
    }

    return methods;
}

function kLineFormMethods() {
    var methods = [];
    for (var attr in klineforms) {
        methods.push(attr);
    }

    return methods;
}

function config(options){  
    if (options.bullorbear==="bear") {
        klineforms = bearklineforms;
    } else {
        klineforms = bullklineforms;
    }

    if (options.startDate) startDate = options.startDate;
    if (options.endDate) endDate = options.endDate;

    return this;
}

exports.config = config;

exports.bullKLineFormMethods = bullKLineFormMethods;
exports.bearKLineFormMethods = bearKLineFormMethods;
exports.kLineFormMethods = kLineFormMethods;

exports.traverseForWinning = traverseForWinning;
exports.traverseForLosing = traverseForLosing;

exports.traverseForAppearance = traverseForAppearance;

exports.validateForm = validateForm;