var klineutil = require("../klineutil");
var counter = 0;

function toFixedString(str, len) {
    str = String(str);
    var diff = len - str.length;
    for (var i=0; i<diff; i++) {
        str +=" ";
    }
    return str;
}


function wBottomA_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_10===obj.netsummin_r0_20
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > 0.2 * klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(30,0.3)
}

function wBottomA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0x_20>0.15*obj.amount_ave_21
        && obj.netsummax_r0>2.3*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(40,0.3)
}


function wBottomA_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
                && klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > -0.8 * klineJson[i].amplitude_ave_21
        }(30,0.32)
}

function wBottomA_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*4
        && obj.netsummin_r0_5===obj.netsummin_r0_10
        && obj.netsummax_r0x_40>obj.netsummax_r0_40
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return  klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(30,0.25)
}


function wBottomA_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_40===-0*obj.amount_ave_21
        && obj.netsummax_r0x_10>0.3*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
        }(25,6)
}

function wBottomA_6(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummax_r0_20<0.3*obj.amount_ave_21
        && obj.netsummin_r0_40>-0.15*obj.amount_ave_21
        &&　obj.netsum_r0_above>obj.netsum_r0_below*6
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > 0.2 * klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(30,0.3)
}

function wBottomA_7(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_233
        && obj.amount_ave_21<1.5*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > 0.2 * klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(30,0.34)
}


function wBottomA_8(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        // && obj.close_ave_8<obj.close_ave_144
        && obj.netsummax_r0_duration>60
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.close_ave_144>1.05*obj.close
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(40,0.3)

}

function wBottomA_9(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_233
        && obj.r0_ratio<0.05
        && obj.ratioamount>0.05
        && obj.amount_ave_8>0.9*obj.amount
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.02
        && obj.netsum_r0_below<=0.0*obj.amount_ave_21
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(40,0.3)
}



function wBottomA(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        // && wBottomA_10(klineJson, i) 
        && (false
        ||wBottomA_1(klineJson, i) 
        ||wBottomA_2(klineJson, i) 
        || wBottomA_3(klineJson, i)
        || wBottomA_4(klineJson, i)
        || wBottomA_5(klineJson, i)
        || wBottomA_6(klineJson, i)
        || wBottomA_7(klineJson, i)
        || wBottomA_8(klineJson, i)
        || wBottomA_9(klineJson, i)
        );

}


function wBottom_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_40===0*obj.amount_ave_21 // obj.netsummax_r0_40>0.1*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (25,10, -1.25,0.18) 
    //(30,8, -0.15,0.2)

}

function wBottom_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_40>0.1*obj.amount_ave_21
        && obj.netsummax_r0_r0x_duration<35
        && obj.netsummax_r0>2.7*obj.amount_ave_21
        && obj.netsummax_r0x_20>obj.netsummax_r0_20
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,10, -1.25, 0.2) 
}

function wBottom_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.amount_ave_21<1.1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,10, -1.25, 0.2) 
}

function wBottom_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && obj.netsummax_r0x_10>0.1*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,10, -1.25, 0.25) 
}

function wBottom_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_40>-0.2*obj.amount_ave_21
        && obj.netsummax_r0>2*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 
}

function wBottom_6(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.amount_ave_21<1.5*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.2) 
}

function wBottom_7(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.ratioamount>0.06
        && obj.netsum_r0_above>obj.netsum_r0_below*2
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.4*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.015
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return true
            // klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (25,10, -1.25,0.18) 

}

function wBottom_8(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_21
        && obj.netsummax_r0_duration>40
        && obj.amount_ave_21<1.04*obj.amount_ave_8
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 
}

function wBottom_9(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_144
        && obj.amount_ave_8>1*obj.amount
        && obj.netsummax_r0_r0x<2*obj.amount_ave_21
        && obj.netsummax_r0>2*obj.amount_ave_21
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 

}

function wBottom(klineJson, i) {
    return true
         // && wBottom_9(klineJson, i)
         &&(false
         ||wBottom_1(klineJson, i) 
         || wBottom_2(klineJson, i)
         || wBottom_3(klineJson, i)
         || wBottom_4(klineJson, i)
         || wBottom_5(klineJson, i)
         || wBottom_6(klineJson, i)
         || wBottom_7(klineJson, i)
         || wBottom_8(klineJson, i)
         || wBottom_9(klineJson, i)
         ) 
}

function headShoulderBottom_1_1(klineJson, i) {
    
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below<=0*obj.amount_ave_21
        && obj.netsummin_r0_40>=-0.0*obj.amount_ave_21
        && obj.netsummax_r0_10 <= 0.0 * obj.amount_ave_21
        && function(){

            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

            var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom - 30, leftBottom, "low");

            return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) > 0.3*obj.amplitude_ave_8
                        && klineutil.increase(klineJson[leftTop].high, outerHigh) > 4 * obj.amplitude_ave_8;
        }();        
}

function headShoulderBottom_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsum_r0_20<0.02*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

            var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom - n, leftBottom, "low");

            return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= a*obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > b * obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftTop].high, outerHigh) > c * obj.amplitude_ave_8
        } (3, -0.2, 6, 30)

}

function headShoulderBottom_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        &&obj.netsum_r0_20<0.02*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

            var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom - n, leftBottom, "low");

            return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) <= a*obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > b * obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftTop].high, outerHigh) > c * obj.amplitude_ave_8
        } (113, -110.2, 5, 30)
}

function headShoulderBottom_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below<=0*obj.amount_ave_21
        && obj.netsummin_r0_40===-0*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

            var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom - n, leftBottom, "low");

            return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) > a*obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > b * obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftTop].high, outerHigh) > c * obj.amplitude_ave_8
        } (0.3, -110.2, 4, 30)
}

