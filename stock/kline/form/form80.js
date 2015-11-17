var klineutil = require("../klineutil");


function wBottom_e_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.close_ave_8<obj.close_ave_144//48 0.799 2768/14795
&& !(obj.netsummax_r0_40+obj.netsummin_r0x_40>0)//18 0.794 3065/15689
&& obj.netsummax_r0_10===obj.netsummax_r0_20//14 0.783 3577/16777
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//1 0.763 6396/23507
&& obj.netsummax_r0>2.3*obj.amount_ave_21//1 0.742 11560/35767
&& obj.marketCap < 2500000000//2 0.708 27136/68288
&& obj.netsum_r0_above>obj.netsum_r0_below*6//0 0.681 58793/112641
 && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 
}
exports.wBottom_e_0 = wBottom_e_0//Sun Mar 22 2015 23:12:55 GMT+0800 (中国标准时间)

function wBottom_f_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsummax_r0_20>0.3*obj.amount_ave_21)//100 0.798 3146/18372
&& !(obj.netsum_r0_below_60>0.03*obj.amount_ave_21)//16 0.794 3373/19318
&& obj.marketCap < 2500000000//13 0.780 4835/22874
&& obj.amount_ave_21<1.05*obj.amount_ave_8//2 0.763 7452/28535
&& obj.netsummax_r0>1.5*obj.amount_ave_21//2 0.732 18923/53129
&& !(obj.netsummax_r0_5>0.03*obj.amount_ave_21)//2 0.707 37625/88146
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.680 75452/139967
&& obj.marketCap < 4000000000//0 0.656 129068/200534
 && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.2) 
}
exports.wBottom_f_0 = wBottom_f_0//Sun Mar 22 2015 16:05:19 GMT+0800 (中国标准时间)


function wBottom_g_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsum_r0x_40<-0.1*obj.amount_ave_21//83 0.799 4300/20597
&& !(obj.netsummin_r0_5<-0.05*obj.amount_ave_21)//19 0.794 4764/21736
&& obj.netsummax_r0_duration>40//34 0.782 5839/25393
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21//1 0.768 7749/29026
&& obj.netsummax_r0_10===-0.0*obj.amount_ave_21//0 0.730 20300/57347
&& !(obj.netsum_r0_below>0.0*obj.amount_ave_21)//2 0.695 50118/101895
&& obj.marketCap < 4000000000//0 0.662 118233/187805
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
exports.wBottom_g_0 = wBottom_g_0//Sun Mar 22 2015 04:03:09 GMT+0800 (中国标准时间)

function wBottom_h_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_duration>80//74 0.798 3322/13169
&& !(obj.amount_ave_21<0.5*obj.amount)//5 0.793 3634/14082
&& obj.netsummax_r0x_20>0.1*obj.amount_ave_21//10 0.778 5061/17104
&& obj.marketCap < 4000000000//0 0.757 11121/34809
&& obj.netsummax_r0>2.2*obj.amount_ave_21//1 0.733 17536/43723
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.705 38183/82477
&& obj.netsum_r0_above>obj.netsum_r0_below*6//0 0.680 64955/112626
 && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 
}
exports.wBottom_h_0 = wBottom_h_0//Tue Mar 10 2015 23:32:46 GMT+0800 (中国标准时间)


function wBottom_i_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//100 0.798 5559/18678
&& obj.netsummax_r0_duration>40//3 0.794 6019/19833
&& obj.netsum_r0_below===0.0*obj.amount_ave_21//0 0.762 11238/26704
&& obj.amount_ave_21<1.05*obj.amount_ave_8//1 0.733 18273/38834
&& !(obj.netsum_r0_below>0.0*obj.amount_ave_21)//1 0.686 57454/92628
 && function(m, n, p1, p2) {
        var rightBottomIdx = klineutil.lowItemIndex(klineJson, i - n, i, "low");
        var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx - n, rightBottomIdx, "high");
        var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx - n, midTopIdx, "low");
        var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx - m, leftBottomIdx, "high");
        return klineutil.increase(klineJson[midTopIdx].high, klineJson[i].close) > p1
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > p2
    } (30,5, -0.3, 0.25) 

}
exports.wBottom_i_0 = wBottom_i_0//Tue Mar 10 2015 10:34:10 GMT+0800 (中国标准时间)

