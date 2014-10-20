var klineutil = require("../klineutil");

var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 


var bullklineforms = require("./moneyflowforms");// require("./bullklineforms");
var bearklineforms = require("./bearklineforms");

var klineforms = undefined;

var formsSortMap = {};
function config(options){  
    if (options.bullorbear==="bear") {
        klineforms = bearklineforms;
    } else {
        klineforms = bullklineforms;
    }

    if (options.startDate) startDate = options.startDate;
    if (options.endDate) endDate = options.endDate;

    var forms = this.bullKLineFormMethods();
    for(var i=0; i<forms.length; i++) {
        formsSortMap[forms[i]] = i;
    }
    return this;
}

function traverseForIntersection(methods, klineJson) {
    var len = klineJson.length;
    var result = {total:0, win:0, lose:0, pending:0};
    
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;

                
        var arr = [];
        if (intersectionResult(bullklineforms, methods, klineJson, i)) {
           // console.log("traverseForIntersection", klineJson[i].date, methods)
            result.total++;
            if (klineJson[i].winOrLose=="win") result.win++;
            else if (klineJson[i].winOrLose=="lose") result.lose++;
            else result.pending++;
             
        }

    }

    return result;
}

function traverseForAppearance(methods, klineJson, intersections) {
    var len = klineJson.length;
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;
        
        var matchForms = [];
        methods.forEach(function(mtd) {
            if(klineforms[mtd](klineJson, i) === true
                ) {
                matchForms.push(mtd);
                if (intersections.formHandler) {
                    intersections.formHandler(mtd, klineJson, i);
                }

            }
        });

        if (intersections.formsHandler && matchForms.length>0) {
            intersections.formsHandler(matchForms, klineJson, i);
        }

    }
    
}

function tryForms(methods, klineJson, i) {
        var matchForms = [];
        methods.forEach(function(mtd) {
            if(klineforms[mtd](klineJson, i) === true) {
                matchForms.push(mtd);
            }
        });
        return matchForms;
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
                
                // '02/20/2013' '03/05/2013'
                if (showLog) console.log(options.stockId, klineJson[i].date);
                else if (showLogDates.indexOf(klineJson[i].date)>-1) console.log(options.stockId, klineJson[i].date, klineJson[i].winOrLose);
                
                // var inc_ave_8 = 0.48*klineJson[i].amplitude_ave_8;
                // if (!inc_ave_8) continue;

                // var winStop = Math.min(5*inc_ave_8, 0.15);
                // var lossStop = Math.max(-5*inc_ave_8, -0.15);

                // var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, 50/*, reObj*/);
                if (klineJson[i].winOrLose=="win"
                    //rel>=winStop
                    ) {

                    result.win++;

                }
                result.total++;
                
                if (options.injection) options.injection(options.stockId, klineJson, i, method);
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

function unionResult (_klineforms, methods, klineJson, idx) {
    if (!_klineforms) _klineforms = klineforms
    for (var i=0; i<methods.length; i++) {
        if (_klineforms[methods[i]](klineJson, idx)) {
            return true;
        }
    }
    return false;
}

// function _intersectionResult (klineforms, methods, klineJson, idx) {
//     var match = klineJson[idx].match;
//     if (!match || methods.length>match.length) return false;
//     var j=0;
//     for (var i=0; i<methods.length; i++) {
//         var mi = methods[i];
//         var contains = false;
//         if (formsSortMap[match[j]] > formsSortMap[mi]) {
//             return false;
//         }
//         for (; j<match.length; j++) {
//             if (match[j] === mi) {
//                 j++;
//                 contains = true;
//                 break;
//             }
//         }
//         if (!contains) return false;
//     }
//     return true;
// }

function intersectionResult (klineforms, methods, klineJson, idx) {
    for (var i=0; i<methods.length; i++) {
        if (!klineforms[methods[i]](klineJson, idx)) {
            return false;
        }
    }
    return true;
}

function selectedBullKLineFormMethods(arr) {
    var methods = bullKLineFormMethods();
    var re = []; 
    for (var i=0; i<arr.length; i++) {
        re.push(methods[arr[i]]);
    }
    return re;
}

function bullKLineFormMethods() {
    var methods = [];
    for (var attr in bullklineforms) {
        methods.push(attr);
    }

    return methods.sort();
}


function bearKLineFormMethods() {
    var methods = [];
    for (var attr in bearklineforms) {
        methods.push(attr);
    }

    return methods.sort();
}

function kLineFormMethods() {
    var methods = [];
    for (var attr in klineforms) {
        methods.push(attr);
    }

    return methods.sort();
}

exports.config = config;

exports.tryForms = tryForms;

exports.traverseForIntersection = traverseForIntersection;
exports.selectedBullKLineFormMethods = selectedBullKLineFormMethods;

exports.bullKLineFormMethods = bullKLineFormMethods;
exports.bearKLineFormMethods = bearKLineFormMethods;
exports.kLineFormMethods = kLineFormMethods;

exports.traverseForWinning = traverseForWinning;
exports.traverseForLosing = traverseForLosing;

exports.traverseForAppearance = traverseForAppearance;

exports.validateForm = validateForm;
exports.unionResult = unionResult;