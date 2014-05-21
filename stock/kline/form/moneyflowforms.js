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

function wBottomA (klineJson, i) {
    var obj = {};

    processMoneyFlowInOut(klineJson, i, obj);
    
    var rel = obj.netsummax_r0_duration>40
        && obj.netsummax_r0+obj.netsummax_r0_netsum_r0x<0
        //&& obj.netsummax_r0x_20 < klineJson[i].amount_ave_21
        /*&& obj.netsummax_r0x_20 > obj.netsummax_r0_20
        && obj.netsummin_r0_20 >= -0.01*klineJson[i].amount_ave_21
        && obj.netsum_r0_above>obj.netsum_r0_below*1.5;
*/
    return rel;

    if (false && klineJson[i].date==="11/14/2011") {

        console.log(toFixedString(obj.netsummax_r0_5<2000000, 5), 
            toFixedString(obj.netsummax_r0_10<2000000, 5), 
            toFixedString(obj.netsummax_r0x_5>0, 5),
            toFixedString(obj.netsummax_r0x_5 === obj.netsummax_r0x_10, 5),
            toFixedString(obj.netsummin_r0x_5 < 0, 5),
            toFixedString(obj.netsummin_r0x_10 < 0, 5),
            toFixedString(obj.netsummin_r0x_20 < 0, 5)

            )
    }
    return rel
}

function processMoneyFlowInOut(klineJson, i, obj) {
    var sec = 150;
    if (i<sec) return false;
    if (klineJson[i-sec].r0_net===undefined) return false;

    var netsum_r0 = 0;
    var netsum_r0x = 0;
    var maxnetsumidx_r0 = -1;

    var netsummin_r0x = 100000000000;
    var netsummin_r0x_5 = 0, netsummin_r0x_10 = 0, netsummin_r0x_20 = 0, netsummin_r0x_40 = 0;

    var netsummax_r0x = -100000000000;
    var netsummax_r0x_5 = 0, netsummax_r0x_10 = 0, netsummax_r0x_20 = 0, netsummax_r0x_40 = 0;

    var netsummax_r0 = -100000000000;
    var netsummax_r0_5 = 0, netsummax_r0_10 = 0, netsummax_r0_20 = 0, netsummax_r0_40 = 0;

    var netsummin_r0 = 100000000000;
    var netsummin_r0_5 = 0, netsummin_r0_10 = 0, netsummin_r0_20 = 0, netsummin_r0_40 = 0;


    var netsum_r0_above = 0, netsum_r0_below = 0;
    var netsum_r0_above_60 = 0, netsum_r0_below_60 = 0;
    var netsum_r0x_above = 0, netsum_r0x_below = 0;
    var netsum_r0x_above_60 = 0, netsum_r0x_below_60 = 0;

    var currentprice = klineJson[i].close;
    var netsummax_idx_r0 = -1;

    for (var j = i; j>=0 && i-j<=sec; j--) {

        if (i-j === 5) {
            netsummax_r0_5 = netsummax_r0;
            netsummin_r0_5 = netsummin_r0;
            netsummin_r0x_5 = netsummin_r0x;
            netsummax_r0x_5 = netsummax_r0x
        } else if (i-j === 10) {
            netsummax_r0_10 = netsummax_r0;
            netsummin_r0_10 = netsummin_r0;
            netsummin_r0x_10 = netsummin_r0x;
            netsummax_r0x_10 = netsummax_r0x
        } else if (i-j === 20) {
            netsummax_r0_20 = netsummax_r0;
            netsummin_r0_20 = netsummin_r0;
            netsummin_r0x_20 = netsummin_r0x;
            netsummax_r0x_20 = netsummax_r0x
        } else if (i-j === 40) {
            netsummax_r0_40 = netsummax_r0;
            netsummin_r0_40 = netsummin_r0;
            netsummin_r0x_40 = netsummin_r0x;
            netsummax_r0x_40 = netsummax_r0x
        }

        var klj = klineJson[j];
        var r0x_net = klj.netamount-klj.r0_net;

        var midprice = (klj.high+klj.low)/2;
        if (midprice>currentprice) {
            netsum_r0_above += klj.r0_net;
            netsum_r0x_above += r0x_net;
            if (i-j<60) {
                netsum_r0_above_60 += klj.r0_net;
                netsum_r0x_above_60 += r0x_net;
            }
        }

        if (midprice<currentprice) {
            netsum_r0_below += klj.r0_net;
            netsum_r0x_below += r0x_net;
            if (i-j<60) {
                netsum_r0_below_60 += klj.r0_net;
                netsum_r0x_below_60 += r0x_net;
            }
        }

        netsum_r0 += klj.r0_net;
        netsum_r0x += r0x_net;

        if (netsum_r0 < netsummin_r0) {
            netsummin_r0 = netsum_r0;
        }
        if (netsum_r0 > netsummax_r0) {
            netsummax_r0 = netsum_r0;
            netsummax_idx_r0 = j;
            netsummax_r0_netsum_r0x = netsum_r0x;
        }

        if (netsum_r0x < netsummin_r0x) {
            netsummin_r0x = netsum_r0x;
        }

        if (netsum_r0x > netsummax_r0x) {
            netsummax_r0x = netsum_r0x;
        }

    }

    if (netsummax_idx_r0===-1) console.log("error netsummax_idx_r0 should not be -1");

    obj.netsummax_r0_duration = i-netsummax_idx_r0;
    obj.netsummax_r0_netsum_r0x = netsummax_r0_netsum_r0x;

    obj.netsummax_r0 = netsummax_r0;
    obj.netsummax_r0_5 = netsummax_r0_5;
    obj.netsummax_r0_10 = netsummax_r0_10;
    obj.netsummax_r0_20 = netsummax_r0_20;
    obj.netsummax_r0_40 = netsummax_r0_40;
    
    obj.netsummin_r0 =  netsummin_r0;
    obj. netsummin_r0_5 =  netsummin_r0_5;
    obj. netsummin_r0_10 =  netsummin_r0_10;
    obj. netsummin_r0_20 =  netsummin_r0_20;
    obj. netsummin_r0_40 =  netsummin_r0_40;

    obj.netsummax_r0x = netsummax_r0x;
    obj.netsummax_r0x_5 = netsummax_r0x_5;
    obj.netsummax_r0x_10 = netsummax_r0x_10;
    obj.netsummax_r0x_20 = netsummax_r0x_20;
    obj.netsummax_r0x_40 = netsummax_r0x_40;

    obj. netsummin_r0x =  netsummin_r0x;
    obj. netsummin_r0x_5 =  netsummin_r0x_5;
    obj. netsummin_r0x_10 =  netsummin_r0x_10;
    obj. netsummin_r0x_20 =  netsummin_r0x_20;
    obj. netsummin_r0x_40 =  netsummin_r0x_40;

    obj.netsum_r0_above = netsum_r0_above;
    obj.netsum_r0_above_60 = netsum_r0_above_60;
    obj.netsum_r0_below = netsum_r0_below;
    obj.netsum_r0_below_60 = netsum_r0_below_60;

    obj.netsum_r0x_above = netsum_r0x_above;
    obj.netsum_r0x_above_60 = netsum_r0x_above_60;
    obj.netsum_r0x_below = netsum_r0x_below;
    obj.netsum_r0x_below_60 = netsum_r0x_below_60;
    //console.log("netsummax_days<20", klineJson[i].amount_ave_8, klineJson[i].amount_ave_21)

}