function headShoulderBottom_2_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsum_r0x_80>0.1*obj.amount_ave_21)//95 0.799 3002/13183
&& !(obj.netsummax_r0_20>0.5*obj.amount_ave_21)//29 0.796 3208/14098
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21//23 0.785 3769/15033
&& obj.netsummin_r0_10===obj.netsummin_r0_20//8 0.772 5096/19432
&& !(obj.close_ave_144<1.05*obj.close)//3 0.751 8866/27312
&& obj.netsummax_r0>1.5*obj.amount_ave_21//0 0.732 14647/39824
&& !(obj.netsum_r0_below>0.0*obj.amount_ave_21)//0 0.702 32627/71964
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.671 69573/122779
&& obj.marketCap < 4000000000//0 0.649 102329/158806
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
exports.headShoulderBottom_2_0 = headShoulderBottom_2_0//Mon Mar 09 2015 22:02:00 GMT+0800 (中国标准时间)

function morningStarB_1_0(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsum_r0x_80>obj.netsum_r0_80)//120 0.799 3932/13394
&& !(obj.turnover_ave_21>1.2*obj.turnover)//1 0.796 4014/13664
&& !(obj.amount_ave_8<0.5*obj.amount)//2 0.777 5363/17150
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21//2 0.763 6382/18898
&& obj.amount_ave_21<0.95*obj.amount_ave_8//0 0.736 12415/31548
&& !(obj.netsummax_r0_20>0.3*obj.amount_ave_21)//2 0.712 21698/49880
&& !(obj.netsummin_r0_10<-0.05*obj.amount_ave_21)//1 0.691 33195/64215
&& obj.amount_ave_21<1.05*obj.amount_ave_8//0 0.661 67080/106104
&& obj.marketCap < 4000000000//0 0.635 137777/196319
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.601 244673/306674
 && function(m, n, k){
            var midhigh = Math.max(klineJson[i-1].open, klineJson[i-1].close);
            var lower = klineutil.lowerItemsIndex(klineJson, i-m, i-2, "low", klineJson[i-2].high);

            return klineutil.increase(midhigh, klineJson[i-2].close) > -klineJson[i].amplitude_ave_8*n
                && lower.length<k
        }(75, 10, 22)
}
exports.morningStarB_1_0 = morningStarB_1_0//Sun Mar 08 2015 21:27:43 GMT+0800 (中国标准时间)

function sz002424_201401_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.close_ave_8<obj.close_ave_144//88 0.798 4340/17652
&& obj.netsum_r0_below_60>obj.netsum_r0x_below_60//6 0.793 4776/18766
&& obj.close_ave_8<obj.close_ave_233//6 0.777 6725/21224
&& !(obj.netsum_r0_10<-0.02*obj.amount_ave_21)//1 0.760 9093/25733
&& obj.netsummax_r0_10===-0.0*obj.amount_ave_21//1 0.727 19275/40267
&& obj.netsum_r0_below>obj.netsum_r0x_below//2 0.680 62658/92671
&& obj.marketCap < 3000000000//0 0.653 129975/180540
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
exports.sz002424_201401_1_0 = sz002424_201401_1_0//Sun Mar 08 2015 19:16:38 GMT+0800 (中国标准时间)

function bullPulsing_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//33 0.799 3029/12456
&& !(obj.netsum_r0_20>0.08*obj.amount_ave_21)//4 0.793 3284/13274
&& !(obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0)//5 0.780 4618/16909
&& obj.netsummax_r0>obj.amount_ave_21//2 0.766 6584/23442
&& !(obj.close_ave_144<1.05*obj.close)//0 0.750 10845/33243
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.720 29717/69362
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//0 0.695 50128/91999
&& obj.marketCap < 2500000000//0 0.654 113407/163124
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
exports.bullPulsing_1_0 = bullPulsing_1_0//Sun Mar 08 2015 14:23:11 GMT+0800 (中国标准时间)

function lowRedsB_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    
    return !(obj.amount_ave_8<0.5*obj.amount)//18 0.799 2357/11969
&& !(obj.turnover_ave_8>1.2*obj.turnover)//15 0.790 2738/12999
&& !(obj.netsummin_r0_10>obj.netsummin_r0_20)//2 0.778 3958/18166
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.2*obj.amount_ave_21//0 0.761 6687/23481
&& obj.netsum_r0_10<0.05*obj.amount_ave_21//0 0.739 12315/38136
&& obj.marketCap < 2000000000//0 0.712 26620/59093
&& obj.amount_ave_21<1.05*obj.amount_ave_8//0 0.687 45115/85999
&& obj.marketCap < 3000000000//0 0.649 102391/157345
 && function (a, b, c) {    
            var higherItems = klineutil.higherItemsIndex(klineJson, i-a, i, "low", klineJson[i].high);
            return i-higherItems[higherItems.length-1] > b && higherItems.length>c;
        }(55, 10, 20)
}
exports.lowRedsB_1_0 = lowRedsB_1_0//Sun Mar 08 2015 13:43:39 GMT+0800 (中国标准时间)

