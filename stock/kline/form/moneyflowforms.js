var klineutil = require("../klineutil");
var counter = 0;
function moneyFlowInOut(klineJson, i, stockid) {
    return true;
    return moneyFlowInOutB(klineJson, i, stockid)
}

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

function morningStarB_1(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_10-obj.netsummin_r0_20 <= 0.00*obj.amount_ave_21 
        && obj.netsummax_r0x_20>obj.netsummax_r0_20 + 0.05*obj.amount_ave_21 
        && obj.netsummin_r0x_5<obj.netsummin_r0_5
}

function morningStarB_2(klineJson, i) {

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
        
}

function morningStarB(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
            && morningStarB_2(klineJson, i) 
            && !(false
                 //|| morningStarB_1(klineJson, i) 
                // || morningStarA_2(klineJson, i) 
            ) 
}


function sidewaysCompression_1 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsummax_r0_10<0.05*obj.amount_ave_21
        && obj.netsummax_r0>2*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && klineJson[i].volume < 2.5 *klineJson[i].volume_ave_8 
        && 1.015*klineJson[i].open<klineJson[i].close
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

function sidewaysCompression_2 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsum_r0_10 > -0.02 * obj.amount_ave_21
        && obj.netsummax_r0_r0x_duration < 25
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21//0.5
        &&obj.netsummax_r0>2.3*obj.amount_ave_21
        && 1.018*klineJson[i].open<klineJson[i].close
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
        }(30,45,0.5)
}


function sidewaysCompression_3 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21
        && obj.netsummax_r0_40<0.02*obj.amount_ave_21
        && obj.netsummin_r0_20===-0*obj.amount_ave_21
        && obj.netsummax_r0_10===-0.0*obj.amount_ave_21
        && 1.015*klineJson[i].open<klineJson[i].close
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
    }(30,25,0.5)
}


function sidewaysCompression_4 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return true
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21
        && obj.netsummax_r0_10===obj.netsummax_r0_20
        && obj.netsum_r0_below<=0.0*obj.amount_ave_21
        && obj.netsummin_r0_40>-0.15*obj.amount_ave_21
        && obj.netsummax_r0x_10>0.25*obj.amount_ave_21
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
    }(38,40,0.5)
}

function sidewaysCompression_5 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && obj.netsummin_r0_40===-0*obj.amount_ave_21
        && obj.netsum_r0_below===0.0*obj.amount_ave_21
        //&& obj.netsum_r0x_10 > 0.05 * obj.amount_ave_21 // <<<<obj.netsummax_r0x_10>0.2*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.25*obj.amount_ave_21
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
    }(30,40,0.5)//(38,20,0.5)
}

