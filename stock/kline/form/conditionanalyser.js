var moneyflowforms = require("./moneyflowforms"); 

function trueFalse(key, bool, keyObj) {
    if (!keyObj[key]) keyObj[key] = {"_true":0, "_false":0};
    bool? keyObj[key]._true++: keyObj[key]._false++;
}

function conditions(klineJson, idx, conditionObj) {
    var obj = klineJson[idx];
    
    
    var iswin = klineJson[idx].winOrLose==="win";
    if (!conditionObj.win) conditionObj.win = {};
    if (!conditionObj.lose) conditionObj.lose = {};

    var keyObj = iswin ? conditionObj.win : conditionObj.lose;

    trueFalse("obj.netsummax_r0_duration>40", obj.netsummax_r0_duration>40, keyObj);
    
    trueFalse("obj.netsummax_r0>0.5*obj.amount_ave_21", 
        obj.netsummax_r0>0.5*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0>obj.amount_ave_21", 
        obj.netsummax_r0>obj.amount_ave_21, keyObj);

    
    trueFalse("obj.netsummax_r0_netsum_r0x>0.5*obj.amount_ave_21", 
        obj.netsummax_r0_netsum_r0x>0.5*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0_netsum_r0x>0", 
        obj.netsummax_r0_netsum_r0x>0, keyObj);
    trueFalse("obj.netsummax_r0_netsum_r0x<-0.5*obj.amount_ave_21", 
        obj.netsummax_r0_netsum_r0x<-0.5*obj.amount_ave_21, keyObj);
    
    trueFalse("obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0", 
        obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0, keyObj);
    trueFalse("obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0.05*obj.amount_ave_21", 
        obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>0.05*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>obj.amount_ave_21", 
        obj.netsummax_r0+obj.netsummax_r0_netsum_r0x>obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0_5>0.05*obj.amount_ave_21", obj.netsummax_r0_5>0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_10>0.05*obj.amount_ave_21", obj.netsummax_r0_10>0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_10>0.0*obj.amount_ave_21", obj.netsummax_r0_10>0.0*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_10>0.1*obj.amount_ave_21", obj.netsummax_r0_10>0.1*obj.amount_ave_21, keyObj);
    
    trueFalse("obj.netsummax_r0_20>0.1*obj.amount_ave_21", obj.netsummax_r0_20>0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_20>0.3*obj.amount_ave_21", obj.netsummax_r0_20>0.3*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0_20>0.5*obj.amount_ave_21", obj.netsummax_r0_20>0.5*obj.amount_ave_21, keyObj);
    //trueFalse("obj.netsummax_r0_20>0.15*obj.amount_ave_21", obj.netsummax_r0_20>0.15*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0_40>0.1*obj.amount_ave_21", obj.netsummax_r0_40>0.1*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummin_r0<-0.1*obj.amount_ave_21", obj.netsummin_r0<-0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_5<-0.05*obj.amount_ave_21", obj.netsummin_r0_5<-0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_10<-0.05*obj.amount_ave_21", obj.netsummin_r0_10<-0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_20<-0.1*obj.amount_ave_21", obj.netsummin_r0_20<-0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40<-0.1*obj.amount_ave_21", obj.netsummin_r0_40<-0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0_40>-0.3*obj.amount_ave_21", obj.netsummin_r0_40>-0.3*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0x_5>0.05*obj.amount_ave_21", obj.netsummax_r0x_5>0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_10>0.05*obj.amount_ave_21", obj.netsummax_r0x_10>0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_20>0.1*obj.amount_ave_21", obj.netsummax_r0x_20>0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummax_r0x_40>0.1*obj.amount_ave_21", obj.netsummax_r0x_40>0.1*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummin_r0x<-0.3*obj.amount_ave_21", obj.netsummin_r0x<-0.3*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0x_5<-0.05*obj.amount_ave_21", obj.netsummin_r0x_5<-0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0x_10<-0.05*obj.amount_ave_21", obj.netsummin_r0x_10<-0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0x_20<-0.1*obj.amount_ave_21", obj.netsummin_r0x_20<-0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsummin_r0x_40<-0.2*obj.amount_ave_21", obj.netsummin_r0x_40<-0.2*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsummax_r0+obj.netsummin_r0x>0", obj.netsummax_r0+obj.netsummin_r0x>0, keyObj);
    trueFalse("obj.netsummax_r0_5+obj.netsummin_r0x_5>0", obj.netsummax_r0_5+obj.netsummin_r0x_5>0, keyObj);
    trueFalse("obj.netsummax_r0_10+obj.netsummin_r0x_10>0", obj.netsummax_r0_10+obj.netsummin_r0x_10>0, keyObj);
    trueFalse("obj.netsummax_r0_20+obj.netsummin_r0x_20>0", obj.netsummax_r0_20+obj.netsummin_r0x_20>0, keyObj);
    trueFalse("obj.netsummax_r0_40+obj.netsummin_r0x_40>0", obj.netsummax_r0_40+obj.netsummin_r0x_40>0, keyObj);

    trueFalse("obj.netsummax_r0_5===obj.netsummax_r0_10", obj.netsummax_r0_5===obj.netsummax_r0_10, keyObj);
    trueFalse("obj.netsummax_r0_10===obj.netsummax_r0_20", obj.netsummax_r0_10===obj.netsummax_r0_20, keyObj);
    trueFalse("obj.netsummin_r0_5===obj.netsummin_r0_10", obj.netsummin_r0_5===obj.netsummin_r0_10, keyObj);
    trueFalse("obj.netsummin_r0_10===obj.netsummin_r0_20", obj.netsummin_r0_10===obj.netsummin_r0_20, keyObj);

    trueFalse("obj.netsummax_r0x_5===obj.netsummax_r0x_10", obj.netsummax_r0x_5===obj.netsummax_r0x_10, keyObj);
    trueFalse("obj.netsummax_r0x_10===obj.netsummax_r0x_20", obj.netsummax_r0x_10===obj.netsummax_r0x_20, keyObj);
    trueFalse("obj.netsummin_r0x_5===obj.netsummin_r0x_10", obj.netsummin_r0x_5===obj.netsummin_r0x_10, keyObj);
    trueFalse("obj.netsummin_r0x_10===obj.netsummin_r0x_20", obj.netsummin_r0x_10===obj.netsummin_r0x_20, keyObj);

    trueFalse("obj.netsummax_r0x_5>obj.netsummax_r0_5", obj.netsummax_r0x_5 > obj.netsummax_r0_5, keyObj);
    trueFalse("obj.netsummax_r0x_10>obj.netsummax_r0_10", obj.netsummax_r0x_10 > obj.netsummax_r0_10, keyObj);
    trueFalse("obj.netsummax_r0x_20>obj.netsummax_r0_20", obj.netsummax_r0x_20 > obj.netsummax_r0_20, keyObj);
    trueFalse("obj.netsummax_r0x_40>obj.netsummax_r0_40", obj.netsummax_r0x_40 > obj.netsummax_r0_40, keyObj);

    trueFalse("obj.netsummin_r0x_5>obj.netsummin_r0_5", obj.netsummin_r0x_5 > obj.netsummin_r0_5, keyObj);
    trueFalse("obj.netsummin_r0x_10>obj.netsummin_r0_10", obj.netsummin_r0x_10 > obj.netsummin_r0_10, keyObj);
    trueFalse("obj.netsummin_r0x_20>obj.netsummin_r0_20", obj.netsummin_r0x_20 > obj.netsummin_r0_20, keyObj);
    trueFalse("obj.netsummin_r0x_40>obj.netsummin_r0_40", obj.netsummin_r0x_40 > obj.netsummin_r0_40, keyObj);

    trueFalse("obj.netsum_r0_above>obj.netsum_r0_below*1.5", obj.netsum_r0_above>obj.netsum_r0_below*1.5, keyObj);
    trueFalse("obj.netsum_r0_above_60>obj.netsum_r0_below_60*1.5", obj.netsum_r0_above_60>obj.netsum_r0_below_60*1.5, keyObj);

    trueFalse("obj.netsum_r0_above>obj.netsum_r0x_above", obj.netsum_r0_above>obj.netsum_r0x_above, keyObj);
    trueFalse("obj.netsum_r0_above_60>obj.netsum_r0x_above_60", obj.netsum_r0_above_60>obj.netsum_r0x_above_60, keyObj);
    trueFalse("obj.netsum_r0_below>obj.netsum_r0x_below", obj.netsum_r0_below>obj.netsum_r0x_below, keyObj);
    trueFalse("obj.netsum_r0_below_60>obj.netsum_r0x_below_60", obj.netsum_r0_below_60>obj.netsum_r0x_below_60, keyObj);

    trueFalse("obj.netsum_r0_above>0.1*obj.amount_ave_21", obj.netsum_r0_above>0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_above_60>0.1*obj.amount_ave_21", obj.netsum_r0_above_60>0.1*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsum_r0_below>0.05*obj.amount_ave_21", obj.netsum_r0_below>0.05*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below>-0.1*obj.amount_ave_21", obj.netsum_r0_below>-0.1*obj.amount_ave_21, keyObj);
    trueFalse("obj.netsum_r0_below<0.1*obj.amount_ave_21", obj.netsum_r0_below<0.1*obj.amount_ave_21, keyObj);
    //trueFalse("obj.netsum_r0_below<0.15*obj.amount_ave_21", obj.netsum_r0_below<0.15*obj.amount_ave_21, keyObj);
    //trueFalse("obj.netsum_r0_below<0.05*obj.amount_ave_21", obj.netsum_r0_below<0.05*obj.amount_ave_21, keyObj);

    trueFalse("obj.netsum_r0_below_60>0.05*obj.amount_ave_21", obj.netsum_r0_below_60>0.05*obj.amount_ave_21, keyObj);
}

exports.conditions = conditions;