function headShoulderBottom_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5===obj.netsummin_r0x_10
        && obj.netsum_r0_above>obj.netsum_r0_below*3.5
        && obj.amount_ave_21<1.1*obj.amount
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var rightTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var middleBottom = klineutil.lowIndexOfUpTrend(klineJson, rightTop);

            var leftTop = klineutil.highIndexOfDownTrend(klineJson, middleBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, leftTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom - n, leftBottom, "low");

            return klineutil.increase(klineJson[middleBottom].low, klineJson[rightBottom].low) > a*obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftBottom].high, klineJson[rightTop].high) > b * obj.amplitude_ave_8
                && klineutil.increase(klineJson[leftTop].high, outerHigh) > c * obj.amplitude_ave_8
        } (0.1, -110.2, 4.5, 30)

}
function headShoulderBottom(klineJson, i) {
    
        return true
            //&& headShoulderBottom_4(klineJson, i)
            && (false
                ||headShoulderBottom_1(klineJson, i) 
                ||headShoulderBottom_2(klineJson, i) 
                ||headShoulderBottom_3(klineJson, i) 
                ||headShoulderBottom_4(klineJson, i) 
            ) 
}

function morningStarA_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.4*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function (m, n, k){
            var lower = klineutil.lowerItemsIndex(klineJson, i-k, i-3, "close", klineJson[i].close);
             return i - lower[0]>m && i - lower[0] < n
        }(4, 23, 45)

}


function morningStarA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1.05*obj.amount_ave_8
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function (m, n, k){
            var lower = klineutil.lowerItemsIndex(klineJson, i-k, i-3, "close", klineJson[i].close);
             return i - lower[0]>m && i - lower[0] < n
        }(4, 20, 50)

}

function morningStarA(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
            && (false
                || morningStarA_1(klineJson, i) 
                || morningStarA_2(klineJson, i) 
            ) 

}

function morningStarB_1_(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_10-obj.netsummin_r0_20 <= 0.00*obj.amount_ave_21 
        && obj.netsummax_r0x_20>obj.netsummax_r0_20 + 0.05*obj.amount_ave_21 
        && obj.netsummin_r0x_5<obj.netsummin_r0_5
}

function morningStarB_2_(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_10<=0.1*obj.amount_ave_21
        && obj.netsummin_r0_20>-0.05*obj.amount_ave_21
        && obj.netsum_r0_below<0.05*obj.amount_ave_21
    
}

function morningStarB_1(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21
        && obj.netsum_r0_20<0.05*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.amount_ave_21<1.05*obj.amount_ave_8

        &&function(m, n, k){
            var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
            var lower = klineutil.lowerItemsIndex(klineJson, i-m, i-2, "low", klineJson[i-2].high);

            return klineutil.increase(midhigh, klineJson[i-2].close) > -klineJson[i].amplitude_ave_8*n
                && lower.length<k
        }(75, 10, 22)
}

function morningStarB_2(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_20<0.05*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummax_r0x_10>obj.netsummax_r0_10
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && function(m, n, k){
        var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
        var lower = klineutil.lowerItemsIndex(klineJson, i-m, i-2, "low", klineJson[i-2].high);

        return true//klineutil.increase(midhigh, klineJson[i-2].close) > -klineJson[i].inc_ave_8*n
            && lower.length<k
    }(70, 0.0, 23)


}

function morningStarB_3(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_20<0.02*obj.amount_ave_21
        && obj.amount_ave_8>0.5*obj.amount
        && obj.netsummax_r0x_20>0.1*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && function(m, n, k){
        var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
        var lower = klineutil.lowerItemsIndex(klineJson, i-m, i-2, "low", klineJson[i-2].high);

        return true//klineutil.increase(midhigh, klineJson[i-2].close) > -klineJson[i].inc_ave_8*n
            && lower.length<k
    }(70, 0.0, 23)

}


function morningStarB(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
            && (false
                 || morningStarB_1(klineJson, i) 
                 || morningStarB_1(klineJson, i) 
                 || morningStarB_3(klineJson, i)
            ) 
}

function sidewaysCompression_1 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_10===obj.netsummax_r0_20
        && obj.netsum_r0_80 > -0.02 * obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.18*obj.amount_ave_21
        && obj.netsum_r0_20>=0.0*obj.amount_ave_21
            //&& obj.netsummax_r0x_10>0.2*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && !function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl>k*downhl;;
    }(30,40,0.6)
}

function sidewaysCompression_2 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsum_r0_above>obj.netsum_r0_below*4
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21
        && obj.netsummax_r0_40<0.02*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl<k*downhl;;
        }(30,70,0.4)
}

function sidewaysCompression_3 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.02
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl<k*downhl;;
        }(30,40,0.4)
}

function sidewaysCompression_4 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        //&& obj.netsummax_r0_r0x_duration<=15
        && obj.close_ave_8<1*obj.close
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl<k*downhl;;
        }(30,40,0.4)
}


function sidewaysCompression_5 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsum_r0_above>obj.netsum_r0_below*4
        && obj.amount_ave_21<1*obj.amount_ave_8
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.02
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl<k*downhl;;
        }(30,40,0.4)
}
function sidewaysCompression_6 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsummin_r0_40>-0.15*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(m, n, k) {
        var hidx = klineutil.highItemIndex(klineJson, i-m, i-1, "close");
        var hval = klineJson[hidx].close;
        
        var lidx = klineutil.lowItemIndex(klineJson, hidx, i, "close");
        var lval = klineJson[lidx].close;

        var plidx = klineutil.lowItemIndex(klineJson, hidx-n, hidx, "close");
        var plval = klineJson[plidx].close;

        var downhpl = klineutil.increase(plval, hval);    
        var downhl = klineutil.increase(lval, hval);
    
        return downhpl<k*downhl;;
        }(30,40,0.4)
}


