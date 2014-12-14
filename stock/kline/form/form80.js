var klineutil = require("../klineutil");

function wBottomA_a_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.turnover_ave_8 > 0.8 * obj.turnover_ave_21 //0.804 20059/20059
        && obj.netsum_r0_above > obj.netsum_r0_below * 4 //0.779 24612/24612
        && obj.netsummax_r0_5 === 0.0 * obj.amount_ave_21 //0.753 32123/32123
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > 0.2 * klineJson[i].amplitude_ave_21 && klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(30, 0.3)
}
exports.wBottomA_a_0 = wBottomA_a_0 //Sun Nov 30 2014 08:13:42 GMT+0800 (中国标准时间)

function wBottomA_b_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsum_r0_below > -0.02 * obj.amount_ave_21 //0.800 16820/24941
        && obj.turnover_ave_8 > 0.8 * obj.turnover_ave_21 //0.797 17481/26096
        && obj.netsummax_r0_10 === -0.0 * obj.amount_ave_21 //0.773 24490/33105
        && !(obj.netsummin_r0_20 < -0 * obj.amount_ave_21) //0.762 30210/40737
        && obj.netsummax_r0_5 === 0.0 * obj.amount_ave_21 //0.701 78249/98309
        && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
        }(40, 0.3)
}
exports.wBottomA_b_0 = wBottomA_b_0 //Sun Nov 30 2014 12:54:45 GMT+0800 (中国标准时间)

function wBottomA_c_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsummin_r0x_40>obj.netsummin_r0_40)//162 0.800 11746/21271
&& !(obj.netsummax_r0_40+obj.netsummin_r0x_40>0)//17 0.799 11826/21352
&& obj.amount_ave_21<1.5*obj.amount_ave_8//43 0.785 13524/23451
&& obj.close_ave_8<obj.close_ave_233//44 0.775 15280/25217
&& obj.netsummax_r0>obj.amount_ave_21//13 0.764 17577/28655
&& !(obj.netsummin_r0_20<-0.1*obj.amount_ave_21)//0 0.747 21723/35615
&& obj.netsum_r0_above>obj.netsum_r0_below*6//0 0.708 42471/61454
 && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n
                && klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > -0.8 * klineJson[i].amplitude_ave_21
        }(30,0.32)
}
exports.wBottomA_c_0 = wBottomA_c_0//Sun Nov 30 2014 23:07:35 GMT+0800 (中国标准时间)


function wBottomA_e_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//85 0.801 11312/20851
&& !(obj.netsummin_r0_5<-0.05*obj.amount_ave_21)//8 0.796 12021/22079
&& !(obj.netsum_r0_below>0.0*obj.amount_ave_21)//4 0.773 16731/27961
&& obj.amount_ave_21<1*obj.amount_ave_8//0 0.745 25158/39649
&& obj.amount_ave_21<1.5*obj.amount//2 0.700 56731/80407
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//0 0.662 97574/128087
 && function(m, n) {
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);

            var outerHigh = klineutil.highItem(klineJson, leftBottom - m, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh) > n* klineJson[leftBottom].amplitude_ave_21
        }(25,6)
}
exports.wBottomA_e_0 = wBottomA_e_0


function wBottom_a_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsummax_r0_40+obj.netsummin_r0x_40>0)//133 0.800 10487/22703
&& obj.netsummax_r0_duration>80//32 0.797 10953/23491
&& obj.netsummax_r0_10===-0.0*obj.amount_ave_21//44 0.786 13260/28170
&& obj.amount_ave_21<1.5*obj.amount_ave_8//26 0.775 16973/34147
&& obj.netsummax_r0x_20>0.05*obj.amount_ave_21//2 0.760 20675/37861
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//0 0.715 46796/76274
&& obj.netsum_r0_above>obj.netsum_r0_below*6//1 0.665 113492/150472
 && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (25,10, -1.25,0.18) 
}
exports.wBottom_a_0 = wBottom_a_0//Sat Dec 13 2014 16:56:58 GMT+0800 (中国标准时间)
