var moneyflowforms = require("./moneyflowforms");
var klineutil = require("../klineutil");

function trueFalse(key, bool, keyObj) {
    if (!keyObj[key]) keyObj[key] = {
        "_true": 0,
        "_false": 0
    };
    bool ? keyObj[key]._true++ : keyObj[key]._false++;
}

function _trueFalse(key, fun, keyObj) {
    if (!keyObj[key]) keyObj[key] = {
        "_true": 0,
        "_false": 0
    };
    eval(key) ? keyObj[key]._true++ : keyObj[key]._false++;
}

function conditions(klineJson, idx, conditionObj, stockId) {
    flatBottom(klineJson, idx, conditionObj, stockId);
    // moneyFlow(klineJson, idx, conditionObj, stockId);
    // rk(klineJson, idx, conditionObj, stockId);
}

function flatBottom(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    var fun = function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > 0.14//inc_ave*d 
            && higherItems.length<e;
    
    }

    // _trueFalse("fun(1, 35, 11, 6, 7)", fun, keyObj);
    // _trueFalse("fun(1, 33, 11, 6, 7)", fun, keyObj);
    // _trueFalse("fun(1, 35, 12, 6, 7)", fun, keyObj);
    // _trueFalse("fun(1, 35, 10, 6, 7)", fun, keyObj);
    // _trueFalse("fun(1, 35, 11, 7, 7)", fun, keyObj);
    // _trueFalse("fun(1, 35, 11, 5, 7)", fun, keyObj);
    // return
 


    _trueFalse("fun(1, 45, 20, 6, 7)", fun, keyObj);
    _trueFalse("fun(1, 45, 20, 4, 7)", fun, keyObj);
    _trueFalse("fun(1, 45, 20, 6, 10)", fun, keyObj);
    _trueFalse("fun(1, 45, 15, 6, 7)", fun, keyObj);
    _trueFalse("fun(1, 40, 13, 6, 7)", fun, keyObj);
    _trueFalse("fun(1, 35, 11, 6, 7)", fun, keyObj);
     _trueFalse("fun(1, 70, 20, 13, 7)", fun, keyObj);
     _trueFalse("fun(1, 70, 20, 8, 7)", fun, keyObj);

     _trueFalse("fun(1, 70, 20, 16, 15)", fun, keyObj);
     _trueFalse("fun(1, 70, 20, 16, 12)", fun, keyObj);
     _trueFalse("fun(1, 70, 20, 16, 10)", fun, keyObj);

}

function hammerA(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;
    
    var fun = function(a, b, c, d) {

        var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
        var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
        var entity = Math.abs(klineJson[i].close - klineJson[i].open);
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
        
        return higherItems.length<c
                    && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * 0.015 *2
        
    }
    
    _trueFalse("fun(48, 14, 10, 4)", fun, keyObj);
    _trueFalse("fun(48, 14, 10, 4.5)", fun, keyObj);
    _trueFalse("fun(48, 14, 10, 3.5)", fun, keyObj);
     _trueFalse("fun(45, 14, 10, 4)", fun, keyObj);
    _trueFalse("fun(45, 14, 10, 4.5)", fun, keyObj);
    _trueFalse("fun(45, 14, 10, 3.5)", fun, keyObj);
    // trueFalse("fun(60, 15, 8, 9)", fun(60, 15, 8, 9 * klineJson[i].inc_ave_21), keyObj);
    // trueFalse("fun(60, 15, 8, 8)", fun(60, 15, 8, 8 * klineJson[i].inc_ave_21), keyObj);
    // trueFalse("fun(60, 15, 8, 10)", fun(60, 15, 8, 10 * klineJson[i].inc_ave_21), keyObj);
    // trueFalse("fun(60, 15, 8, 3*amp)", fun(60, 15, 8, 3 * klineJson[i].amplitude_ave_21), keyObj);
    // trueFalse("fun(60, 15, 8, 4*amp)", fun(60, 15, 8, 4 * klineJson[i].amplitude_ave_21), keyObj);
}


function reversedHammerB(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
    var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
    var entity = Math.abs(klineJson[i].close - klineJson[i].open);
    var inc_ave = klineJson[i].inc_ave_8;

    trueFalse("Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.05",
        Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.05, keyObj);
        trueFalse("Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.03",
        Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.03, keyObj);

    trueFalse("Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.07",
        Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low<0.07, keyObj);

    trueFalse("klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open)<klineJson[i].close*inc_ave*1.5",
        klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open)<klineJson[i].close*inc_ave*1.5, keyObj);
return
    var fun = function(a, b, c, d, e) {
                var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
                var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
                return true
                    && higherItems.length>c 
                    && higherItems.length<d
                    && klineutil.increase(klineJson[i].high, klineJson[hidx].close) > e
            }

      trueFalse("fun(60, 20, 0, 15, 4*klineJson[i].amplitude_ave_8)", fun(60, 20, 0, 15, 4*klineJson[i].amplitude_ave_8), keyObj);
      trueFalse("fun(65, 20, 0, 15, 4*klineJson[i].amplitude_ave_8)", fun(65, 20, 0, 15, 4*klineJson[i].amplitude_ave_8), keyObj);

        trueFalse("fun(55, 20, 0, 15, 4*klineJson[i].amplitude_ave_8)", fun(55, 20, 0, 15, 4*klineJson[i].amplitude_ave_8), keyObj);

    // trueFalse("fun(55, 12, 1, 4, 0.6*klineJson[i].inc_ave_8)", fun(55, 12, 1, 4, 0.6*klineJson[i].inc_ave_8), keyObj);
    // trueFalse("fun(55, 12, 1, 5, 0.6*klineJson[i].inc_ave_8)", fun(55, 12, 1, 5, 0.6*klineJson[i].inc_ave_8), keyObj);
    // trueFalse("fun(55, 12, 1, 6, 0.6*klineJson[i].inc_ave_8)", fun(55, 12, 1, 6, 0.6*klineJson[i].inc_ave_8), keyObj);
   
    // trueFalse("fun(55, 15, 1, 5, 0.6*klineJson[i].inc_ave_8)", fun(55, 15, 1, 5, 0.6*klineJson[i].inc_ave_8), keyObj);
    // trueFalse("fun(55, 12, 1, 5, 0.6*klineJson[i].inc_ave_8)", fun(55, 12, 1, 5, 0.6*klineJson[i].inc_ave_8), keyObj);
    // trueFalse("fun(55, 18, 1, 5, 0.6*klineJson[i].inc_ave_8)", fun(55, 18, 1, 5, 0.6*klineJson[i].inc_ave_8), keyObj);
}