function moneyFlowInOutB(klineJson, i, stockid) {
    var sec = 150;
    if (i<sec) return false;
    if (klineJson[i-sec].r0_net===undefined) return false;

    var netsum_r0 = 0;
    var netsum_r0x = 0;
    var maxnetsumidx_r0 = -1;

    var netsummin_r0x = 100000000000;
    var netsummin_r0x_5 = 0, netsummin_r0x_10 = 0, netsummin_r0x_20 = 0, netsummin_r0x_40 = 0;

    var netsummax_r0x = -100000000000;
    var netsummax_r0x_5 = 0, netsummax_r0x_10 = 0, netsummax_r0x_20 = 0, netsummax_r0x_40 = 0;

    var netsummax_r0 = -100000000000;
    var netsummax_r0_5 = 0, netsummax_r0_10 = 0, netsummax_r0_20 = 0, netsummax_r0_40 = 0;

    var netsummin_r0 = 100000000000;
    var netsummin_r0_5 = 0, netsummin_r0_10 = 0, netsummin_r0_20 = 0, netsummin_r0_40 = 0;


    var netsum_r0_above = 0, netsum_r0_below = 0;
    var netsum_r0_above_60 = 0, netsum_r0_below_60 = 0;
    var currentprice = klineJson[i].close;
    var netsummax_idx_r0 = -1;

    for (var j = i; j>=0 && i-j<=sec; j--) {

        if (i-j === 5) {
            netsummax_r0_5 = netsummax_r0;
            netsummin_r0_5 = netsummin_r0;
            netsummin_r0x_5 = netsummin_r0x;
            netsummax_r0x_5 = netsummax_r0x
        } else if (i-j === 10) {
            netsummax_r0_10 = netsummax_r0;
            netsummin_r0_10 = netsummin_r0;
            netsummin_r0x_10 = netsummin_r0x;
            netsummax_r0x_10 = netsummax_r0x
        } else if (i-j === 20) {
            netsummax_r0_20 = netsummax_r0;
            netsummin_r0_20 = netsummin_r0;
            netsummin_r0x_20 = netsummin_r0x;
            netsummax_r0x_20 = netsummax_r0x
        } else if (i-j === 40) {
            netsummax_r0_40 = netsummax_r0;
            netsummin_r0_40 = netsummin_r0;
            netsummin_r0x_40 = netsummin_r0x;
            netsummax_r0x_40 = netsummax_r0x
        }

        var klj = klineJson[j];
        var midprice = (klj.high+klj.low)/2;
        if (midprice>currentprice) {
            netsum_r0_above += klj.r0_net;
            if (i-j<60) netsum_r0_above_60 += klj.r0_net;
        }

        if (midprice<currentprice) {
            netsum_r0_below += klj.r0_net;
            if (i-j<60) netsum_r0_below_60 += klj.r0_net;
        }

        netsum_r0 += klj.r0_net;
        var r0x_net = klj.netamount-klj.r0_net;
        netsum_r0x += r0x_net;

        if (netsum_r0 < netsummin_r0) {
            netsummin_r0 = netsum_r0;
        }
        if (netsum_r0 > netsummax_r0) {
            netsummax_r0 = netsum_r0;
            netsummax_idx_r0 = j;
        }

        if (netsum_r0x < netsummin_r0x) {
            netsummin_r0x = netsum_r0x;
        }

        if (netsum_r0x > netsummax_r0x) {
            netsummax_r0x = netsum_r0x;
        }

    }

    if (netsummax_idx_r0===-1) console.log("error netsummax_idx_r0 should not be -1");

    var netsummax_days = i-netsummax_idx_r0;
    //console.log("netsummax_days<20", klineJson[i].amount_ave_8, klineJson[i].amount_ave_21)

    var rel = netsummax_days>40
        //&& netsummax_r0x_5 > 0.05*klineJson[i].volume_ave_21
        && netsummax_r0x_20 < klineJson[i].amount_ave_21
        && netsummax_r0x_20 > netsummax_r0_20

        //&& netsummin_r0_20 === netsummin_r0_5
        //&& netsummax_r0x_20 < 0.5*klineJson[i].volume_ave_21
        //&& netsummax_r0x_5 < 0.1*klineJson[i].volume_ave_21
        //&& (netsummax_days>40 && netsummax_r0_40 > 0.1*klineJson[i].volume_ave_21)
        //&& netsummin_r0_10 >= -0.05*klineJson[i].volume_ave_21
        && netsummin_r0_20 >= -0.01*klineJson[i].amount_ave_21
        //&& netsum_r0>(netsummax_days/120) * 0.0*klineJson[i].volume_ave_21 //200000000
        //&& netsum_r0 > netsum_r0x
        //&& netsum_r0 + netsum_r0x > 0
        //&& netsum_r0_above> 0.5*klineJson[i].volume_ave_21
        && netsum_r0_above>netsum_r0_below*1.5
        
        // && (netsummin_r0x_10 < (0.05*klineJson[i].volume_ave_21)
        //     || netsummin_r0x_5 < (0.02*klineJson[i].volume_ave_21))
        //&& valuablecount>0
        //&& r0xnetsum<0.5*klineJson[i].volume_ave_21 
        //&& sum10>-klineJson[i].volume_ave_21*0.2
        //&& sum20>-klineJson[i].volume_ave_21*0.5
        if (false && klineJson[i].date==="04/14/2014") {
            console.log( stockid, (klineJson[i].amount_ave_21/10000).toFixed(2)
                , "\r\nnetsum_r0:"+(netsum_r0/10000).toFixed(2)
                , "\r\nnetsum_r0x:"+(netsum_r0x/10000).toFixed(2)
                , "\r\nnetsum_r0_above:"+(netsum_r0_above/10000).toFixed(2)
                , "netsum_r0_above_60:"+(netsum_r0_above_60/10000).toFixed(2)
                , "\r\nnetsum_r0_below:"+(netsum_r0_below/10000).toFixed(2)
                , "netsum_r0_below_60:"+(netsum_r0_below_60/10000).toFixed(2)
                , "\r\nnetsummax_r0_40:"+(netsummax_r0_40/10000).toFixed(2)
                , " netsummax_r0_20:"+(netsummax_r0_20/10000).toFixed(2)
                , " netsummax_r0_10:"+(netsummax_r0_10/10000).toFixed(2)
                , " netsummax_r0_5:"+(netsummax_r0_5/10000).toFixed(2)

                , "\r\nnetsummin_r0_40:"+(netsummin_r0_40/10000).toFixed(2)
                , " netsummin_r0_20:"+(netsummin_r0_20/10000).toFixed(2)
                , " netsummin_r0_10:"+(netsummin_r0_10/10000).toFixed(2)
                , " netsummin_r0_5:"+(netsummin_r0_5/10000).toFixed(2)

                , "\r\nnetsummax_r0x_20:"+(netsummax_r0x_20/10000).toFixed(2)
                , "\r\nnetsummax_r0x_10:"+(netsummax_r0x_10/10000).toFixed(2)
                , "\r\nnetsummax_r0x_5:"+(netsummax_r0x_5/10000).toFixed(2)
                , "\r\nnetsummin_r0x_10:"+(netsummin_r0x_10/10000).toFixed(2)
                , "\r\nnetsummin_r0x_5:"+(netsummin_r0x_5/10000).toFixed(2)
                
                , "\r\nklineJson[i].volume_ave_21:"+(klineJson[i].volume_ave_21/10000).toFixed(2)
                
                , rel, stockid, netsummax_days
                )

        }
        return rel;
}

