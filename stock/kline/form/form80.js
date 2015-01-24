var klineutil = require("../klineutil");

function sh600157_201412(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return true
        && function() {
            var lowamp = (Math.min(obj.open, obj.close)-obj.low)/obj.close;
            if (lowamp<0.5*obj.amplitude_ave_8) return false;
            if (obj.volume>1.2*obj.volume_ave_21) return false;
            var price = Math.max(klineJson[i-1].close, klineJson[i].open);
            var ploweritems = klineutil.lowerItemsIndex(klineJson, i-60, i, "low", price);
            var llowitems = klineutil.lowerItemsIndex(klineJson, i-60, i, "low", obj.low);
            if (!(ploweritems.length>=3 && llowitems.length===0)) return false; 
            if ((obj.netsummax_r0+obj.netsummax_r0_netsum_r0x)<100000000) return false;
            return true;
        }()
        // function() {
        //     var lowamp = (Math.min(obj.open, obj.close)-obj.low)/obj.close;
        //     if (lowamp<0.5*obj.amplitude_ave_8) return false;
        //     if (obj.volume>1.1*obj.volume_ave_21) return false;

        //     var price = Math.max(klineJson[i-1].close, klineJson[i].open);
        //     var supports = klineutil.getSpports(klineJson, i-1, price);
        //     var suparr = supports[0].split("@");
        //     var sups = Number(suparr[0]);
        //     var supp = Number(suparr[1]);
        //     console.log("-==", obj.date, sups, supp, obj.low, obj.amplitude_ave_8)
        //     return (sups>=5 && supp>obj.low) 
        // }();
}
exports.sh600157_201412 = sh600157_201412;

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