function wBottomA(klineJson, idx, conditionObj, stockId) {
    var obj = klineJson[idx];
    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>2",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 2, keyObj);

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>1.2",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 1.2, keyObj);
    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>1",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 1, keyObj);
    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>0.8",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 0.8, keyObj);
trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>-0.5",
        klineutil.increase(obj.amount_ave_8, obj.amount) > -0.5, keyObj);

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>0",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 0, keyObj);

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, idx);
    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
    
    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.05*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.05 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.1*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.1 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.15*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.15 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.2*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.2 * klineJson[idx].amplitude_ave_21, keyObj);
   //return
    var fun = function(m, n) {
        var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
        return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
    }

    trueFalse("fun(20, 5)", fun(20,5), keyObj);
    trueFalse("fun(20, 5.5)", fun(20,5.5), keyObj);
    trueFalse("fun(20, 6)", fun(20,6), keyObj);
    trueFalse("fun(25, 5)", fun(25,5), keyObj);
    trueFalse("fun(25, 5.5)", fun(25,5.5), keyObj);
    trueFalse("fun(25, 6)", fun(25,6), keyObj);

    trueFalse("fun(30, 5)", fun(30,5), keyObj);
    trueFalse("fun(30, 5.5)", fun(30,5.5), keyObj);
    trueFalse("fun(30, 6)", fun(30,6), keyObj);

    return
    var fun = function(m, n) {
        var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
        return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
    }

    trueFalse("fun(35, 0.28)", fun(35,0.28), keyObj);
    trueFalse("fun(35, 0.3)", fun(35,0.3), keyObj);
    trueFalse("fun(35, 0.32)", fun(35,0.32), keyObj);
    trueFalse("fun(25, 0.25)", fun(25,0.25), keyObj);
    trueFalse("fun(25, 0.3)", fun(25,0.3), keyObj);
    trueFalse("fun(25, 0.35)", fun(25,0.35), keyObj);

    trueFalse("fun(30, 0.32)", fun(30,0.32), keyObj);
    trueFalse("fun(30, 0.28)", fun(30,0.28), keyObj);
    trueFalse("fun(30, 0.3)", fun(30,0.3), keyObj);
    // trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.1",
    //     klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.1, keyObj);
    // trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.15",
    //     klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.15, keyObj);
    // trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.25",
    //     klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.25, keyObj);

}

function wBottom(klineJson, idx, conditionObj, stockId) {
    var obj = klineJson[idx];
    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;


    trueFalse("<<<<klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>-0.07",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > -0.07, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>-0.06",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > -0.06, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>-0.05",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > -0.05, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>-0.03",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > -0.03, keyObj);

    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.0",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > 0.0, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.05",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > 0.05, keyObj);

    trueFalse("klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close)<0.035",
        klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close) < 0.035, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close)<0.055",
        klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close) < 0.055, keyObj);


return true

    // var fun = function(m, n, p1, p2) {
    //     var rightBottomIdx = klineutil.lowItemIndex(klineJson, idx - n, idx, "low");
    //     var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
    //     var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
    //     var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
    //     return klineutil.increase(klineJson[midTopIdx].high, klineJson[idx].close) > p1
    //         && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    // }

    // trueFalse("fun(30,5, -0.4, 0.25)", fun(30,5, -0.4, 0.25), keyObj);
    // trueFalse("fun(30,5, -0.3, 0.25)", fun(30,5, -0.3, 0.25), keyObj);
    // trueFalse("fun(30,5, -1.15, 0.25)", fun(30,5, -1.15, 0.25), keyObj);
    // trueFalse("fun(30,5, -0.35, 0.25)", fun(30,5, -0.35, 0.25), keyObj);
    // trueFalse("fun(30,5, -0.5, 0.2)", fun(30,5, -0.5, 0.2), keyObj);

    var fun = function(m, n, p1) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, idx - n, idx, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p1*klineJson[midTopIdx].amplitude_ave_21
    }

    trueFalse("fun(30,5, 5)", fun(30,5, 5), keyObj);
    trueFalse("fun(30,5, 7)", fun(30,5, 7), keyObj);
    trueFalse("fun(30,8, 4)", fun(30,8, 4), keyObj);
    trueFalse("fun(30,8, 5)", fun(30,8, 5), keyObj);
    trueFalse("fun(30,8, 6)", fun(30,8, 6), keyObj);
    trueFalse("fun(30,8, 8)", fun(30,8, 8), keyObj);

}

