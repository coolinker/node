var mailutil = require("../mailutil");

var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");

var matchInfoDate = new Date("03/01/2014");
var matchInfoJson = {};

resultJson = {
    targetRatio: 0.5
}

var intersectionprocessor = require("../kline/form/intersectionprocessor").config(3);
var klineformanalyser = require("../kline/form/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var klineutil = require("../kline/klineutil");
var klineio = require("../kline/klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();
//stocks = ['SZ000820', 'SZ002415']
console.time("run");
var mtds = klineformanalyser.kLineFormMethods();
var mailbody ="To Buy";
for (var stockidx=0; stockidx<stocks.length; stockidx++) {
    var stockId = stocks[stockidx];

    var kLineJson = klineio.readKLineSync(stockId);
    var lastclose = kLineJson[kLineJson.length-1].close;
    for (var i=kLineJson.length-1; i>=0; i--) {
        var date = kLineJson[i].date;
        var forms = kLineJson[i].match;//klineformanalyser.tryForms(mtds, kLineJson, i);
        if (forms !==undefined && new Date(date) >= matchInfoDate) {
            if (!matchInfoJson[date]) matchInfoJson[date] = {total:0, win:0, lose:0, pending:0, ratiosum:0};
            matchInfoJson[date].total++;
            if (kLineJson[i].winOrLose === "win") matchInfoJson[date].win++;
            else if (kLineJson[i].winOrLose === "lose") matchInfoJson[date].lose++;
            else if (kLineJson[i].winOrLose === "pending") matchInfoJson[date].pending++;
            else console.log("Error winOrLose value:", kLineJson[i].winOrLose);

            if (!resultJson[date]) resultJson[date] = {total:0, valid:0, stocks:[]};
            resultJson[date].total++;
            var ratio = intersectionprocessor.matchRatio(forms);

            matchInfoJson[date].ratiosum += ratio;
            if (ratio>resultJson.targetRatio) {
                resultJson[date].valid++;
                var close = kLineJson[i].close;
                if (klineutil.increase(close, lastclose) < kLineJson[i].inc_ave_21) {
                    //console.log(date, stockId, ratio, close, lastclose);
                    resultJson[date].stocks.push({date: date,
                        stockId: stockId,
                        ratio: ratio,
                        close: close,
                        lastclose: lastclose});
                }
            
            }
        }

    }
}

var dateArr = [];
for (var dateAtt in matchInfoJson) {
    dateArr.push(dateAtt);
}

dateArr.sort(function(d1, d2) {
    var dt1 = new Date(d1);
    var dt2 = new Date(d2);
    return dt1 > dt2 ? 1 : (dt1 < dt2 ? -1 : 0);
});

var emailBody = "";
var emailBody_1 = "";

for (var dateidx=0; dateidx<dateArr.length; dateidx++) {
    dateStr = dateArr[dateidx];
    matchInfoJson[dateStr].ratioave = matchInfoJson[dateStr].ratiosum/matchInfoJson[dateStr].total;
    delete matchInfoJson[dateStr].ratiosum;
    emailBody +=dateStr+":"+JSON.stringify(matchInfoJson[dateStr])+"<br>";
    if (dateidx>dateArr.length-4) {
        emailBody_1 +="<br><b>"+dateStr + "</b> " + resultJson[dateStr].valid +"/"+ resultJson[dateStr].total + "<br>"
            + function() {
                    resultJson[dateStr].stocks.sort(function(s1,s2) {
                        if (s1.ratio>s2.ratio) return -1;
                        else if(s1.ratio<s2.ratio) return 1;
                        else return 0;
                    });
                    var str = "";
                    resultJson[dateStr].stocks.forEach(function(stockObj){
                        str += stockObj.date+" "
                        //+"<a href='http://image.sinajs.cn/newchart/daily/n/"+stockObj.stockId.toLowerCase()+".gif'>"
                        +"<a href='http://vip.stock.finance.sina.com.cn/moneyflow/#!ssfx!"+stockObj.stockId.toLowerCase()+"'>"
                        +stockObj.stockId+"</a> "
                        +stockObj.ratio+" "
                        +stockObj.close+" "
                        +stockObj.lastclose+"<br>";
                        //if (stockObj.ratio>0.78) {
                            str += "<img src=\"http://image.sinajs.cn/newchart/daily/n/"
                            +stockObj.stockId.toLowerCase()
                            +".gif\" width=\"400\" height=\"250\"><br>"
                        //}
                    });
                    return str;
            }();
        emailBody_1 += "\r\n\r\n";
    }
}

console.log(emailBody+emailBody_1);
mailutil.sendEmail("Form", emailBody+"<br>========================<br>"+emailBody_1);

console.timeEnd("run");

