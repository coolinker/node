var klineutil = require("../klineutil");
var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 


var bullklineforms = require("./bullklineforms");
var bearklineforms = require("./bearklineforms");
var moneyflowforms = require("./moneyflowforms");

var klineforms = undefined;

function traverseForIntersection(methods, klineJson, result) {
    var len = klineJson.length;
    var mthsStr = methods.toString();
    if (!result[mthsStr])  {
        result[mthsStr] = {total:0, win:0, lose:0, pending:0};
    }

    var mthsObj = result[mthsStr];

    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;

                
        var arr = [];
        var inc_ave_8 = klineJson[i].inc_ave_8;
        winStop = 3.7*inc_ave_8;
        lossStop = -3.7*inc_ave_8;

        if (intersectionResult(bullklineforms, methods, klineJson, i)) {
            var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, 100);
            mthsObj.total++;
            // if (klineJson[i].winOrLose=="win") mthsObj.win++;
            // else if (klineJson[i].winOrLose=="lose") mthsObj.lose++;
             if (rel>=winStop) mthsObj.win++;
            else if (rel<=lossStop) mthsObj.lose++;
            else  mthsObj.pending++;
        }


    }

}

function ___traverseForAppearance(methods, klineJson, options, incResult, formsResult) {
    var len = klineJson.length;
    var displayEveryCase = options.displayEveryCase;
    var displayInfoToDate = options.displayInfoToDate;
    var displayInfoFromDate = options.displayInfoFromDate;
    
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;

        var inc_ave_8 = klineJson[i].inc_ave_8;
        winStop = 3.7*inc_ave_8;
        lossStop = -3.7*inc_ave_8;

        //var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, 100);
        var date = klineJson[i].date;
        var mtdsNumber = 0;
        var matchForms = [];
        methods.forEach(function(mtd) {
            if(klineforms[mtd](klineJson, i) === true) {
                /*******************/
                //if (mtdsNumber>0) return;
                /******************/
                mtdsNumber ++;
                matchForms.push(mtd);
                
                if (incResult[mtd] === undefined) {
                    incResult[mtd] = [];
                }
                //incResult[mtd].push({date:date, inc:rel, win: rel>=winStop, lose: rel<=lossStop});
                incResult[mtd].push({date:date, inc:klineJson[i].incStop, win: klineJson[i].winOrLose=="win", lose: klineJson[i].winOrLose=="lose"});
                
                if (!displayEveryCase) return;

                var dObj = new Date(date);
                if (dObj >= displayInfoFromDate && dObj <= displayInfoToDate) {
                    console.log(date, options.stockId);
                }

            }
        });

        if (matchForms.length>0) {
            if (!formsResult[date]) {
                formsResult[date] = {};
            }

            formsResult[date][options.stockId] =  matchForms;
        }

    }
    
}


function traverseForAppearance(methods, klineJson, intersections) {
    var len = klineJson.length;
    for (var i=50; i<len; i++) {
        var date = new Date(klineJson[i].date);

        if (date < startDate) continue;
        if (date > endDate) break;

        var inc_ave_8 = klineJson[i].inc_ave_8;
        winStop = 3.7*inc_ave_8;
        lossStop = -3.7*inc_ave_8;

        var matchForms = [];
        methods.forEach(function(mtd) {
            if(klineforms[mtd](klineJson, i) === true) {
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
            && moneyflowforms[method] && moneyflowforms[method](klineJson, i)
            //intersectionResult(moneyflowforms, ["moneyFlowInOut"], klineJson, i)
            ) {
                // var amp = klineJson[i].amplitude_ave_8;
                // winStop = 1.25*amp;
                // lossStop = -1.25*amp;

                var inc_ave_8 = klineJson[i].inc_ave_8;
                winStop = 3.7*inc_ave_8;
                lossStop = -3.7*inc_ave_8;

                //var rel = klineutil.winOrLoss(klineJson, i, lossStop, winStop, daysStop);
                //var rel = klineJson[i].incStop;
               
                // '02/20/2013' '03/05/2013'
                if (showLog) console.log(options.stockId, klineJson[i].date);
                else if (showLogDates.indexOf(klineJson[i].date)>-1) console.log(options.stockId, klineJson[i].date, klineJson[i].winOrLose);
                
                /*if (klineJson[i].winOrLose=="win" && rel<winStop) {
                    console.log(klineJson[i].date, options.stockId, rel, lossStop, winStop)

                }*/

                if (klineJson[i].winOrLose=="win"/*rel>=winStop*/) {
                    result.win++;

                }
                result.total++;
                
                if (options.injection) options.injection(options.stockId, klineJson, i, method);
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

function matchMoneyFlowForm (klineJson, idx) {
    if (moneyflowforms.moneyFlowInOut(klineJson, idx)) {
        return ["moneyFlowInOut"];
    } else {
        return [];
    }
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

exports.tryForms = tryForms;

exports.matchMoneyFlowForm = matchMoneyFlowForm;
exports.traverseForIntersection = traverseForIntersection;
exports.selectedBullKLineFormMethods = selectedBullKLineFormMethods;

exports.bullKLineFormMethods = bullKLineFormMethods;
exports.bearKLineFormMethods = bearKLineFormMethods;
exports.kLineFormMethods = kLineFormMethods;

exports.traverseForWinning = traverseForWinning;
exports.traverseForLosing = traverseForLosing;

exports.traverseForAppearance = traverseForAppearance;

exports.validateForm = validateForm;