function headShoulderBottom(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

    var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
    

    var fun = function(a, b, c, n) {
        var outerHigh = klineutil.highItem(klineJson, leftBottom - n, leftBottom, "low");
        return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) > a*obj.amplitude_ave_8//<= a*obj.amplitude_ave_8
            && klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > b * obj.amplitude_ave_8
            && klineutil.increase(klineJson[leftTop].high, outerHigh) > c * obj.amplitude_ave_8
    }
    
    trueFalse("fun(0.1,-0.2, 4, 30)", fun(0.1,-110.2, 4, 30), keyObj);
    trueFalse("fun(0.1,-0.2, 5, 30)", fun(0.1,-110.2, 5, 30), keyObj);
    trueFalse("fun(0.5,-0.2, 5, 30)", fun(0.5,-110.2, 5, 30), keyObj);
    trueFalse("fun(1,-0.2, 5, 30)", fun(1,-110.2, 5, 30), keyObj);
    trueFalse("fun(-0.1,-0.2, 5, 30)", fun(-0.1,-110.2, 5, 30), keyObj);
return;
     trueFalse("klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low)<=1*obj.amplitude_ave_8",
        klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= 1*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low)<=0.8*obj.amplitude_ave_8",
        klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= 0.8*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low)<=0.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= 0.5*obj.amplitude_ave_8, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-0.2*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > -0.2 * obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-0.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > -0.5 * obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-0*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > -0 * obj.amplitude_ave_8, keyObj);

    trueFalse("klineutil.increase(klineJson[leftTop].high, outerHigh)>3*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftTop].high, outerHigh) > 3 * obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[leftTop].high, outerHigh)>2.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftTop].high, outerHigh) > 2.5 * obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[leftTop].high, outerHigh)>5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[leftTop].high, outerHigh) > 5 * obj.amplitude_ave_8, keyObj);
}

function morningStarA(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.5*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.3*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.3*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.7*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i-2].open, klineJson[i-2].close)<-0.7*obj.amplitude_ave_8, keyObj);

    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)>0.7*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i].open, klineJson[i].close)>0.7*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)>0.5*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i].open, klineJson[i].close)>0.5*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)>0.3*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i].open, klineJson[i].close)>0.3*obj.amplitude_ave_8, keyObj);


    trueFalse("klineutil.increase(klineJson[i-2].close, klineJson[i-1].open)<0.05*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i-2].close, klineJson[i-1].open)<0.05*obj.amplitude_ave_8, keyObj);
     trueFalse("klineutil.increase(klineJson[i-2].close, klineJson[i-1].open)<0.1*obj.amplitude_ave_8",
            klineutil.increase(klineJson[i-2].close, klineJson[i-1].open)<0.1*obj.amplitude_ave_8, keyObj);

    trueFalse("klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.5",
            klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.5, keyObj);
    trueFalse("klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.2",
            klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.2, keyObj);
    trueFalse("klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.8",
            klineutil.increase(klineJson[i].volume_ave_8, klineJson[i].volume)<0.8, keyObj);

return;
    var checkLowers = function (m, n, k){
            var lower = klineutil.lowerItemsIndex(klineJson, i-k, i-3, "close", klineJson[i].close);
             return i - lower[0]>m && i - lower[0] < n
        }

    trueFalse("checkLowers(6,20, 35)", checkLowers(6,20, 35), keyObj);
    trueFalse("checkLowers(9,20, 35)", checkLowers(9,20, 35), keyObj);
    trueFalse("checkLowers(12,20, 35)", checkLowers(12,20, 35), keyObj);


    trueFalse("checkLowers(9,23, 35)", checkLowers(9,23, 35), keyObj);
    trueFalse("checkLowers(9,23, 45)", checkLowers(9,23, 45), keyObj);
    trueFalse("checkLowers(9,23, 40)", checkLowers(9,23, 40), keyObj);
    return;
}

function morningStarB(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;
    
    var fun = function(m, n, k){
        var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
        var lower = klineutil.lowerItemsIndex(klineJson, i-m, i-2, "low", klineJson[i-2].high);

        return true//klineutil.increase(midhigh, klineJson[i-2].close) > -klineJson[i].inc_ave_8*n
            && lower.length<k
    }

    trueFalse("fun(60,0.0, 12)", fun(60,0.0, 12), keyObj);
    trueFalse("fun(70,0.0, 12)", fun(70,0.0, 12), keyObj);
    trueFalse("fun(75,0.0, 12)", fun(75,-0.0, 12), keyObj);
    trueFalse("fun(70,0.0, 10)", fun(70,0, 10), keyObj);
}

function sidewaysCompression (klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;    

     trueFalse("klineJson[i].volume < 0.6 *klineJson[i].volume_ave_8",
        klineJson[i].volume < 0.6 *klineJson[i].volume_ave_8, keyObj);
     trueFalse("klineJson[i].volume < 0.4 *klineJson[i].volume_ave_8",
        klineJson[i].volume < 0.4 *klineJson[i].volume_ave_8, keyObj);
     trueFalse("klineJson[i].volume < 0.8 *klineJson[i].volume_ave_8",
        klineJson[i].volume < 0.8 *klineJson[i].volume_ave_8, keyObj);
    trueFalse("klineJson[i].volume < 1 *klineJson[i].volume_ave_8",
        klineJson[i].volume < 1 *klineJson[i].volume_ave_8, keyObj);
    trueFalse("klineJson[i].volume < 1.2 *klineJson[i].volume_ave_8",
        klineJson[i].volume < 1.2 *klineJson[i].volume_ave_8, keyObj);

return 
    var fun = function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl>k*downhl;;
    };

    trueFalse("fun(30, 40, 0.5)",fun(30, 40, 0.5), keyObj);
     trueFalse("fun(30, 40, 0.4)",fun(30, 40, 0.4), keyObj);
      trueFalse("fun(30, 40, 0.6)",fun(30, 40, 0.6), keyObj);

      // trueFalse("fun(30, 35, 0.5)",fun(30, 35, 0.5), keyObj);
      //   trueFalse("fun(30, 45, 0.5)",fun(30, 45, 0.5), keyObj);

      //   trueFalse("fun(35, 40, 0.5)",fun(35, 40, 0.5), keyObj);
      //   trueFalse("fun(25, 40, 0.5)",fun(25, 40, 0.5), keyObj);

    // trueFalse("fun(30, 35, 0.5)",fun(30, 35, 0.5), keyObj);
    // trueFalse("fun(25, 40, 0.5)",fun(25, 40, 0.5), keyObj);
    // trueFalse("fun(25, 35, 0.5)",fun(25, 35, 0.5), keyObj);

}