function sidewaysCompression(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
         //&& sidewaysCompression_6(klineJson, i)
         && (false
         || sidewaysCompression_1(klineJson, i) 
         || sidewaysCompression_2(klineJson, i)
         || sidewaysCompression_3(klineJson, i) 
         || sidewaysCompression_4(klineJson, i)
         || sidewaysCompression_5(klineJson, i)
          || sidewaysCompression_6(klineJson, i)
         
         )
}

function redNGreenRed_1 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && function(a, b, c, d, e){
            var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
            
            if (klineutil.increase(klineJson[top].high, obj.close) > -obj.amplitude_ave_8 * a //-inc_ave*3.5 
                && klineutil.increase(klineJson[top].high, obj.close) <  obj.amplitude_ave_8*b) {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
                return lowerItems.length >d && lowerItems.length <e;
            }
             return false;
        } (2, 1, 120, 6, 27) 
}


function redNGreenRed_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21
        && obj.netsummin_r0_40>-0.2*obj.amount_ave_21
         && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && function(a, b, c, d, e){
            var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
            if (klineutil.increase(klineJson[top].high, obj.close) > -obj.amplitude_ave_8 * a
                && klineutil.increase(klineJson[top].high, obj.close) <  obj.amplitude_ave_8*b) {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
                return lowerItems.length >d && lowerItems.length <e;
            }
             return false;
        } (2, 1, 120, 6, 27) 
}

function redNGreenRed_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02 //<<<<obj.amount_ave_21<1.5*obj.amount_ave_8
        && function(a, b, c, d, e){
            var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
            if (klineutil.increase(klineJson[top].high, obj.close) > -obj.amplitude_ave_8 * a
                && klineutil.increase(klineJson[top].high, obj.close) <  obj.amplitude_ave_8*b) {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
                return lowerItems.length >d && lowerItems.length <e;
            }
             return false;
        } (2, 1, 120, 4, 30) 
}

function redNGreenRed_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true 
        && obj.netsummax_r0x_20>obj.netsummax_r0_20
        && obj.amount_ave_8>0.5*obj.amount
        && obj.amount_ave_21<1.5*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.netsummax_r0>1*obj.amount_ave_21//obj.netsummax_r0_5===0.0*obj.amount_ave_21 //obj.netsummin_r0_20===-0*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.021 // obj.amount_ave_21<1*obj.amount_ave_8
        && function(a, b, c, d, e){
            var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
            if (klineutil.increase(klineJson[top].high, obj.close) > -a
                && klineutil.increase(klineJson[top].high, obj.close) < b) {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
                return lowerItems.length >d && lowerItems.length <e;
            }
             return false;
        } (10.08, 10.1, 120, -1, 38) 
}


function redNGreenRed_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_21>0.4*obj.amount
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.4*obj.amount_ave_21
        && obj.netsummax_r0_40===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1.0*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e){
            var top = klineutil.highIndexOfDownTrend(klineJson, i-1);            
            if (klineutil.increase(klineJson[top].high, obj.close) > -a
                && klineutil.increase(klineJson[top].high, obj.close) < b) {
                var lowerItems = klineutil.lowerItemsIndex(klineJson, top-c, top-1, "low", klineJson[top-1].high);
                return lowerItems.length >d && lowerItems.length <e;
            }
             return false;
        } (10.08, 10.1, 120, -1, 40) 
}

function redNGreenRed (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
         && (false
         || redNGreenRed_1(klineJson, i)  
         || redNGreenRed_2(klineJson, i)   
         || redNGreenRed_3(klineJson, i)               
         || redNGreenRed_4(klineJson, i)  
         || redNGreenRed_5(klineJson, i)  
         )  
}


function greenInRed_1 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_8>0.5*obj.amount
        && obj.netsummax_r0_20<0.1*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e){
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-a, i, "close", klineJson[i].low);
            return  klineutil.increase(klineJson[i].open, klineJson[i].close) > d//0.5*obj.amplitude_ave_8 //d
                && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < e
                && lowerItems.length > b && lowerItems.length < c;
        }(120, 0, 45, 0.02, 0)

}

function greenInRed_2(klineJson, i) {   // greenInRedC
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    
    return true
            && obj.amount_ave_8>0.5*obj.amount
            && obj.netsummax_r0>obj.amount_ave_21
            && obj.netsum_r0_below===0.0*obj.amount_ave_21
            && obj.netsummin_r0_10>-0.05*obj.amount_ave_21
            && obj.amount_ave_21<1.15*obj.amount_ave_8
            && obj.netsummax_r0_5===0.0*obj.amount_ave_21
            && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02
            
}

function greenInRed (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && (false
        || greenInRed_1(klineJson, i) 
        || greenInRed_2(klineJson, i) 
         )  
}


function reversedHammer_1(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummax_r0_40===0.0*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e) {
                var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
                var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
                return true
                    && higherItems.length>c 
                    && higherItems.length<d
                    && klineutil.increase(klineJson[i].high, klineJson[hidx].close) > e
            }(55, 20, 0, 15, 5*klineJson[i].amplitude_ave_8)

}

function reversedHammer_2(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*7
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        //&& obj.netsum_r0x_10>obj.netsum_r0_10
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e) {
                var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
                var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
                return true
                    && higherItems.length>c 
                    && higherItems.length<d
                    && klineutil.increase(klineJson[i].high, klineJson[hidx].close) > e
            }(55, 18, 0, 15, 4*klineJson[i].amplitude_ave_8)

}

