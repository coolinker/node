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

    var rel = obj.netsum_r0_above>obj.netsum_r0_below*1
        && obj.netsummin_r0_40 > -0.2*obj.amount_ave_21
        && obj.netsummax_r0_10 === obj.netsummax_r0_5
        && obj.netsum_r0_below<0.1*obj.amount_ave_21
        && obj.netsum_r0_below>-0.1*obj.amount_ave_21;

    return rel;
}

function wBottomA_2(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    var rel = obj.netsummax_r0_netsum_r0x<-0.5*obj.amount_ave_21
                && obj.netsummin_r0_40>-0.15*obj.amount_ave_21
                && obj.netsummax_r0_10<0.01*obj.amount_ave_21
                && obj.netsummax_r0_10>=0.0*obj.amount_ave_21

    return rel;
}

function wBottomA_3(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    var rel = obj.netsum_r0_below<0.1*obj.amount_ave_21
            && obj.netsummin_r0_20>-0.1*obj.amount_ave_21
            && obj.netsummax_r0_20<0.05*obj.amount_ave_21

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
    
}
exports.moneyFlowInOut = moneyFlowInOut;
exports.wBottomA = wBottomA;
exports.wBottom = wBottom;
exports.headShoulderBottom = headShoulderBottom;
exports.morningStarA = morningStarA;
exports.morningStarB = morningStarB;
exports.redNGreenRed = redNGreenRed;