function redNGreenRed (klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;    

    var fun = function(a, b, c, d, e){
        var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
        
        if (klineutil.increase(klineJson[top].high, obj.close) > -obj.amplitude_ave_8 * a //-inc_ave*3.5 
            && klineutil.increase(klineJson[top].high, obj.close) <  obj.amplitude_ave_8*b) {
            var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
            return lowerItems.length >d && lowerItems.length <e;
        }
         return false;
    }

    //trueFalse("fun(1, 0.7, 120, 6, 20)", fun(1, 0.7, 120, 6, 20), keyObj);
    //trueFalse("fun(1.5, 0.7, 120, 6, 20)", fun(1.5, 0.7, 120, 6, 20), keyObj);
    
    trueFalse("fun(2, 1, 120, 6, 15)", fun(2, 1, 120, 6, 18), keyObj);
    trueFalse("fun(2, 1, 120, 6, 20)", fun(2, 1, 120, 6, 20), keyObj);
    trueFalse("fun(2, 1, 120, 6, 25)", fun(2, 1, 120, 6, 22), keyObj);
}

function greenInRedA(klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;    

    trueFalse("klineutil.increase(klineJson[i-1].open, klineJson[i-1].close)>-0.0", 
        klineutil.increase(klineJson[i-1].open, klineJson[i-1].close)>-0.0, keyObj);


    trueFalse("klineutil.increase(klineJson[i-1].amont, klineJson[i].amont)<-0.2", 
        klineutil.increase(klineJson[i-1].amount, klineJson[i].amount) < -0.2, keyObj);
    trueFalse("klineutil.increase(klineJson[i-1].amont, klineJson[i].amont)<-0", 
        klineutil.increase(klineJson[i-1].amount, klineJson[i].amount) < -0, keyObj);
    trueFalse("klineutil.increase(klineJson[i-1].amont, klineJson[i].amont)<0.2", 
        klineutil.increase(klineJson[i-1].amount, klineJson[i].amount) < 0.2, keyObj);


    //  var fun = function(a, b, c, d, e){
    //             var lowerItems = klineutil.lowerItemsIndex(klineJson, i-a, i, "close", klineJson[i].low);
    //             return  klineutil.increase(klineJson[i].open, klineJson[i].close) > d
    //                 && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < e
    //                 && lowerItems.length > b && lowerItems.length < c;
    //         }

    // trueFalse("fun(100, 0, 35, 0.015, 0)", fun(100, 0, 35, 0.015, 0), keyObj);
    // trueFalse("fun(120, 0, 40, 0.015, 0)", fun(120, 0, 40, 0.015, 0), keyObj);
    // trueFalse("fun(120, 0, 40, 0.013, 0)", fun(120, 0, 40, 0.013, 0), keyObj);
    // trueFalse("fun(150, 45, 0.015, 0)", fun(150, 0, 45, 0.015, 0), keyObj);

    
                return 

    var fun = function(a, b, c, d){

        return klineutil.increase(klineJson[i].open, klineJson[i].close) > a*klineJson[i].inc_ave_8 //0.028
            && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < b//-0.0
            && klineutil.increase(klineJson[i-1].close, klineJson[i].open) < c*klineJson[i].inc_ave_8 // 0.02
             && klineutil.increase(klineJson[i-1].open-klineJson[i-1].close, klineJson[i].close-klineJson[i].open) < d //* 15* klineJson[i].inc_ave_8//0.6
    }

    trueFalse("fun(1, -0.0, 0.02, 0.6)", fun(1, -0.0, 0.02, 0.6), keyObj);
}