function reversedHammer_3(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsum_r0_20<0.05*obj.amount_ave_21
        && obj.amount_ave_8>0.5*obj.amount
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.02
        && obj.amount_ave_21<1*obj.amount//
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e) {
                var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
                var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
                return true
                    && higherItems.length>c 
                    && higherItems.length<d
                    && klineutil.increase(klineJson[i].high, klineJson[hidx].close) > e
            }(80, 15, 0, 13, 3.5*klineJson[i].amplitude_ave_8)

}



function reversedHammer (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && (false
        || reversedHammer_1(klineJson, i) 
        || reversedHammer_2(klineJson, i) 
        || reversedHammer_3(klineJson, i) 
         )  
}

function hammer_1(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true 
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21//0.6
        && obj.netsummin_r0_40===-0*obj.amount_ave_21
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
         && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * klineJson[i].amplitude_ave_8
            
        }(55, 12, 11, 4)


}

function hammer_2(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.netsummax_r0_40===0.0*obj.amount_ave_21
        && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * klineJson[i].amplitude_ave_8
            
        }(50, 15, 9, 4)


}

function hammer_3 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.amount_ave_21<1.3*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
         && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * klineJson[i].amplitude_ave_8
            
        }(50, 13, 10, 4)
}
function hammer_4 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        &&　obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*5
        && obj.netsummin_r0_40>-0.05*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21

        && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * klineJson[i].amplitude_ave_8
            
        }(45, 14, 10, 4)
}

function hammer_5 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_above_60<0.1*obj.amount_ave_21
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * 0.015 *2
            
        }(44, 14, 10, 4)
}

function hammer_6 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_5>-0.05*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {

            var linehigh = klineJson[i].high - Math.max(klineJson[i].close, klineJson[i].open);
            var linelow = Math.min(klineJson[i].close, klineJson[i].open) - klineJson[i].low;
            var entity = Math.abs(klineJson[i].close - klineJson[i].open);
            var inc_ave = klineJson[i].inc_ave_8;
            var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
            
            return higherItems.length<c
                        && klineutil.increase(klineJson[i].open, klineJson[hidx].close) > d * 0.015 *2
            
        }(48, 14, 10, 4.5)
}


function hammer (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && (false
         || hammer_1(klineJson, i) 
         || hammer_2(klineJson, i) 
         || hammer_3(klineJson, i) 
         || hammer_4(klineJson, i) 
         || hammer_5(klineJson, i) 
         || hammer_6(klineJson, i)
         )  
}

function flatBottom_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_8>0.5*obj.amount
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > inc_ave*d
            && higherItems.length<e;
    
    }(1,40,13,6,7)

}

function flatBottom_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsum_r0_below<0.02*obj.amount_ave_21
        && obj.netsum_r0_below>-0.02*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount_ave_8
        && obj.netsummax_r0_40===0.0*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > inc_ave*d
            && higherItems.length<e;
    
    }(1,44, 18,4,7) 


}

function flatBottom_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0x_20>obj.netsummax_r0_20
        && obj.netsummax_r0>2*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > inc_ave*d
            && higherItems.length<e;
    
    }(1,33,11,6,7) 

}

function flatBottom_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && obj.netsummin_r0_40===-0*obj.amount_ave_21
        && obj.amount_ave_21<1.4*obj.amount_ave_8// 0.095
        && function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) >0.14
            && higherItems.length<e;
    
    }(1,35,11,6,7) 
        

}


function flatBottom (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
//        && flatBottom_5(klineJson, i)
        && (false
            || flatBottom_1(klineJson, i) 
            || flatBottom_2(klineJson, i) 
             || flatBottom_3(klineJson, i) 
             || flatBottom_4(klineJson, i) 
         )  
}

function lowRedsB_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    
    return true
        && obj.close_ave_8<0.98*obj.close
        && obj.netsum_r0_10>-0.05*obj.amount_ave_21
        && obj.netsum_r0_below>-0.2*obj.amount_ave_21&& obj.netsum_r0_below< 0.02*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.amount_ave_21<1.2*obj.amount_ave_8
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function (a, b, c) {    
            var higherItems = klineutil.higherItemsIndex(klineJson, i-a, i, "low", klineJson[i].high);
            return i-higherItems[higherItems.length-1] > b && higherItems.length>c;
        }(55, 10, 20)
}


function lowRedsB (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        //&& lowRedsB_2(klineJson, i)
        && (false
            || lowRedsB_1(klineJson, i) 
         )  
}

//********better**********//////////////////////////////////////

function smallRedsAndGreensA_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1.3*obj.amount_ave_8
        && obj.netsum_r0_20<0.02*obj.amount_ave_21
       
        && obj.netsummin_r0_10>-0.05*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
       //     return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            //&& klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) > klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 100, 40, 4)
}

function smallRedsAndGreensA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0>=-0.1*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount_ave_8
        && obj.netsum_r0_10>-0.02*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
       //     return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            && klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) > klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 100, 40, 4)
}


function smallRedsAndGreensA_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.015
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
       //     return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            && klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) > klineJson[i].inc_ave_8*h
        }()
    }(2, 5, 4, 0, 80, 80, 37, 4)
}


function smallRedsAndGreensA_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_40>-0.15*obj.amount_ave_21
        && obj.amount_ave_8<1*obj.amount
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
//           return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            && klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) > klineJson[i].inc_ave_8*h
        }()
    }(2, 4, 4, 0, 80, 80, 38, 4)
}


