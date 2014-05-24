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

function wBottom(klineJson, i) {
    var obj = klineJson[i];
    if (obj.netsummax_r0 === undefined) return false;

    return obj.netsummax_r0_10<=0.0*obj.amount_ave_21
        && obj.netsummin_r0_10> -0.05*obj.amount_ave_21

}


exports.moneyFlowInOut = moneyFlowInOut;
exports.wBottomA = wBottomA;
exports.wBottom = wBottom;