function rk(klineJson, idx, conditionObj, stockId) {
    
    var obj = klineJson[idx];

    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>-0.015", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>-0.015, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>-0.01", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>-0.01, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.0", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.0, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.01", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.01, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.015", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.015, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.02", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.02, keyObj);

    trueFalse("<<<<klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.5*obj.amplitude_ave_8", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.5*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.7*obj.amplitude_ave_8", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.7*obj.amplitude_ave_8, keyObj);
    trueFalse("<<<<klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.9*obj.amplitude_ave_8", 
        klineutil.increase(klineJson[idx].open, klineJson[idx].close)>0.9*obj.amplitude_ave_8, keyObj);

    trueFalse("<<<<obj.close_ave_8<1.05*obj.close", obj.close_ave_8<1.05*obj.close, keyObj);
    trueFalse("obj.close_ave_8<1.03*obj.close", obj.close_ave_8<1.03*obj.close, keyObj);
    trueFalse("obj.close_ave_8<1.02*obj.close", obj.close_ave_8<1.02*obj.close, keyObj);
    trueFalse("obj.close_ave_8<1*obj.close", obj.close_ave_8<1*obj.close, keyObj);
    trueFalse("<<<<obj.close_ave_8<0.98*obj.close", obj.close_ave_8<0.98*obj.close, keyObj);

    trueFalse("<<<<obj.amount_ave_8<0.5*obj.amount", obj.amount_ave_8<0.5*obj.amount, keyObj);
    trueFalse("obj.amount_ave_8<1.1*obj.amount", obj.amount_ave_8<1.1*obj.amount, keyObj);
    trueFalse("obj.amount_ave_8<1*obj.amount", obj.amount_ave_8<1*obj.amount, keyObj);
    trueFalse("obj.amount_ave_8<0.9*obj.amount", obj.amount_ave_8<0.9*obj.amount, keyObj);
    trueFalse("<<<<obj.amount_ave_8<1.5*obj.amount", obj.amount_ave_8<1.5*obj.amount, keyObj);

    trueFalse("<<<<obj.amount_ave_21<0.5*obj.amount", obj.amount_ave_21<0.5*obj.amount, keyObj);
    trueFalse("obj.amount_ave_21<1*obj.amount", obj.amount_ave_21<1*obj.amount, keyObj);
    trueFalse("<<<<obj.amount_ave_21<1.5*obj.amount", obj.amount_ave_21<1.5*obj.amount, keyObj);

    trueFalse("<<<<obj.amount_ave_21<0.5*obj.amount_ave_8", obj.amount_ave_21<0.5*obj.amount_ave_8, keyObj);
    trueFalse("obj.amount_ave_21<1*obj.amount_ave_8", obj.amount_ave_21<1*obj.amount_ave_8, keyObj);
    trueFalse("<<<<obj.amount_ave_21<1.5*obj.amount_ave_8", obj.amount_ave_21<1.5*obj.amount_ave_8, keyObj);



}