function sidewaysCompression_6 (klineJson, i) {
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

function sidewaysCompression_7 (klineJson, i) {
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

function sidewaysCompression(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
         && (sidewaysCompression_1(klineJson, i) || 
            sidewaysCompression_2(klineJson, i)
         || sidewaysCompression_3(klineJson, i) 
         || sidewaysCompression_4(klineJson, i)
         || sidewaysCompression_5(klineJson, i)
         || sidewaysCompression_6(klineJson, i)
         || sidewaysCompression_7(klineJson, i)
         )
}


function redNGreenRed_1(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_10<=0.0*obj.amount_ave_21
        && obj.netsummin_r0_5===obj.netsummin_r0_10
        && obj.netsummin_r0_10===obj.netsummin_r0_20
    
}

function redNGreenRed(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_5<0.02*obj.amount_ave_21
        && obj.netsummin_r0_10>-0.02*obj.amount_ave_21
        && obj.netsummax_r0_5===obj.netsummax_r0_10
        && redNGreenRed_1(klineJson, i)
}

function moneyflow(klineJson, i) {
    var klj = klineJson[i];
    if (klj.date !== "07/28/2014") return false;
    //return true;
    var maxr0netsumidx = i-klj.netsummax_r0_duration;
   
    //var inc = klineutil.increase(klineJson[maxr0netsumidx].open, klineJson[i].close);
    var duration = klj.netsummax_r0_duration;

    
    var low_index_20 = klineutil.lowItemIndex(klineJson, i-20, i, "low");
    var low_index_40 = klineutil.lowItemIndex(klineJson, i-40, i-5, "low");
    var longDownNeedle = 0, longDownNeedleDates = [];
    var bigLowSmallVolume = 0, bigLowSmallVolumeDates = [];
    var bigDownBigAmount = 0; 
    for (var j=i; j>=1 && i-j<10; j--) {
        //if (!klineJson[j]) console.log("stockId", stockId, j, klineJson.length)
        if(klineutil.increase(klineJson[j].close, klineJson[j-1].close) > 0
            //&& klineutil.increase(klineJson[j].amount, klineJson[j-1].amount_ave_8)>0
            && (klineutil.increase(klineJson[j].low, klineJson[j-1].close) > 0.8*klineJson[j].amplitude_ave_21
            && klineutil.increase(klineJson[j].amount_ave_21, klineJson[j].amount) < -0.1
            && klineutil.increase(klineJson[j].low, klineJson[j-1].close) > 0.8*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j].amount_ave_8, klineJson[j].amount) < -0.1)) {
            bigLowSmallVolume++;
            bigLowSmallVolumeDates.push(klineJson[j].date)
            //if (stockId==="SH600012")
            //console.log(stockId, klineJson[j].date, klineutil.increase(klineJson[j].low, klineJson[j-1].close) , klineJson[j].inc_ave_8, klineJson[j].inc_ave_21)
        }
            
        // console.log(klineJson[j].date, 
        //     klineutil.increase(klineJson[j].close, klineJson[j].open),
        //     0.3*klineJson[j].amplitude_ave_21,
        //     klineutil.increase(klineJson[j].volume_ave_21, klineJson[j].volume),
        //     klineutil.increase(klineJson[j].volume_ave_8, klineJson[j].volume),
        //     klineutil.increase(klineJson[j-1].volume, klineJson[j].volume))
        
        if(i-j<5 && klineutil.increase(klineJson[j].close, klineJson[j].open) > 0
            && (klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.5*klineJson[j].amplitude_ave_21
            && klineutil.increase(klineJson[j].volume_ave_21, klineJson[j].volume) > 0.1
            || klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.5*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j].volume_ave_8, klineJson[j].volume) > 0.1
            || klineutil.increase(klineJson[j].close, klineJson[j].open) > 0.5*klineJson[j].amplitude_ave_8
            && klineutil.increase(klineJson[j-1].volume, klineJson[j].volume) > 0.1)) {
            bigDownBigAmount++;
            //console.log("------")
        }  

        // console.log(klineJson[j].date, klineutil.increase(klineJson[j].low, Math.min(klineJson[j].close, klineJson[j].open)), 0.5*klineJson[j].amplitude_ave_8,
        //     "+++", klineutil.increase(Math.max(klineJson[j].close, klineJson[j].open), klineJson[j].high))
        if ((klineutil.increase(klineJson[j].low, Math.min(klineJson[j].close, klineJson[j].open)) > 0.3*klineJson[j].amplitude_ave_8
            || klineutil.increase(Math.max(klineJson[j].close, klineJson[j].open), klineJson[j].high) > 0.3*klineJson[j].amplitude_ave_8)
            &&klineJson[j].r0_net>=0) {
            longDownNeedle++;
            longDownNeedleDates.push(klineJson[j].date)
        }
    }   
 // console.log( (longDownNeedle> 0 || bigLowSmallVolume>0)
 //        , i-low_index_40 > 10
 //        , klineJson[i].close > klineJson[low_index_40].low
 //        , klineutil.increase(klineJson[low_index_40].low, klineJson[i].close) < 5 * klineJson[i].inc_ave_21
 //        , klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>klj.amount_ave_21
 //        , klj.netsum_r0_20 + klj.netsum_r0x_20 , klj.netsum_r0_40 + klj.netsum_r0x_40
 //        , klj.netsum_r0_above+klj.netsum_r0x_above>0.5*klj.amount_ave_21
 //        , klj.netsum_r0_above_60> 0.5*klj.amount_ave_21
 //        , klj.netsum_r0_above > klj.netsum_r0_below, klj.amount_ave_8, klj.amount_ave_21)
    return  (duration>60
          && (longDownNeedle> 0 || bigLowSmallVolume>0)
        //  && longDownNeedle>0
        // && bigLowSmallVolume>0
         //&& bigDownBigAmount>=1
        
        // && i-low_index_20 > 13
        // && klineJson[i].close > 0.99*klineJson[low_index_20].low
        // && klineutil.increase(klineJson[low_index_20].low, klineJson[i].close) < 1.5*klineJson[i].amplitude_ave_21

        && i-low_index_40 > 10
        && klj.close > klineJson[low_index_40].low*0.99
        && klineutil.increase(klineJson[low_index_40].low, klj.close) < 2 * klj.amplitude_ave_21
        
        && klj.netsummax_r0+klj.netsummax_r0_netsum_r0x>klj.amount_ave_21
        && (klj.netsum_r0_20 > 0 || klj.netsum_r0_40 > 0)

        //&& klj.netsum_r0_above+klj.netsum_r0x_above>0.5*klj.amount_ave_21
        && klj.netsum_r0_above_60> 0.5*klj.amount_ave_21
        && klj.netsum_r0_above > klj.netsum_r0_below
        ) 
    
}

exports.moneyflow = moneyflow;

exports.sidewaysCompression = sidewaysCompression;
exports.moneyFlowInOut = moneyFlowInOut;
exports.wBottomA = wBottomA;
exports.wBottom = wBottom;
exports.headShoulderBottom = headShoulderBottom;
exports.morningStarA = morningStarA;
exports.morningStarB = morningStarB;
exports.redNGreenRed = redNGreenRed;