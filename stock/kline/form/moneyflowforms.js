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
function wBottomA_1 (klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    
    var rel = obj.netsummin_r0_10===obj.netsummin_r0_20
        && obj.netsum_r0_below<0.01*obj.amount_ave_21
        && obj.netsummax_r0_10===0.0*obj.amount_ave_21
        && function(){
            var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
            var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
            var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
            var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
            return klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.25
                && klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) > 0.4*klineJson[i].amplitude_ave_21
        }()
    return rel;
}

function wBottomA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    var rel = true 
                && obj.netsummin_r0_40>=-0.0*obj.amount_ave_21
                && obj.netsummax_r0_40<=0.1*obj.amount_ave_21
                && function(){
                    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
                    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
                    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
                    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
                    return klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.2
                        && klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) >-0.5*klineJson[i].amplitude_ave_21
                }()

    return rel;
}

function wBottomA_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    var rel = true 
                && obj.netsummax_r0+obj.netsummax_r0_netsum_r0x<0
                && obj.netsum_r0_above>obj.netsum_r0_below*1.5
                && obj.netsummax_r0x_5<obj.netsummax_r0x_10
                && obj.netsummax_r0_20<0.1*obj.amount_ave_21
                && obj.netsum_r0_20>-0.05*obj.amount_ave_21
                && function(){
                    var rightBottom = klineutil.lowIndexOfUpTrend(klineJson, i);
                    var middleTop = klineutil.highIndexOfDownTrend(klineJson, rightBottom);
                    var leftBottom = klineutil.lowIndexOfUpTrend(klineJson, middleTop);
                    var outerHigh = klineutil.highItem(klineJson, leftBottom-30, leftBottom, "high");
                    return klineutil.increase(klineJson[leftBottom].high, outerHigh)>0.25
                        && klineutil.increase(klineJson[leftBottom].low, klineJson[rightBottom].low) >0.4*klineJson[i].amplitude_ave_21
                }()

    return rel;
}

function wBottomA(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;
    return (wBottomA_1(klineJson, i) || wBottomA_2(klineJson, i) || wBottomA_3(klineJson, i));
}

function wBottom_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_10<=0.03*obj.amount_ave_21
        && obj.netsummin_r0_10> -0.08*obj.amount_ave_21
}

function wBottom_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_20<0.1*obj.amount_ave_21
        && obj.netsummin_r0_5>-0.05*obj.amount_ave_21
        && obj.netsum_r0_below<0.2*obj.amount_ave_21

}

function wBottom_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_5===obj.netsummax_r0_10
        && obj.netsummin_r0_40>-0.3*obj.amount_ave_21
        && obj.netsum_r0_below<0.05*obj.amount_ave_21
}

function wBottom_4(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsum_r0_above>obj.netsum_r0_below*1
        && obj.netsum_r0_below>-0.5*obj.amount_ave_21
        && obj.netsummax_r0_10===0.0*obj.amount_ave_21
}


function wBottom(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    var rightBottomIdx = klineutil.lowItemIndex(klineJson, i-10, i, "low");
    var midTopIdx = klineutil.highItemIndex(klineJson, rightBottomIdx-10, rightBottomIdx, "high");
    var leftBottomIdx = klineutil.lowItemIndex(klineJson, midTopIdx-10, midTopIdx, "low");
    var leftTopIdx = klineutil.highItemIndex(klineJson, leftBottomIdx-30, leftBottomIdx, "high");

    return true
            && obj.netsummax_r0x_40>obj.netsummax_r0_40 //81%2224 
            && obj.netsummax_r0_10<=0.0*obj.amount_ave_21 //81.5% 2846 
            //&& obj.netsum_r0_below<=0.0*obj.amount_ave_21 //81.4%2848
            && obj.netsummax_r0x_20>obj.netsummax_r0_20
            && obj.netsummin_r0_20===-0*obj.amount_ave_21
            && klineutil.increase(obj.close_ave_21, obj.close_ave_8)<-0.05
            && klineutil.increase(klineJson[midTopIdx].high, klineJson[leftTopIdx].high) > 0.25;

////////////////////////
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return wBottom_1(klineJson, i) 
        || wBottom_2(klineJson, i)
        || wBottom_3(klineJson, i)
        || wBottom_4(klineJson, i)
}

function headShoulderBottom_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_10===obj.netsummin_r0_20
        && obj.netsummax_r0_10===obj.netsummax_r0_20
        && obj.netsummax_r0_40<0.1*obj.amount_ave_21

}

function headShoulderBottom_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_10<=0.0*obj.amount_ave_21
        && obj.netsummin_r0_20>-0.1*obj.amount_ave_21
        && obj.netsummin_r0x_5-obj.netsummin_r0x_10 < 0.3*obj.amount_ave_21
}

function headShoulderBottom_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_40>-0.08*obj.amount_ave_21
        && obj.netsummax_r0x_40>0.9*obj.netsummax_r0_40
}

function headShoulderBottom(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return headShoulderBottom_1(klineJson, i)
          || headShoulderBottom_2(klineJson, i)
          || headShoulderBottom_3(klineJson, i)
}

function morningStarA_1(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_20>-0.1*obj.amount_ave_21
        && obj.netsummin_r0_20<0.02*obj.amount_ave_21
        && obj.netsummax_r0x_20>obj.netsummax_r0_20
        && obj.netsum_r0_above>obj.netsum_r0_below*1.5
        && obj.netsummin_r0x_5-0.3*obj.netsummin_r0x_10<0
}

function morningStarA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummin_r0_5===obj.netsummin_r0_10
    && obj.netsummax_r0x_5>0.1*obj.netsummax_r0_5
    && obj.netsummin_r0_10===obj.netsummin_r0_20
    && obj.netsummax_r0x_40>obj.netsummax_r0_40 - 0.1*obj.amount_ave_21
    && obj.netsummin_r0x_5<-0.05*obj.amount_ave_21
}

function morningStarA_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0x_5>0.07*obj.amount_ave_21
            && obj.netsummax_r0_10<=0.0*obj.amount_ave_21
            && obj.netsummin_r0_40>-0.1*obj.amount_ave_21 
}

function morningStarA(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return  morningStarA_1(klineJson, i) 
         || morningStarA_2(klineJson, i)
         || morningStarA_3(klineJson, i)

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

function morningStarB(klineJson, i) {

    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return morningStarB_1(klineJson, i)
         || morningStarB_2(klineJson, i)
    
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

exports.moneyFlowInOut = moneyFlowInOut;
exports.wBottomA = wBottomA;
exports.wBottom = wBottom;
exports.headShoulderBottom = headShoulderBottom;
exports.morningStarA = morningStarA;
exports.morningStarB = morningStarB;
exports.redNGreenRed = redNGreenRed;