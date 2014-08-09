function headShoulderBottom (klineJson, i) {
    //return true;
    var amp = klineJson[i].inc_ave_8;

    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
    var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
    var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);
    
    if (klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= amp*3) return false;
    var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);

    if (klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high)>-amp*0.5) return false;

    //if (!klineutil.noExRight(klineJson, leftBottom-30, i)) return false;
    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "low");

    return klineutil.increase(klineJson[leftTop].high, outerHigh)>amp*2;
   
}
console.log(analyer)