function smallRedsAndGreensA_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below<0.04*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummax_r0_20<0.1*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && klineutil.increase(klineJson[i].open, klineJson[i].close)<0.7*obj.amplitude_ave_8
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21//&& obj.netsum_r0_20>=0.0*obj.amount_ave_21//&& obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
          // return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            //&& klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) >  0.015*h//klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 85, 40, 4.5)
}


function smallRedsAndGreensA_6(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_80>-0.1*obj.amount_ave_21
        && obj.netsum_r0_below>-0.02*obj.amount_ave_21
        && obj.netsummax_r0_r0x<0.5*obj.amount_ave_21
        && obj.netsum_r0_above_60>0.3*obj.amount_ave_21
        && obj.netsummax_r0_20<0.13*obj.amount_ave_21
        && obj.netsummin_r0_20>=-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
        // return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            //&& klineutil.increase(klineJson[i-c].close_ave_8, klineJson[i].close_ave_8) > d//-klineJson[i].inc_ave_8*0.8
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].close) >  0.015*h//klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 80, 40, 4)
}



function smallRedsAndGreensA_7(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below>-0.02*obj.amount_ave_21
        &&   obj.netsummax_r0_40<0.09*obj.amount_ave_21
         && obj.netsummin_r0_20>=-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
         // return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].low) >  0.015*h//klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 80, 40, 4) 
}


function smallRedsAndGreensA_8(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_10===obj.netsummax_r0_20
        && obj.netsum_r0_above_60>0.1*obj.amount_ave_21// obj.netsum_r0_above_60>1.5*obj.netsum_r0_below_60
        && obj.netsummax_r0>2.5*obj.amount_ave_21 // <<<<obj.netsum_r0_above_60>0.5*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g, h) {
         // return true
        var n=i;
        for (; n>1; n--) {
            var inc_ave = klineJson[n].inc_ave_21;
            if (Math.abs(klineutil.increase(klineJson[n].open, klineJson[n].close)) > inc_ave*a) {
                break;
            } 
        }

        return true
            && i-n>= b
            && function () {    
            var lowerItems = klineutil.lowerItemsIndex(klineJson, i-e, i, "high", klineJson[i].low);
            var lidx = klineutil.lowItem(klineJson, i-f, i, "low");
            return true
                && i-lowerItems[0] <g 
                && klineutil.increase(lidx, klineJson[i].low) >  0.015*h//klineJson[i].inc_ave_8*h
        }()
    }(3, 5, 4, 0, 80, 80, 40, 4) // (3, 5, 4, 0, 80, 80, 40, 4)
}

function smallRedsAndGreensA (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        //&& smallRedsAndGreensA_6(klineJson, i)
        && (false
            || smallRedsAndGreensA_1(klineJson, i) 
            || smallRedsAndGreensA_3(klineJson, i)
            || smallRedsAndGreensA_4(klineJson, i)
            || smallRedsAndGreensA_5(klineJson, i)
            || smallRedsAndGreensA_6(klineJson, i)
            || smallRedsAndGreensA_7(klineJson, i)
            || smallRedsAndGreensA_8(klineJson, i)
         )  
}


function bullPulsing_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below>-0.05*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsum_r0_below<=0.02*obj.amount_ave_21
        && obj.netsummin_r0_10>-0.07*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && function(a, b, c, d, e, f) {
            // return true
            var n=i;
            var biginc = 0;
            for (; n>1; n--) {
                var inc_ave = klineJson[n].inc_ave_21;
                if (klineutil.increase(klineJson[n].open, klineJson[n].close) > 0.01*a//inc_ave*a
                    ) {
                    biginc = klineutil.increase(klineJson[n].open, klineJson[n].close);
                    break;
                } 
            }
            for (var j=n+1; j<=i; j++) {
                var inc_ave = klineJson[n-1].inc_ave_8;
                if (klineutil.increase(klineJson[n].close, klineJson[j].close) < b*inc_ave
                    )
                    return false;
            }

            var lowerItems = klineutil.lowerItemsIndex(klineJson, n-c, n, "close", klineJson[n].open);
            var higherItems = klineutil.higherItemsIndex(klineJson, n-d, n, "low", klineJson[n].close);
            return n-lowerItems[0] <e //&& n-higherItems[higherItems.length-1] > f;
        }(2, -0.8, 65, 20, 50, 5) //(1.5, -1.5, 65, 20, 50, 5)
        
}

function bullPulsing (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        //&& bullPulsing_2(klineJson, i)
        &&(false
            || bullPulsing_1(klineJson, i) 
         )  
}


function sz002424_201401_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.015
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && obj.netsummax_r0>2*obj.amount_ave_21
        && obj.netsummin_r0_20>=-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g) {
            //return true;
            var n = i;
            for (; i-n<a; n--) {
                if (klineutil.increase(klineJson[i].amount_ave_8, klineJson[n].amount_ave_8)>b)
                    break;
            }

            if (i-n>=a) return false;

            var lidx = klineutil.lowItemIndex(klineJson, n-c, i, "close");
            var hidx = klineutil.highItemIndex(klineJson, n-d, n, "close");
            var re = true
                && n-lidx<e
                && klineutil.increase(klineJson[i].close, klineJson[n].close)>f*0.03//klineJson[i].amplitude_ave_8
                && klineutil.increase(klineJson[n].close, klineJson[hidx].close)>g*0.03//klineJson[n].amplitude_ave_8
               
            return re;
        }(60, 0.5, 30, 60, 10, 2.5, 0)
 }

