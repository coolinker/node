var klineutil = require("../klineutil");


function moneyFlowInOut(klineJson, i) {
    var sec = 150;
    if (i<sec) return false;
    if (klineJson[i-sec].r0_net===undefined) return false;
    var maxr0netsum = -100000000000;
    var maxr0xnetsum = -100000000000;
    var r0netsum = 0;
    var maxr0netsumidx = -1;
    var r0xnetsum = 0;
    var sum10 = 0, sum20=0;
    var sumbelow = 0, sumabove = 0;
    var minr0netsum = 100000000000;
    var midprice = klineJson[i].close;
    var valuablecount = 0;
    for (var j = i; j>=0 && i-j<=sec; j--) {
        var klj = klineJson[j];
        r0netsum += klj.r0_net;
        r0xnetsum += klj.netamount-klj.r0_net;
        if(i-j<20) sum20+=klj.r0_net;
        if(i-j<10) sum10+=klj.r0_net;

        if (klj.close<midprice) sumbelow += klj.r0_net;
        else if (klj.close>midprice) sumabove += klj.r0_net;

        if (r0netsum<minr0netsum) {
           minr0netsum = r0netsum;
        }

        if (r0netsum > maxr0netsum) {
            maxr0netsum = r0netsum;
            maxr0xnetsum = r0xnetsum;
            maxr0netsumidx = j;
        }

        // if (klj.netamount-klj.r0_net<0 && klj.r0_net>0
        //     || j>0 && klj.close < klineJson[j-1].close && klj.r0_net>0) {
        //     if(i-j<8) valuablecount++
        // }


    }
    // if (klineJson[i].date==="12/13/2011") 
    //     console.log(klineJson[i].date, (minr0netsum/10000).toFixed(2),
    //     (maxr0netsum/10000).toFixed(2), 
    //     klineJson[i].volume_ave_21/10000)
    var durationdays = i-maxr0netsumidx;
    return klineutil.increase(klineJson[maxr0netsumidx].close, klineJson[i].close) < 0
        //&& valuablecount>0
        && r0xnetsum<-0.5*klineJson[i].volume_ave_21 
        && r0netsum>(0.5*klineJson[i].volume_ave_21)//200000000
        //&& sumbelow>0
        && sumabove>sumbelow
        && sum10>-klineJson[i].volume_ave_21*0.5
        //&& sum20>-klineJson[i].volume_ave_21*0.5
        && durationdays>20
}

exports.moneyFlowInOut = moneyFlowInOut;