function flatBottom_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//55 0.798 2280/15606
&& obj.netsummax_r0_10===-0.0*obj.amount_ave_21//3 0.793 2466/16568
&& obj.amount_ave_21<0.95*obj.amount_ave_8//9 0.776 4054/19333
&& obj.netsum_r0_below===0.0*obj.amount_ave_21//0 0.761 5983/25898
&& !(obj.netsum_r0_below>0.0*obj.amount_ave_21)//2 0.732 12000/37572
&& !(obj.netsummax_r0_5>0.03*obj.amount_ave_21)//0 0.698 27093/61009
&& obj.amount_ave_21<1.05*obj.amount_ave_8//0 0.663 59245/99495
&& obj.marketCap < 3000000000//0 0.630 125432/178856
 && function (a, b, c, d, e) {
        var td = i-a;
        var inc_ave = klineJson[i].inc_ave_8;
        var hidx = klineutil.highItemIndex(klineJson, td-b, td, "close");
        var higherItems = klineutil.higherItemsIndex(klineJson, td-c, i, "close", klineJson[i].close);
        
        return klineutil.increase(klineJson[i].close, klineJson[hidx].close) > inc_ave*d
            && higherItems.length<e;
    
    }(1,40,13,6,7)

}
exports.flatBottom_1_0 = flatBottom_1_0//Sun Mar 08 2015 13:07:54 GMT+0800 (中国标准时间)

function hammer_1_0(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//7 0.799 1665/10199
&& obj.amount_ave_8<1.5*obj.amount//2 0.791 1834/10892
&& !(obj.netsummin_r0_40<-0.05*obj.amount_ave_21)//1 0.777 2462/12886
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.1*obj.amount_ave_21//2 0.756 5044/22133
&& !(obj.netsummin_r0_10<-0.05*obj.amount_ave_21)//3 0.731 12671/46572
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//0 0.709 24742/65666
&& obj.amount_ave_21<1.05*obj.amount_ave_8//0 0.654 82751/132716
&& obj.marketCap < 3000000000//0 0.616 177476/243927
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
exports.hammer_1_0 = hammer_1_0//Sun Mar 01 2015 16:52:35 GMT+0800 (中国标准时间)

function reversedHammer_1_0(klineJson, i) {
     var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//98 0.799 2720/12672
&& obj.marketCap < 2500000000//39 0.796 2820/13229
&& !(obj.netsummax_r0_10>0.05*obj.amount_ave_21)//16 0.785 3565/14839
&& obj.netsummax_r0>1.5*obj.amount_ave_21//1 0.769 5329/18478
&& !(obj.netsummin_r0_40<-0.15*obj.amount_ave_21)//2 0.745 9633/29590
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.716 22131/55448
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//1 0.689 34612/69960
&& obj.marketCap < 4000000000//0 0.650 91408/135263
 && function(a, b, c, d, e) {
                var hidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
                var higherItems = klineutil.higherItemsIndex(klineJson, i-b, i, "close", klineJson[i].low);
                return true
                    && higherItems.length>c 
                    && higherItems.length<d
                    && klineutil.increase(klineJson[i].high, klineJson[hidx].close) > e
            }(55, 20, 0, 15, 5*klineJson[i].amplitude_ave_8)

}
exports.reversedHammer_1_0 = reversedHammer_1_0//Fri Feb 27 2015 10:38:11 GMT+0800 (中国标准时间)

function smallRedsAndGreensA_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.amount_ave_8<0.5*obj.amount)//12 0.799 5801/19811
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.5*obj.amount_ave_21//6 0.793 6222/21156
&& obj.netsum_r0_below_60===0.0*obj.amount_ave_21//7 0.777 8973/26584
&& !(obj.netsummin_r0_20<-0*obj.amount_ave_21)//3 0.760 13574/35346
&& !(obj.netsum_r0_10<-0.02*obj.amount_ave_21)//2 0.736 24432/50772
&& !(obj.netsummax_r0_10>0.05*obj.amount_ave_21)//3 0.702 46631/78902
&& obj.amount_ave_21<1.5*obj.amount//2 0.669 96573/138856
&& obj.marketCap < 3800000000//2 0.644 126945/173828
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
exports.smallRedsAndGreensA_1_0 = smallRedsAndGreensA_1_0//Sat Jan 03 2015 09:38:16 GMT+0800 (中国标准时间)