function sz002424_201401_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsum_r0_20<0.05*obj.amount_ave_21
        && obj.amount_ave_8<1.5*obj.amount
        && obj.netsum_r0_below_60===0.0*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g) {
            //return true;
            var n = i;
            for (; i-n<a; n--) {
                if (klineutil.increase(klineJson[i].amount_ave_8, klineJson[n].amount_ave_8)>b)
                    break;
            }

            if (i-n>=a) return false;

            var lidx = klineutil.lowItemIndex(klineJson, n-c, i, "close");
            var hidx = klineutil.highItemIndex(klineJson, n-d, n, "close");
            var re = true
                && n-lidx<e
                && klineutil.increase(klineJson[i].close, klineJson[n].close)>f*0.03//klineJson[i].amplitude_ave_8
                // && klineutil.increase(klineJson[n].close, klineJson[hidx].close)>g*0.03//klineJson[n].amplitude_ave_8
               
            return re;
        }(60, 0.5, 30, 60, 10, 2.5, 0)
 }


function sz002424_201401_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_144>0.98*obj.close
        && obj.netsummax_r0_10+obj.netsummin_r0x_10<=0
        && obj.close_ave_8>=obj.close_ave_21
        && obj.netsummax_r0x_20>obj.netsummax_r0_20//&& obj.netsummax_r0x_10>obj.netsummax_r0_10
        && obj.netsummin_r0_20>=-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g) {
            //return true;
            var n = i;
            for (; i-n<a; n--) {
                if (klineutil.increase(klineJson[i].amount_ave_8, klineJson[n].amount_ave_8)>b)
                    break;
            }

            if (i-n>=a) return false;

            var lidx = klineutil.lowItemIndex(klineJson, n-c, i, "close");
            var hidx = klineutil.highItemIndex(klineJson, n-d, n, "close");
            var re = true
                && n-lidx<e
                && klineutil.increase(klineJson[i].close, klineJson[n].close)>f*0.03//klineJson[i].amplitude_ave_8
                // && klineutil.increase(klineJson[n].close, klineJson[hidx].close)>g*0.03//klineJson[n].amplitude_ave_8
               
            return re;
        }(60, 0.5, 30, 60, 10, 2.5, 0)
 }


function sz002424_201401_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_netsum_r0x<-0.8*obj.amount_ave_21
        && obj.amount_ave_8>0.5*obj.amount
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.022
        && obj.netsummax_r0x_20>obj.netsummax_r0_20
        && obj.netsummin_r0_20>=-0*obj.amount_ave_21
        && function(a, b, c, d, e, f, g) {
            //return true;
            var n = i;
            for (; i-n<a; n--) {
                if (klineutil.increase(klineJson[i].amount_ave_8, klineJson[n].amount_ave_8)>b)
                    break;
            }

            if (i-n>=a) return false;

            var lidx = klineutil.lowItemIndex(klineJson, n-c, i, "close");
            var hidx = klineutil.highItemIndex(klineJson, n-d, n, "close");
            var re = true
                && n-lidx<e
                && klineutil.increase(klineJson[i].close, klineJson[n].close)>f*0.03//klineJson[i].amplitude_ave_8
                // && klineutil.increase(klineJson[n].close, klineJson[hidx].close)>g*0.03//klineJson[n].amplitude_ave_8
               
            return re;
        }(60, 0.5, 30, 60, 10, 2.5, 0)
 }
 

function sz002424_201401 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
          // && sz002424_201401_5(klineJson, i)
        && (false
            || sz002424_201401_1(klineJson, i) 
            || sz002424_201401_2(klineJson, i) 
            || sz002424_201401_3(klineJson, i) 
            || sz002424_201401_4(klineJson, i) 
         )  
}

function sz002424_201405_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummax_r0>2.2*obj.amount_ave_21
        && obj.turnover_ave_8>1.1*obj.turnover_ave_21
        && obj.netsummin_r0_5>-0.05*obj.amount_ave_21
        && function(m, n) {
            // return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineJson[leftBottom].netsum_r0_below_60<=0
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
        }(25,5.5)
}

        
function sz002424_201405_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_8>0.5*obj.amount
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.018
        && function(m, n) {
            // return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineJson[leftBottom].netsum_r0_below_60<=0
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
        }(25,6)
}


function sz002424_201405_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.amount_ave_21>0.6*obj.amount_ave_8
        && obj.netsummax_r0_5===obj.netsummax_r0_10
        && obj.netsummin_r0_10===obj.netsummin_r0_20
        && function(m, n) {
            // return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineJson[leftBottom].netsum_r0_below_60<=0
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
        }(25,6.5)
}


function sz002424_201405_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_40>-0.18*obj.amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*5
        && obj.netsummax_r0>2.3*obj.amount_ave_21
        && obj.netsum_r0_40<0.1*obj.amount_ave_21
        && function(m, n) {
            // return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineJson[leftBottom].netsum_r0_below_60<=0 
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.22
        }(25,6.7)
}


function sz002424_201405_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_20>-0.1*obj.amount_ave_21
        && obj.netsum_r0_below_60===0.0*obj.amount_ave_21
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.close_ave_233>1*obj.close
        && obj.close_ave_144> obj.close_ave_233
        && function(m, n) {
            //return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return true
                // && klineJson[leftBottom].netsum_r0_below_60<= 1*klineJson[leftBottom].amount_ave_21 //0 
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.15
        }(18,6.7)
}

function sz002424_201405_6(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsum_r0_above>obj.netsum_r0_below*5
        && obj.close_ave_144>1.1*obj.close
        && obj.close_ave_8>obj.close_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(m, n) {
            // return true;
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return true
            // klineJson[leftBottom].netsum_r0_below_60<=0 
                && klineutil.increase(klineJson[leftBottom].high, outerHigh) > 0.22
        }(30,6.7)
}


