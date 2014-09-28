var klineio;
var klineformanalyser;
var stocks;
var intersectionConfig = {};

var fs = require("fs");

function config(start, end){
    klineio  = require("../klineio").config(start, end);
    klineformanalyser = require("./analyser").config({
        startDate: start,
        endDate: end
    });
    stocks = klineio.getAllStockIds();
    //stocks = ["SZ300302"];
    var content = fs.readFileSync("../config/intersection.json","utf8");
    if (content) {

        intersectionConfig = JSON.parse(content);
    }
    return this;
}

function getIntersectionRate(forms) {
    if (intersectionConfig[forms.toString()]) return intersectionConfig[forms.toString()];
    console.log("getIntersectionRate:", forms, "...");

    var result = {total:0, win:0, lose:0, pending:0};
    stocks.forEach(function(stockId) {
        var kLineJson = klineio.readKLineSync(stockId)
        var re = klineformanalyser.traverseForIntersection(forms, kLineJson);
        result.total += re.total;
        result.win += re.win;
    });
    var rate = result.total>0?result.win/result.total:0;
    intersectionConfig[forms.toString()] = rate;
    fs.writeFile("../config/intersection.json", JSON.stringify(intersectionConfig), function(err) {
        
        if(err) {
          console.log("--------------------",err);
        } else {
          console.log("getIntersectionRate write:", forms, rate);
        }
  
    });
    return rate;
}
 
exports.config = config;
exports.getIntersectionRate = getIntersectionRate;