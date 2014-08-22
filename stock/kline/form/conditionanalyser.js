var moneyflowforms = require("./moneyflowforms");
var klineutil = require("../klineutil");

function trueFalse(key, bool, keyObj) {
    if (!keyObj[key]) keyObj[key] = {
        "_true": 0,
        "_false": 0
    };
    bool ? keyObj[key]._true++ : keyObj[key]._false++;
}

function wBottomA(klineJson, idx, conditionObj, stockId) {
    var obj = klineJson[idx];
    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>0.3",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 0.3, keyObj);

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>-0.3",
        klineutil.increase(obj.amount_ave_8, obj.amount) > -0.3, keyObj);

    trueFalse("klineutil.increase(obj.amount_ave_8, obj.amount)>0",
        klineutil.increase(obj.amount_ave_8, obj.amount) > 0, keyObj);

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, idx);
    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
    var outerHigh = klineutil.highItem(klineJson, leftBottom - 30, leftBottom, "high");

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.2*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.2 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.05*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.05 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.1*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.1 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low)<0.15*klineJson[idx].amplitude_ave_21",
        klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) < 0.15 * klineJson[idx].amplitude_ave_21, keyObj);

    trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.1",
        klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.1, keyObj);
    trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.15",
        klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.15, keyObj);
    trueFalse("klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.25",
        klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.25, keyObj);

}

function wBottom(klineJson, idx, conditionObj, stockId) {
    var obj = klineJson[idx];
    var iswin = klineJson[idx].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    var rightBottomIdx = klineutil.lowItemIndex(klineJson, idx - 10, idx, "low");
    var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - 10, rightBottomIdx, "high");
    var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - 10, midTopIdx, "low");
    var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - 30, leftBottomIdx, "high");

    trueFalse("klineutil.increase(klineJson[midTopIdx].high, klineJson[idx].close)>0.0",
        klineutil.increase(klineJson[midTopIdx].high, klineJson[idx].close) > 0.0, keyObj);

    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>-0.07",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > -0.07, keyObj);

    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.0",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > 0.0, keyObj);
    trueFalse("klineutil.increase(klineJson[idx].close_ave_21,klineJson[idx].close_ave_8)>0.05",
        klineutil.increase(klineJson[idx].close_ave_21, klineJson[idx].close_ave_8) > 0.05, keyObj);

    trueFalse("klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close)<0.035",
        klineutil.increase(klineJson[idx].close_ave_8, klineJson[idx].close) < 0.035, keyObj);


    trueFalse("klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high)>0.15",
        klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > 0.15, keyObj);

    trueFalse("klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high)>0.25",
        klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > 0.25, keyObj);

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
    var outerHigh = klineutil.highItem(klineJson, leftBottom - 30, leftBottom, "low");

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


    var checkLowers = function (m, n){
            var lower = klineutil.lowerItemsIndex(klineJson, i-33, i-3, "close", klineJson[i].close);
             return i - lower[0]>10+m && i - lower[0] < 22+n
        }

    trueFalse("checkLowers(0,0)", checkLowers(-1,1), keyObj);
    
    return;
}

function sidewaysCompression (klineJson, i, conditionObj, stockId) {
    var obj = klineJson[i];
    var iswin = klineJson[i].winOrLose === "win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;    

    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)<1*obj.amplitude_ave_8",
        klineutil.increase(klineJson[i].open, klineJson[i].close)<1*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)<0.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[i].open, klineJson[i].close)<0.5*obj.amplitude_ave_8, keyObj);
    trueFalse("klineutil.increase(klineJson[i].open, klineJson[i].close)<1.5*obj.amplitude_ave_8",
        klineutil.increase(klineJson[i].open, klineJson[i].close)<1.5*obj.amplitude_ave_8, keyObj);

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
    trueFalse("1.015*klineJson[i].open<klineJson[i].close",
        1.015*klineJson[i].open<klineJson[i].close, keyObj);
    trueFalse("1.013*klineJson[i].open<klineJson[i].close",
        1.013*klineJson[i].open<klineJson[i].close, keyObj);
    trueFalse("1.014*klineJson[i].open<klineJson[i].close",
        1.014*klineJson[i].open<klineJson[i].close, keyObj);

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



function conditions(klineJson, idx, conditionObj, stockId) {
    //sidewaysCompression(klineJson, idx, conditionObj, stockId);
     //return;

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

    trueFalse("<<<<obj.netsummax_r0_40>0.01*obj.amount_ave_21", obj.netsummax_r0_40 > 0.01 * obj.amount_ave_21, keyObj);
    trueFalse(" obj.netsummax_r0_40>0.02*obj.amount_ave_21", obj.netsummax_r0_40 > 0.02 * obj.amount_ave_21, keyObj);
    trueFalse("<<<<obj.netsummax_r0_40>0.03*obj.amount_ave_21", obj.netsummax_r0_40 > 0.03 * obj.amount_ave_21, keyObj);
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