function sz002424_201405 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        // && sz002424_201405_6(klineJson, i)
        && (false
             || sz002424_201405_1(klineJson, i) 
             || sz002424_201405_2(klineJson, i) 
             || sz002424_201405_3(klineJson, i) 
             || sz002424_201405_4(klineJson, i)
             || sz002424_201405_5(klineJson, i)
             || sz002424_201405_6(klineJson, i)
         )  
}


function sh600802_201406_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_duration>40
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        // && obj.turnover_ave_8>1.2*obj.turnover_ave_21 
        && obj.amount_ave_21<1*obj.amount_ave_8
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d) {
            //return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                //&& klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) < 6*klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 40, 0.18, 0.02)
}

function sh600802_201406_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.amount_ave_21<1.5*obj.amount_ave_8
        && obj.netsummin_r0_40>=-0*obj.amount_ave_21
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.05
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}


function sh600802_201406_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.amount_ave_8>0.5*obj.amount
        && obj.netsummin_r0_40>-0.05*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                //&& klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) < 6*klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 37, 0.2, 0.02)
}

function sh600802_201406_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.netsummax_r0>1.5*obj.amount_ave_21
        && obj.netsummax_r0x_40>obj.netsummax_r0_40//&& obj.netsum_r0x_10>-0.05*obj.amount_ave_21
        && obj.amount_ave_21<1*obj.amount
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {
             // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                //&& klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) < 6*klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 37, 0.2, 0.02)
}

function sh600802_201406_5(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>obj.amount_ave_21
        && obj.netsum_r0_10>-0.02*obj.amount_ave_21
        && obj.close_ave_8>obj.close_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, d) {
             // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                //&& klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) < 6*klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 40, 0.2, 0.02)
}

function sh600802_201406_6(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_233
        && obj.close_ave_21<obj.close_ave_144
        && obj.netsum_r0x_40<0.1*obj.amount_ave_21
        && obj.netsum_r0_10>-0.02*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21
        && klineutil.increase(klineJson[i].open, klineJson[i].close)>0.02
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                //&& klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) < 6*klineJson[i].amplitude_ave_21
                && klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 40, 0.22, 0.02)
}


function sh600802_201406_7(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_8<obj.close_ave_233
        && obj.close_ave_8<1.02*obj.close
        && obj.netsummax_r0_20<0.5*obj.amount_ave_21
        && obj.close_ave_144>1.05*obj.close
        && obj.turnover_ave_8>1*obj.turnover_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.05
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}


function sh600802_201406_8(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0_40===0.0*obj.amount_ave_21
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        
        && obj.amount_ave_8<1.5*obj.amount
        && obj.amount_ave_8>0.5*obj.amount

        && obj.close_ave_21<1.05*obj.close
        && obj.close_ave_8<obj.close_ave_233
        
        && obj.amount_ave_21>0.7*obj.amount_ave_8
        && obj.amount_ave_21<1.1*obj.amount_ave_8

        && obj.netsum_r0_80<0.3*obj.amount_ave_21
        
        // && obj.netsum_r0_20<-0.05*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.07
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}

function sh600802_201406_9(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        //&& obj.netsummin_r0_5===obj.netsummin_r0_10
        && obj.netsummin_r0_10>-0.05*obj.amount_ave_21
        &&  obj.close_ave_8>1.05*obj.close//obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.08
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}

function sh600802_201406_10(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.close_ave_21>1.03*obj.close
        //&& obj.netsummax_r0_duration>40
        && obj.netsum_r0_10>-0.05*obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.08
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}

function sh600802_201406_11(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummax_r0>obj.amount_ave_21
        && obj.netsum_r0_above_60<0.5*obj.amount_ave_21
        && obj.turnover_ave_8>0.8*obj.turnover_ave_21
        && obj.close_ave_144>1.05*obj.close
        && obj.netsum_r0_above>obj.netsum_r0_below*6
        && obj.netsummax_r0_5===0.0*obj.amount_ave_21
        && function(a, b, c, d) {
            // return true;
            var lidx = klineutil.lowItemIndex(klineJson, i-a, i, "low");
            var rhidx = klineutil.highItemIndex(klineJson, lidx, i, "high");
            var lhidx = klineutil.highItemIndex(klineJson, lidx-b, lidx, "high");

            return true
                && klineutil.increase(klineJson[rhidx].high, klineJson[lhidx].high) > c
                && klineutil.increase(klineJson[lidx].low, klineJson[rhidx].high) > 0.08
                //&& klineutil.increase(klineJson[lidx].low, klineJson[i].close) > d
        }(30, 35, 0.2, 0.02)
}

function sh600802_201406 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        // && sh600802_201406_12(klineJson, i)
        && (false
            || sh600802_201406_1(klineJson, i)
            ||sh600802_201406_2(klineJson, i)
            || sh600802_201406_3(klineJson, i)
            || sh600802_201406_4(klineJson, i)
            || sh600802_201406_5(klineJson, i)
            || sh600802_201406_6(klineJson, i)
            || sh600802_201406_7(klineJson, i)
            || sh600802_201406_8(klineJson, i)
            || sh600802_201406_9(klineJson, i)
            || sh600802_201406_10(klineJson, i)
            || sh600802_201406_11(klineJson, i)
         )  
}

function sh600716_201410 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && function(a, b, c, d) {
            // return true;
            var duration = obj.netsummax_r0_r0x_duration

            var lower = klineutil.lowerItemsIndex(klineJson, i-duration, i, "close", klineJson[i].close);

            var durationlowidx = klineutil.lowItemIndex(klineJson, i-duration, i, "close");
            var durationlow = klineJson[durationlowidx].close;

            var durationhighidx = klineutil.highItemIndex(klineJson, i-duration, i, "close");
            var durationhigh = klineJson[durationhighidx].close;
            return true
                
                && obj.netsum_r0_above - obj.netsum_r0_above_60 > 5*obj.amount_ave_8 //0.05*obj.marketCap
                && obj.netsum_r0_above - obj.netsum_r0_above_60 < 1500000000//
                // && function(){
                //     console.log("=============",obj.date)
                //     return true;
                // }()
        }()
 }   

