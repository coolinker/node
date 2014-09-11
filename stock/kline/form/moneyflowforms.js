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

function wBottomA(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && (false
        ||wBottomA_1(klineJson, i) 
        ||wBottomA_2(klineJson, i) 
        || wBottomA_3(klineJson, i)
        || wBottomA_4(klineJson, i)
        || wBottomA_5(klineJson, i)
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

function wBottom(klineJson, i) {
    return true
         &&(false
         ||wBottom_1(klineJson, i) 
         || wBottom_2(klineJson, i)
         || wBottom_3(klineJson, i)
         || wBottom_4(klineJson, i)
         || wBottom_5(klineJson, i)
         || wBottom_6(klineJson, i)
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


// function redNGreenRed_1(klineJson, i) {

//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;

//     return obj.netsummax_r0_10<=0.0*obj.amount_ave_21
//         && obj.netsummin_r0_5===obj.netsummin_r0_10
//         && obj.netsummin_r0_10===obj.netsummin_r0_20
    
// }

// function redNGreenRed(klineJson, i) {

//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;

//     return obj.netsummax_r0_5<0.02*obj.amount_ave_21
//         && obj.netsummin_r0_10>-0.02*obj.amount_ave_21
//         && obj.netsummax_r0_5===obj.netsummax_r0_10
//         && redNGreenRed_1(klineJson, i)
// }

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

// function greenInRedA_2 (klineJson, i) { // greenInRedB
//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;

//     var inc_ave = klineJson[i].inc_ave_8;
//     return klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.028
//             && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -0.0
//             && klineutil.increase(klineJson[i-1].close, klineJson[i].open) < 0.02
//             && klineutil.increase(klineJson[i-1].close, klineJson[i].low) > -inc_ave*0.5
//             && klineutil.increase(klineJson[i-1].open-klineJson[i-1].close, klineJson[i].close-klineJson[i].open) < 0.6
//             && (function(){
//                 var higherItems = klineutil.higherItemsIndex(klineJson, i-100, i, "high", klineJson[i].high);
//                 return  i-higherItems[0] < 98;
//             }())

// }

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

// function greenInRed_3(klineJson, i) { //greenInRedD
//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;
    
//     var inc_ave = klineJson[i].inc_ave_8;
//     return true
//             && obj.amount_ave_21<1*obj.amount_ave_8
//             && obj.netsummax_r0_5===0.0*obj.amount_ave_21
//             && klineutil.increase(klineJson[i].open, klineJson[i].close) > 0.02
//             && klineutil.increase(klineJson[i-1].open, klineJson[i-1].close) < -0.0
//             //&& klineutil.increase(klineJson[i-1].close, klineJson[i].open) < 0.02
//             //&& klineutil.increase(klineJson[i-1].close, klineJson[i].low) > -inc_ave*0.6
//             && obj.netsum_r0_above>obj.netsum_r0_below*6
//             // && klineutil.increase(klineJson[i-1].volume, klineJson[i-2].volume) > -0.3
//             && klineutil.increase(klineJson[i-1].volume, klineJson[i].volume) < -0.15
            
// }

function greenInRed (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && (false
        || greenInRed_1(klineJson, i) 
        || greenInRed_2(klineJson, i) 
         )  
}


// function redGreenRed (klineJson, i) {
//     var obj = klineJson[i];
//     if (obj.netsummax_r0 === undefined) return false;

//     return true
//         && redGreenRed_1(klineJson, i) 
//         && !(false
//         // || greenInRed_1(klineJson, i) 
//         // || greenInRed_2(klineJson, i) 
//          )  
// }

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


function reversedHammer_4(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        

}

function reversedHammer (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && reversedHammer_4(klineJson, i)
        && !(false
        // || reversedHammer_1(klineJson, i) 
        // || reversedHammer_2(klineJson, i) 
        // || reversedHammer_3(klineJson, i) 
         )  
}

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