function redNGreenRed_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.netsummax_r0_20>0.5*obj.amount_ave_21)//97 0.798 7344/18128
&& !(obj.amount_ave_8<0.5*obj.amount)//61 0.791 8448/19799
&& (obj.close_ave_8<1.2*obj.close_ave_21)//0 0.781 9363/21245
&& !(obj.close_ave_8<obj.close_ave_21)
&& obj.marketCap < 2500000000//0 0.708 38199/67413
&& obj.turnover_ave_8>0.78*obj.turnover_ave_21//2 0.640 104082/140424
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
exports.redNGreenRed_1_0 = redNGreenRed_1_0//Mon Dec 29 2014 00:06:49 GMT+0800 (中国标准时间)

function sidewaysCompression_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
&& obj.amount_ave_21<1.07*obj.amount_ave_8//2 0.796 7607/24033
&& !(obj.netsum_r0_10<-0.0*obj.amount_ave_21)//2 0.772 13674/34840
&& obj.netsummin_r0x_5-obj.netsummin_r0x_10<0.3*obj.amount_ave_21//0 0.748 22434/47721
&& obj.netsummax_r0_10===-0.0*obj.amount_ave_21//1 0.680 89609/135555
&& obj.marketCap < 2500000000//1 0.644 202443/260716
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
exports.sidewaysCompression_1_0 = sidewaysCompression_1_0//Sun Dec 28 2014 13:04:11 GMT+0800 (中国标准时间)

function morningStarA_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.close_ave_8<1.03*obj.close//142 0.798 7466/18259
&& obj.amount_ave_21<1.5*obj.amount//46 0.795 7739/18766
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//10 0.779 9493/21591
&& obj.amount_ave_21<1.02*obj.amount_ave_8//3 0.750 15618/29223
&& obj.netsummin_r0_20===-0*obj.amount_ave_21//1 0.683 47050/69279
&& obj.marketCap < 2500000000//1 0.626 140459/174894
 && function (m, n, k){
            var lower = klineutil.lowerItemsIndex(klineJson, i-k, i-3, "close", klineJson[i].close);
             return i - lower[0]>m && i - lower[0] < n
        }(4, 23, 45)

}
exports.morningStarA_1_0 = morningStarA_1_0//Fri Dec 26 2014 19:39:27 GMT+0800 (中国标准时间)

function headShoulderBottom_a_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return !(obj.close_ave_144<1.05*obj.close)//0 0.800 5128/14899
&& obj.netsummax_r0>obj.amount_ave_21//3 0.770 9190/23100
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.746 15259/33571
&& obj.netsummax_r0_5===0.0*obj.amount_ave_21//0 0.709 25638/45305
&& obj.marketCap < 4000000000//1 0.665 57720/81266
 &&  function(a, b, c, n) {
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
exports.headShoulderBottom_a_0 = headShoulderBottom_a_0//Wed Dec 24 2014 19:50:47 GMT+0800 (中国标准时间)

function sh600716_201410_1_0(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.close_ave_21<1.03*obj.close//120 0.801 6564/11596
&& obj.netsummin_r0_20===-0*obj.amount_ave_21//15 0.795 6868/11948
&& !(obj.netsummin_r0_40<-0*obj.amount_ave_21)//3 0.773 8791/14225
&& !(obj.close_ave_8<obj.close_ave_21)//4 0.723 25692/38385
&& obj.turnover_ave_8>0.8*obj.turnover_ave_21//0 0.674 94762/127919
&& obj.marketCap < 3000000000//0 0.643 154039/189873
 && function(a, b, c, d, e){
            // return true;
            var highidx = klineutil.highItemIndex(klineJson, i-a, i, "close");
            if (klineutil.increase(obj.close, klineJson[highidx].close) < b*klineJson[highidx].amplitude_ave_21) 
                return false;
            if (obj.amount_ave_21 > c*klineJson[highidx].amount_ave_21)
                return false;

            var lowerItems = klineutil.lowerItemsIndex(klineJson, highidx-d, highidx, "close", obj.close);
            var fstlowidx = lowerItems.length === 0 ? Math.max(0, highidx-d) : lowerItems[lowerItems.length-1];
            var r0sum = 0, r0xsum = 0;
            for (var j=fstlowidx; j<=i; j++) {
                r0sum += klineJson[j].r0_net;
                r0xsum += (klineJson[j].netamount-klineJson[j].r0_net);
            }
            return r0sum> e*obj.amount_ave_21
        }(50, 5, 1, 120, 0.3)
 }
exports.sh600716_201410_1_0 = sh600716_201410_1_0//Sun Dec 21 2014 12:24:55 GMT+0800 (中国标准时间)

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