function moneyFlow(klineJson, idx, conditionObj, stockId) {
    
    var obj = klineJson[idx];

    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("<<<<obj.netsummax_r0_r0x_duration>40", obj.netsummax_r0_r0x_duration > 40, keyObj);
    trueFalse("obj.netsummax_r0_r0x_duration>35", obj.netsummax_r0_r0x_duration > 35, keyObj);
    trueFalse("obj.netsummax_r0_r0x_duration>25", obj.netsummax_r0_r0x_duration > 25, keyObj);
    trueFalse("obj.netsummax_r0_r0x_duration>20", obj.netsummax_r0_r0x_duration > 20, keyObj);
    trueFalse("obj.netsummax_r0_r0x_duration>15", obj.netsummax_r0_r0x_duration > 15, keyObj);
    trueFalse("<<<<obj.netsummax_r0_r0x_duration>10", obj.netsummax_r0_r0x_duration > 10, keyObj);

    trueFalse("obj.netsummax_r0_duration>30", obj.netsummax_r0_duration > 30, keyObj);
    trueFalse("obj.netsummax_r0_duration>40", obj.netsummax_r0_duration > 40, keyObj);
    trueFalse("<<<<obj.netsummax_r0_duration>20", obj.netsummax_r0_duration > 20, keyObj);
    trueFalse("obj.netsummax_r0_duration>60", obj.netsummax_r0_duration > 60, keyObj);
    trueFalse("<<<<obj.netsummax_r0_duration>80", obj.netsummax_r0_duration > 80, keyObj);

    trueFalse("<<<<obj.netsummax_r0_r0x>0.5*obj.amount_ave_21",
        obj.netsummax_r0_r0x > 0.5 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_r0x>2*obj.amount_ave_21",
        obj.netsummax_r0_r0x > 2 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_r0x>5*obj.amount_ave_21",
        obj.netsummax_r0_r0x > 5 * obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0>1.5*obj.amount_ave_21",
        obj.netsummax_r0 > 1.5 * obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0>1.8*obj.amount_ave_21",
        obj.netsummax_r0 > 1.8 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0>2.2*obj.amount_ave_21",
        obj.netsummax_r0 > 2.2 * obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0>2*obj.amount_ave_21",
        obj.netsummax_r0 > 2 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0>2.5*obj.amount_ave_21",
        obj.netsummax_r0 > 2.5 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0>2.3*obj.amount_ave_21",
        obj.netsummax_r0 > 2.3 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0>2.7*obj.amount_ave_21",
        obj.netsummax_r0 > 2.7 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0>obj.amount_ave_21",
        obj.netsummax_r0 > 1.0 * obj.amount_ave_21, keyObj);


    trueFalse("<<<<obj.netsummax_r0_netsum_r0x<0.5*obj.amount_ave_21",
        obj.netsummax_r0_netsum_r0x < 0.5 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_netsum_r0x<0",
        obj.netsummax_r0_netsum_r0x < 0, keyObj);
    trueFalse("obj.netsummax_r0_netsum_r0x<-0.3*obj.amount_ave_21",
        obj.netsummax_r0_netsum_r0x < -0.3 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_netsum_r0x<-0.5*obj.amount_ave_21",
        obj.netsummax_r0_netsum_r0x < -0.5 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_netsum_r0x<-0.8*obj.amount_ave_21",
        obj.netsummax_r0_netsum_r0x < -0.8 * obj.amount_ave_21, keyObj);



    trueFalse("<<<<obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0",
        obj.netsummax_r0 + obj.netsummax_r0_netsum_r0x > 0, keyObj);
    trueFalse("obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0.05*obj.amount_ave_21",
        obj.netsummax_r0 + obj.netsummax_r0_netsum_r0x > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>obj.amount_ave_21",
        obj.netsummax_r0 + obj.netsummax_r0_netsum_r0x > obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0_5>0.05*obj.amount_ave_21", obj.netsummax_r0_5 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_5>0.03*obj.amount_ave_21", obj.netsummax_r0_5 > 0.02 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_5===0.0*obj.amount_ave_21", obj.netsummax_r0_5 === 0.0 * obj.amount_ave_21, keyObj);
    

    trueFalse("obj.netsummax_r0_10>0.05*obj.amount_ave_21", obj.netsummax_r0_10 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_10>0.1*obj.amount_ave_21", obj.netsummax_r0_10 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_10===-0.0*obj.amount_ave_21", obj.netsummax_r0_10 === -0.0 * obj.amount_ave_21, keyObj);


    trueFalse("<<<<obj.netsummax_r0_20>0.1*obj.amount_ave_21", obj.netsummax_r0_20 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_20>0.3*obj.amount_ave_21", obj.netsummax_r0_20 > 0.3 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_20>0.5*obj.amount_ave_21", obj.netsummax_r0_20 > 0.5 * obj.amount_ave_21, keyObj);
    //trueFalse("obj.netsummax_r0_20>0.15*obj.amount_ave_21", obj.netsummax_r0_20>0.15*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0_40===0.0*obj.amount_ave_21", obj.netsummax_r0_40 === 0.0 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_40>0.01*obj.amount_ave_21", obj.netsummax_r0_40 > 0.01 * obj.amount_ave_21, keyObj);
    trueFalse(" obj.netsummax_r0_40>0.02*obj.amount_ave_21", obj.netsummax_r0_40 > 0.02 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_40>0.03*obj.amount_ave_21", obj.netsummax_r0_40 > 0.03 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_40>0.1*obj.amount_ave_21", obj.netsummax_r0_40 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_40>0.15*obj.amount_ave_21", obj.netsummax_r0_40 > 0.15 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummin_r0<-0.1*obj.amount_ave_21", obj.netsummin_r0 < -0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0_5<-0.05*obj.amount_ave_21", obj.netsummin_r0_5 < -0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0_10<-0.05*obj.amount_ave_21", obj.netsummin_r0_10 < -0.05 * obj.amount_ave_21, keyObj);


    trueFalse("<<<<obj.netsummin_r0_20<-0.2*obj.amount_ave_21", obj.netsummin_r0_20 < -0.2 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_20<-0.1*obj.amount_ave_21", obj.netsummin_r0_20 < -0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_20<-0*obj.amount_ave_21", obj.netsummin_r0_20 < -0 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_20===-0*obj.amount_ave_21", obj.netsummin_r0_20 === -0 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0_20<0.1*obj.amount_ave_21", obj.netsummin_r0_20 < 0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummin_r0_40<-0.2*obj.amount_ave_21", obj.netsummin_r0_40 < -0.2 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40<-0.15*obj.amount_ave_21", obj.netsummin_r0_40 < -0.15 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40<-0.1*obj.amount_ave_21", obj.netsummin_r0_40 < -0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40<-0*obj.amount_ave_21", obj.netsummin_r0_40 < -0 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40<-0.05*obj.amount_ave_21", obj.netsummin_r0_40 < -0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0_40<0.1*obj.amount_ave_21", obj.netsummin_r0_40 < 0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_5>0.05*obj.amount_ave_21", obj.netsummax_r0x_5 > 0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_10>0.0*obj.amount_ave_21", obj.netsummax_r0x_10 > 0.0 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_10>0.1*obj.amount_ave_21", obj.netsummax_r0x_10 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_10>0.2*obj.amount_ave_21", obj.netsummax_r0x_10 > 0.2 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_10>0.25*obj.amount_ave_21", obj.netsummax_r0x_10 > 0.25 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0x_10>0.3*obj.amount_ave_21", obj.netsummax_r0x_10 > 0.3 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_20>0.05*obj.amount_ave_21", obj.netsummax_r0x_20 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_20>0.1*obj.amount_ave_21", obj.netsummax_r0x_20 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_20>0.15*obj.amount_ave_21", obj.netsummax_r0x_20 > 0.15 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0x_20>0.20*obj.amount_ave_21", obj.netsummax_r0x_20 > 0.20 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_40>0.1*obj.amount_ave_21", obj.netsummax_r0x_40 > 0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummin_r0x<-0.3*obj.amount_ave_21", obj.netsummin_r0x < -0.3 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_5<-0.05*obj.amount_ave_21", obj.netsummin_r0x_5 < -0.05 * obj.amount_ave_21, keyObj);
    
    trueFalse("obj.netsummin_r0x_10<-0.05*obj.amount_ave_21", obj.netsummin_r0x_10 < -0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_10<-0.02*obj.amount_ave_21", obj.netsummin_r0x_10 < -0.02 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_10<-0.08*obj.amount_ave_21", obj.netsummin_r0x_10 < -0.08 * obj.amount_ave_21, keyObj);
    
    trueFalse("<<<<obj.netsummin_r0x_20<-0.1*obj.amount_ave_21", obj.netsummin_r0x_20 < -0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_40<-0.2*obj.amount_ave_21", obj.netsummin_r0x_40 < -0.2 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummax_r0+obj.netsummin_r0x>0", obj.netsummax_r0 + obj.netsummin_r0x > 0, keyObj);
    trueFalse("<<<<obj.netsummax_r0_5+obj.netsummin_r0x_5>0", obj.netsummax_r0_5 + obj.netsummin_r0x_5 > 0, keyObj);
    trueFalse("<<<<obj.netsummax_r0_10+obj.netsummin_r0x_10>0", obj.netsummax_r0_10 + obj.netsummin_r0x_10 > 0, keyObj);
    trueFalse("<<<<obj.netsummax_r0_20+obj.netsummin_r0x_20>0", obj.netsummax_r0_20 + obj.netsummin_r0x_20 > 0, keyObj);
    trueFalse("<<<<obj.netsummax_r0_40+obj.netsummin_r0x_40>0", obj.netsummax_r0_40 + obj.netsummin_r0x_40 > 0, keyObj);

    trueFalse("<<<<obj.netsummax_r0_5===obj.netsummax_r0_10", obj.netsummax_r0_5 === obj.netsummax_r0_10, keyObj);
    trueFalse("<<<<obj.netsummax_r0_10===obj.netsummax_r0_20", obj.netsummax_r0_10 === obj.netsummax_r0_20, keyObj);
    trueFalse("<<<<obj.netsummin_r0_5===obj.netsummin_r0_10", obj.netsummin_r0_5 === obj.netsummin_r0_10, keyObj);

    trueFalse("<<<<obj.netsummin_r0_10===obj.netsummin_r0_20", obj.netsummin_r0_10 === obj.netsummin_r0_20, keyObj);
    trueFalse("<<<<obj.netsummin_r0_10>obj.netsummin_r0_20", obj.netsummin_r0_10 > obj.netsummin_r0_20, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_5===obj.netsummax_r0x_10", obj.netsummax_r0x_5 === obj.netsummax_r0x_10, keyObj);
    trueFalse("<<<<obj.netsummax_r0x_5>obj.netsummax_r0x_10", obj.netsummax_r0x_5 > obj.netsummax_r0x_10, keyObj);
    trueFalse("<<<<obj.netsummax_r0x_5<obj.netsummax_r0x_10", obj.netsummax_r0x_5 < obj.netsummax_r0x_10, keyObj);

    
    trueFalse("obj.netsummin_r0x_5-obj.netsummin_r0x_10<0*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0*obj.amount_ave_21, keyObj);
    
    trueFalse("obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.1*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.1*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.4*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.4*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_5-obj.netsummin_r0x_10<-0.2*obj.amount_ave_21", 
        obj.netsummin_r0x_5-obj.netsummin_r0x_10<-0.2*obj.amount_ave_21, keyObj);


    trueFalse("<<<<obj.netsummax_r0x_10===obj.netsummax_r0x_20", obj.netsummax_r0x_10 === obj.netsummax_r0x_20, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_5===obj.netsummin_r0x_10", obj.netsummin_r0x_5 === obj.netsummin_r0x_10, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_10===obj.netsummin_r0x_20", obj.netsummin_r0x_10 === obj.netsummin_r0x_20, keyObj);

    trueFalse("<<<<obj.netsummax_r0x_5>obj.netsummax_r0_5", obj.netsummax_r0x_5 > obj.netsummax_r0_5, keyObj);
    trueFalse("<<<<obj.netsummax_r0x_10>obj.netsummax_r0_10", obj.netsummax_r0x_10 > obj.netsummax_r0_10, keyObj);
    
    trueFalse("<<<<obj.netsummax_r0x_20>obj.netsummax_r0_20", obj.netsummax_r0x_20 > obj.netsummax_r0_20, keyObj);
    
    trueFalse("<<<<obj.netsummax_r0x_40>obj.netsummax_r0_40", obj.netsummax_r0x_40 > obj.netsummax_r0_40, keyObj);

    trueFalse("<<<<obj.netsummin_r0x_5>obj.netsummin_r0_5", obj.netsummin_r0x_5 > obj.netsummin_r0_5, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_10>obj.netsummin_r0_10", obj.netsummin_r0x_10 > obj.netsummin_r0_10, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_20>obj.netsummin_r0_20", obj.netsummin_r0x_20 > obj.netsummin_r0_20, keyObj);
    trueFalse("<<<<obj.netsummin_r0x_40>obj.netsummin_r0_40", obj.netsummin_r0x_40 > obj.netsummin_r0_40, keyObj);

    trueFalse("<<<<obj.netsum_r0x_5>obj.netsum_r0_5", obj.netsum_r0x_5 > obj.netsum_r0_5, keyObj);
    trueFalse("<<<<obj.netsum_r0x_10>obj.netsum_r0_10", obj.netsum_r0x_10 > obj.netsum_r0_10, keyObj);
    trueFalse("<<<<obj.netsum_r0x_20>obj.netsum_r0_20", obj.netsum_r0x_20 > obj.netsum_r0_20, keyObj);
    trueFalse("<<<<obj.netsum_r0x_40>obj.netsum_r0_40", obj.netsum_r0x_40 > obj.netsum_r0_40, keyObj);
    trueFalse("<<<<obj.netsum_r0x_80>obj.netsum_r0_80", obj.netsum_r0x_80 > obj.netsum_r0_80, keyObj);

    trueFalse("<<<<obj.netsum_r0x_5>0.05*obj.amount_ave_21", obj.netsum_r0x_5 > 0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0x_10>0.07*obj.amount_ave_21", obj.netsum_r0x_10 > 0.07 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0x_10>0.03*obj.amount_ave_21", obj.netsum_r0x_10 > 0.03 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0x_10>0.05*obj.amount_ave_21", obj.netsum_r0x_10 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0x_10>-0.05*obj.amount_ave_21", obj.netsum_r0x_10 > -0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0x_20>0.05*obj.amount_ave_21", obj.netsum_r0x_20 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0x_40>0.1*obj.amount_ave_21", obj.netsum_r0x_40 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0x_80>0.1*obj.amount_ave_21", obj.netsum_r0x_80 > 0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0x_5<-0.05*obj.amount_ave_21", obj.netsum_r0x_5 < -0.05 * obj.amount_ave_21, keyObj);
    
    trueFalse("<<<<obj.netsum_r0x_20<-0.05*obj.amount_ave_21", obj.netsum_r0x_20 < -0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0x_40<-0.1*obj.amount_ave_21", obj.netsum_r0x_40 < -0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0x_80<-0.1*obj.amount_ave_21", obj.netsum_r0x_80 < -0.1 * obj.amount_ave_21, keyObj);


    trueFalse("<<<<obj.netsum_r0_5<0.05*obj.amount_ave_21", obj.netsum_r0_5 < 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_5<-0.05*obj.amount_ave_21", obj.netsum_r0_5 < -0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_10<0.05*obj.amount_ave_21", obj.netsum_r0_10 < 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_10<-0.02*obj.amount_ave_21", obj.netsum_r0_10 < -0.02 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_10<-0.05*obj.amount_ave_21", obj.netsum_r0_10 < -0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_20>0.08*obj.amount_ave_21", obj.netsum_r0_20 > 0.08 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_20>0.05*obj.amount_ave_21", obj.netsum_r0_20 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_20>0.02*obj.amount_ave_21", obj.netsum_r0_20 > 0.02 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_20>=0.0*obj.amount_ave_21", obj.netsum_r0_20 >= 0.0 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_20>-0.05*obj.amount_ave_21", obj.netsum_r0_20 > -0.05 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_40>0.1*obj.amount_ave_21", obj.netsum_r0_40 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_40>-0.1*obj.amount_ave_21", obj.netsum_r0_40 > -0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_80>0.1*obj.amount_ave_21", obj.netsum_r0_80 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_80>-0.1*obj.amount_ave_21", obj.netsum_r0_80 > -0.1 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_above>obj.netsum_r0_below*6", obj.netsum_r0_above > obj.netsum_r0_below * 6, keyObj);
    trueFalse("obj.netsum_r0_above>obj.netsum_r0_below*5", obj.netsum_r0_above > obj.netsum_r0_below * 5, keyObj);
    trueFalse("obj.netsum_r0_above>obj.netsum_r0_below*4", obj.netsum_r0_above > obj.netsum_r0_below * 4, keyObj);
    trueFalse("obj.netsum_r0_above>obj.netsum_r0_below*2", obj.netsum_r0_above > obj.netsum_r0_below * 2, keyObj);
    trueFalse("obj.netsum_r0_above>obj.netsum_r0_below*1", obj.netsum_r0_above > obj.netsum_r0_below * 1, keyObj);
    trueFalse("<<<<obj.netsum_r0_above>obj.netsum_r0_below*0.5", obj.netsum_r0_above > obj.netsum_r0_below * 0.5, keyObj);

    trueFalse("<<<<obj.netsum_r0_above_60>1.5*obj.netsum_r0_below_60", obj.netsum_r0_above_60 > 1.5*obj.netsum_r0_below_60, keyObj);
    trueFalse("<<<<obj.netsum_r0_above_60>obj.netsum_r0x_above_60", obj.netsum_r0_above_60 > obj.netsum_r0x_above_60, keyObj);
    
    trueFalse("<<<<obj.netsum_r0_above_60>0*obj.amount_ave_21", obj.netsum_r0_above_60 > 0 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_above_60>0.1*obj.amount_ave_21", obj.netsum_r0_above_60 > 0.1 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_above_60>0.3*obj.amount_ave_21", obj.netsum_r0_above_60 > 0.3 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_above_60>0.5*obj.amount_ave_21", obj.netsum_r0_above_60 > 0.5 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_above>obj.netsum_r0x_above", obj.netsum_r0_above > obj.netsum_r0x_above, keyObj);

    trueFalse("<<<<obj.netsum_r0_below> 0.8*obj.netsum_r0x_below", obj.netsum_r0_below > 0.8*obj.netsum_r0x_below, keyObj);
    trueFalse("obj.netsum_r0_below>obj.netsum_r0x_below", obj.netsum_r0_below > obj.netsum_r0x_below, keyObj);
    trueFalse("<<<<obj.netsum_r0_below>1.2*obj.netsum_r0x_below", obj.netsum_r0_below > 1.2*obj.netsum_r0x_below, keyObj);

    trueFalse("<<<<obj.netsum_r0_below_60>obj.netsum_r0x_below_60", obj.netsum_r0_below_60 > obj.netsum_r0x_below_60, keyObj);

    trueFalse("<<<<obj.netsum_r0_above>0.1*obj.amount_ave_21", obj.netsum_r0_above > 0.1 * obj.amount_ave_21, keyObj);
    
    trueFalse("obj.netsum_r0_below>0.04*obj.amount_ave_21", obj.netsum_r0_below > 0.04 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below>0.02*obj.amount_ave_21", obj.netsum_r0_below > 0.02 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below>0.0*obj.amount_ave_21", obj.netsum_r0_below > 0.0 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below>-0.01*obj.amount_ave_21", obj.netsum_r0_below > -0.01 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below>-0.02*obj.amount_ave_21", obj.netsum_r0_below > -0.02 * obj.amount_ave_21, keyObj);

    trueFalse("<<<<obj.netsum_r0_below_60>0.05*obj.amount_ave_21", obj.netsum_r0_below_60 > 0.05 * obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below_60>0.03*obj.amount_ave_21", obj.netsum_r0_below_60 > 0.03 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsum_r0_below_60>0.0*obj.amount_ave_21", obj.netsum_r0_below_60 > 0.0 * obj.amount_ave_21, keyObj);
}

exports.conditions = conditions;