function moneyFlowInOutA(klineJson, i, stockid) {
    
    var sec = 150;
    if (i<sec) return false;
    if (klineJson[i-sec].r0_net===undefined) return false;

    var netsum_r0 = 0;
    var netsum_r0x = 0;
    var maxnetsumidx_r0 = -1;

    var netsummin_r0x = 100000000000;
    var netsummin_r0x_5 = 0, netsummin_r0x_10 = 0, netsummin_r0x_20 = 0, netsummin_r0x_40 = 0;

    var netsummax_r0x = -100000000000;
    var netsummax_r0x_5 = 0, netsummax_r0x_10 = 0, netsummax_r0x_20 = 0, netsummax_r0x_40 = 0;

    var netsummax_r0 = -100000000000;
    var netsummax_r0_5 = 0, netsummax_r0_10 = 0, netsummax_r0_20 = 0, netsummax_r0_40 = 0;

    var netsummin_r0 = 100000000000;
    var netsummin_r0_5 = 0, netsummin_r0_10 = 0, netsummin_r0_20 = 0, netsummin_r0_40 = 0;


    var netsum_r0_above = 0, netsum_r0_below = 0;
    var netsum_r0_above_60 = 0, netsum_r0_below_60 = 0;
    var currentprice = klineJson[i].close;
    var netsummax_idx_r0 = -1;

    for (var j = i; j>=0 && i-j<=sec; j--) {

        if (i-j === 5) {
            netsummax_r0_5 = netsummax_r0;
            netsummin_r0_5 = netsummin_r0;
            netsummin_r0x_5 = netsummin_r0x;
            netsummax_r0x_5 = netsummax_r0x
        } else if (i-j === 10) {
            netsummax_r0_10 = netsummax_r0;
            netsummin_r0_10 = netsummin_r0;
            netsummin_r0x_10 = netsummin_r0x;
            netsummax_r0x_10 = netsummax_r0x
        } else if (i-j === 20) {
            netsummax_r0_20 = netsummax_r0;
            netsummin_r0_20 = netsummin_r0;
            netsummin_r0x_20 = netsummin_r0x;
            netsummax_r0x_20 = netsummax_r0x
        } else if (i-j === 40) {
            netsummax_r0_40 = netsummax_r0;
            netsummin_r0_40 = netsummin_r0;
            netsummin_r0x_40 = netsummin_r0x;
            netsummax_r0x_40 = netsummax_r0x
        }

        var klj = klineJson[j];
        var midprice = (klj.high+klj.low)/2;
        if (midprice>currentprice) {
            netsum_r0_above += klj.r0_net;
            if (i-j<60) netsum_r0_above_60 += klj.r0_net;
        }

        if (midprice<currentprice) {
            netsum_r0_below += klj.r0_net;
            if (i-j<60) netsum_r0_below_60 += klj.r0_net;
        }

        netsum_r0 += klj.r0_net;
        var r0x_net = klj.netamount-klj.r0_net;
        netsum_r0x += r0x_net;

        if (netsum_r0 < netsummin_r0) {
            netsummin_r0 = netsum_r0;
        }
        if (netsum_r0 > netsummax_r0) {
            netsummax_r0 = netsum_r0;
            netsummax_idx_r0 = j;
        }

        if (netsum_r0x < netsummin_r0x) {
            netsummin_r0x = netsum_r0x;
        }

        if (netsum_r0x > netsummax_r0x) {
            netsummax_r0x = netsum_r0x;
        }

    }

    if (netsummax_idx_r0===-1) console.log("error netsummax_idx_r0 should not be -1");

    var netsummax_days = i-netsummax_idx_r0;
    //if (netsummax_days<20) console.log("netsummax_days<20", netsummax_days)

    var rel = netsummax_days>40
        && netsummax_r0_40 < 0.1*klineJson[i].amount_ave_21 //***
        && netsummin_r0_40 > -0.2*klineJson[i].amount_ave_21 //***
        //&& netsummax_r0 > 0.2*klineJson[i].amount_ave_21
        
        //&& netsummax_r0x_20 < 1*klineJson[i].amount_ave_21
        && netsummax_r0x_20 > 0.2*klineJson[i].amount_ave_21 //***
        //&& netsummin_r0_20 === netsummin_r0_5
        //&& netsummax_r0x_20 < 0.2*klineJson[i].amount_ave_21
        //&& (netsummax_days>40 && netsummax_r0_40 > 0.1*klineJson[i].volume_ave_21)
        //&& netsummin_r0_10 >= -0.05*klineJson[i].volume_ave_21
        //&& netsummin_r0_20 >= -0.01*klineJson[i].amount_ave_21
        //&& netsum_r0>(netsummax_days/120) * 0.0*klineJson[i].volume_ave_21 //200000000
        //&& netsum_r0 + netsum_r0x < 0

        //&& netsum_r0 + netsum_r0x > 0
        && netsum_r0_above> 0.5*klineJson[i].amount_ave_21
        //&& netsum_r0_above > netsum_r0_above_60
        //&& netsum_r0_above_60 < 1*klineJson[i].amount_ave_21
        //&& netsum_r0_above>netsum_r0_below*1.5
        
        // && (netsummin_r0x_10 < (0.05*klineJson[i].volume_ave_21)
        //     || netsummin_r0x_5 < (0.02*klineJson[i].volume_ave_21))
        //&& valuablecount>0
        //&& r0xnetsum<0.5*klineJson[i].volume_ave_21 
        //&& sum10>-klineJson[i].volume_ave_21*0.2
        //&& sum20>-klineJson[i].volume_ave_21*0.5
        if (false && klineJson[i].date==="04/14/2011") {
            console.log(stockid
                , "\r\nnetsum_r0:"+(netsum_r0/10000).toFixed(2)
                , "\r\nnetsum_r0x:"+(netsum_r0x/10000).toFixed(2)
                , "\r\nnetsum_r0_above:"+(netsum_r0_above/10000).toFixed(2)
                , "\r\nnetsum_r0_below:"+(netsum_r0_below/10000).toFixed(2)
                , "\r\nnetsummax_r0_40:"+(netsummax_r0_40/10000).toFixed(2)
                , " netsummax_r0_20:"+(netsummax_r0_20/10000).toFixed(2)
                , " netsummax_r0_10:"+(netsummax_r0_10/10000).toFixed(2)
                , " netsummax_r0_5:"+(netsummax_r0_5/10000).toFixed(2)

                , "\r\nnetsummin_r0_40:"+(netsummin_r0_40/10000).toFixed(2)
                , " netsummin_r0_20:"+(netsummin_r0_20/10000).toFixed(2)
                , " netsummin_r0_10:"+(netsummin_r0_10/10000).toFixed(2)
                , " netsummin_r0_5:"+(netsummin_r0_5/10000).toFixed(2)

                , "\r\nnetsummax_r0x_20:"+(netsummax_r0x_20/10000).toFixed(2)
                , "\r\nnetsummax_r0x_10:"+(netsummax_r0x_10/10000).toFixed(2)
                , "\r\nnetsummax_r0x_5:"+(netsummax_r0x_5/10000).toFixed(2)
                , "\r\nnetsummin_r0x_10:"+(netsummin_r0x_10/10000).toFixed(2)
                , "\r\nnetsummin_r0x_5:"+(netsummin_r0x_5/10000).toFixed(2)
                
                , "\r\nklineJson[i].volume_ave_21:"+(klineJson[i].volume_ave_21/10000).toFixed(2)
                
                , rel, stockid, netsummax_days
                )

        }
        return rel;
}

exports.moneyFlowInOut = moneyFlowInOut;
exports.wBottomA = wBottomA;
exports.processMoneyFlowInOut = processMoneyFlowInOut;