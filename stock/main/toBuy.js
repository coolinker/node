var mailutil = require("../mailutil");

var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2015");

var matchInfoDate = new Date("03/01/2014");
var matchInfoJson = {};

resultJson = {
    targetRatio: 0.75
}

var intersectionprocessor = require("../klineform/intersectionprocessor").config(3);
var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var klineutil = require("../klineutil");
var klineio = require("../klineio").config(startDate, endDate);
var stocks = klineio.getAllStockIds();

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
            if (!matchInfoJson[date]) matchInfoJson[date] = {total:0, win:0, lose:0, pending:0};
            matchInfoJson[date].total++;
            if (kLineJson[i].winOrLose === "win") matchInfoJson[date].win++;
            else if (kLineJson[i].winOrLose === "lose") matchInfoJson[date].lose++;
            else if (kLineJson[i].winOrLose === "pending") matchInfoJson[date].pending++;
            else console.log("Error winOrLose value:", kLineJson[i].winOrLose);

            if (!resultJson[date]) resultJson[date] = {total:0, valid:0, stocks:[]};
            resultJson[date].total++;
            var ratio = intersectionprocessor.matchRatio(forms);
            if (ratio>resultJson.targetRatio) {
                resultJson[date].valid++;
                var close = kLineJson[i].close;
                if (klineutil.increase(close, lastclose) < 0.01) {
                    //console.log(date, stockId, ratio, close, lastclose);
                    resultJson[date].stocks.push(date+" "
                        + stockId + " "
                        + ratio + " "
                        + close + " " 
                        + lastclose + "");
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
    emailBody +=dateStr+":"+JSON.stringify(matchInfoJson[dateStr])+"\r\n";
    if (dateidx>dateArr.length-4) {
        emailBody_1 +=dateStr + " " + resultJson[dateStr].valid +"/"+ resultJson[dateStr].total + "\r\n"
            + resultJson[dateStr].stocks.join("\r\n");
        emailBody_1 += "\r\n\r\n";
    }
}

console.log(emailBody+emailBody_1);
mailutil.sendEmail("To Buy", emailBody+"\r\n========================\r\n"+emailBody_1);

console.timeEnd("run");