// function sh600523_201406(klineJson, i) {
//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;

//     return true
//         && function(a, b, c, d) {
//             return true;
//             var higherItems = klineutil.higherItemsIndex(klineJson, i-a, i, "close", klineJson[i].close);
//             var highIdx = klineutil.highItemIndex(klineJson, i-a, i , "high");
//             var amountHighIdx = klineutil.highItemIndex(klineJson, i-a, i , "amount_ave_8");
//             var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, highIdx);

//             var lefthigherItems = klineutil.higherItemsIndex(klineJson, leftBottom-b, leftBottom, "close", klineJson[i].close);
//             var leftlow = klineutil.lowItem(klineJson, leftBottom-b, leftBottom, "close");
//             return true
//                 && higherItems.length>c
//                 && lefthigherItems.length<d
//                 //&& klineJson[amountHighIdx].amount_ave_8> 1.5*klineJson[i].amount_ave_8
//                 && klineutil.increase(leftlow, klineJson[i].close) < 0.15
//                 // && function(){
//                 //     console.log("-------------",klineJson[i].date, leftlow, klineJson[i].close, klineutil.increase(leftlow, klineJson[i].close) )
//                 //     return true
//                 // }()
//         }(25, 40, 15, 5)
// }

// exports.sh600716_201410 = sh600716_201410;
// exports.sh600523_201406 = sh600523_201406
exports.sh600802_201406 = sh600802_201406;
exports.sz002424_201405 = sz002424_201405;
exports.sz002424_201401 = sz002424_201401;
exports.sidewaysCompression = sidewaysCompression;
exports.wBottomA = wBottomA;
exports.wBottom = wBottom;
exports.headShoulderBottom = headShoulderBottom;
exports.morningStarA = morningStarA;
exports.morningStarB = morningStarB;
exports.redNGreenRed = redNGreenRed;
exports.greenInRed = greenInRed;
//exports.redGreenRed = redGreenRed;
exports.reversedHammer = reversedHammer;
exports.hammer = hammer
exports.flatBottom = flatBottom
exports.lowRedsB = lowRedsB;
exports.smallRedsAndGreensA = smallRedsAndGreensA;
exports.bullPulsing = bullPulsing;



/*
{"date": "06/06/2012",
"open": 2.98,
"high": 3,
"low": 2.95,
"close": 2.96,
"volume": 6427968,
"amount": 19091024,
"close_ave_8": 3.002,
"close_ave_21": 3.003,
"close_ave_55": 2.952,
"close_ave_144": 2.935,
"close_ave_233": 3.209,
"volume_ave_8": 15081743.75,
"volume_ave_21": 19125609.238,
"amount_ave_8": 46714972,
"amount_ave_21": 60674279.762,
"amplitude_ave_8": 0.031,
"amplitude_ave_21": 0.035,
"amplitude_ave_55": 0.026,
"inc_ave_8": 0.015,
"inc_ave_21": 0.018,
"netamount": -2414830.86,
"ratioamount": -0.12649,
"r0_net": -2605338.72,
"r0_ratio": -0.1364693,
"netsum_r0_5": -2375487.91,
"netsum_r0x_5": -27950244.999999996,
"netsum_r0_10": 918978.0699999998,
"netsum_r0x_10": -24908457.509999998,
"netsum_r0_20": 41817219.620000005,
"netsum_r0x_20": 13550372.33,
"netsum_r0_40": 43795189.38,
"netsum_r0x_40": -18379307.540000003,
"netsum_r0_80": 43517119.57000001,
"netsum_r0x_80": -65560520.599999964,
"netsummax_r0_r0x": 74249632.34,
"netsummax_r0_r0x_duration": 15,
"netsummax_r0_duration": 135,
"netsummax_r0_netsum_r0x": -121715313.02,
"netsummax_r0": 55637417.980000004,
"netsummax_r0_5": 153855.38999999966,
"netsummax_r0_10": 1519571.0899999999,
"netsummax_r0_20": 46149776.300000004,
"netsummax_r0_40": 46149776.300000004,
"netsummin_r0": -3100641.59,
"netsummin_r0_5": -2605338.72,
"netsummin_r0_10": -2605338.72,
"netsummin_r0_20": -3100641.59,
"netsummin_r0_40": -3100641.59,
"netsummax_r0x": 28238048.13,
"netsummax_r0x_5": 190507.86000000034,
"netsummax_r0x_10": 190507.86000000034,
"netsummax_r0x_20": 28238048.13,
"netsummax_r0x_40": 28238048.13,
"netsummin_r0x": -127723158.01999998,
"netsummin_r0x_5": -27950244.999999996,
"netsummin_r0x_10": -38974521.39,
"netsummin_r0x_20": -40770819.41,
"netsummin_r0x_40": -40770819.41,
"netsum_r0_above": 49509712.980000004,
"netsum_r0_above_60": 44947371.38,
"netsum_r0_below": 6127705,
"netsum_r0_below_60": -1180000,
"netsum_r0x_above": -91464971.56,
"netsum_r0x_above_60": -37266638.6,
"netsum_r0x_below": -32205046.159999996,
"netsum_r0x_below_60": -22564650.080000002,
"incStop": -0.07853006067291766,
"winOrLose": "lose"
}


*/