var fs = require("fs");
var ajaxRequest = require('request');
var gLastUpdateDate;// = new Date("04/09/2015");
var moneyFlowUrl = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/MoneyFlow.ssl_qsfx_zjlrqs?page=1&num="
+20+"&sort=opendate&asc=0&daima=";

var stocks = getAllStockIds();
//stocks = ["SH600000"];
function config(){
    return this;
}

function getAllStockIds (match) {
    var klinefiles = fs.readdirSync("../datasource/klines_base/");
    var stockIds = [];
    klinefiles.forEach(function (fileName) {
        if (match===undefined || fileName.indexOf(match) >= 0) {
            stockIds.push(fileName.substring(0, fileName.indexOf(".")));
        }
    });
    return stockIds;
}

function updateMoneyFlowData(startIndex, callback) {
    var len = stocks.length;
    if (startIndex>=len) {
        callback();
        return;
    }

    var step = 100;
    console.log("updateMoneyFlowData", startIndex)
    
    var counter = 0;
    for (var i=startIndex; i<len && i<startIndex+step; i++) {
        var stockId = stocks[i];
        if (stockId==="SH999999" || stockId === "SZ399001") {
          counter++;
          continue;
        }
        (function(){
            var _stockId = stockId;
            ajaxRequest(moneyFlowUrl+_stockId.toLowerCase(), 
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  body = body.replace(/\},\{/g, "}-{");
                  body = body.replace(/,/g, ",\"");
                  body = body.replace(/:/g, "\":");
                  body = body.replace(/\{/g, "{\"");
                  body = body.replace(/\}-\{/g, "},{");
                  var json = JSON.parse(body);

                  json.reverse();
                  //var origjson = readMoneyFlowDateMapSync(_stockId);
                  var origjsonArr = readMoneyFlowSync(_stockId);

                  var lastday = origjsonArr.length>0
                    ? new Date(origjsonArr[origjsonArr.length-1].opendate)
                    : new Date(0);

                  for (var j=0; j<json.length; j++) {
                    var fields = json[j].opendate.split("-");
                    var _date = fields[1]+"/"+fields[2]+"/"+fields[0];

                    if (new Date(_date) > lastday && Number(json[j].turnover)!==0) {
                      json[j].opendate = _date;
                      origjsonArr.push(json[j]);
                      //console.log(_stockId, j, _date, json[j].opendate, origjsonArr.length)
                    }
                  }

                  writeMoneyFlowSync(_stockId, origjsonArr);
                  counter++;

                  if (counter===i-startIndex) {
                    updateMoneyFlowData(startIndex+step, callback);
                  }
                } else {
                  console.log("error", error)
                  //updateMoneyFlowData(startIndex, callback);
                }

            });
        })();
    
  }

}

function readMoneyFlowDateMapSync(stockId) {
  var moneyFlowJson = {};
  var path = "../datasource/moneyflow/"+stockId+".json";

  if (fs.existsSync(path)) {
    var content = fs.readFileSync(path,"utf8");
    content.split("\r\n").forEach(function(line) {
            if (line.length>0) {
                var json = JSON.parse(line);
                if (json.turnover===0) return;
                moneyFlowJson[json.opendate] = json;
            }
    });
  }

  return moneyFlowJson;
}

function readMoneyFlowSync(stockId) {
  var moneyFlowJson = [];
  var path = "../datasource/moneyflow/"+stockId+".json";
  if (fs.existsSync(path)) {
    var content = fs.readFileSync(path,"utf8");
    content.split("\r\n").forEach(function(line) {
            if (line.length>0) {
                var json = JSON.parse(line);
                if (json.turnover===0) return;
                var date = new Date(json.opendate);
                if (gLastUpdateDate && date > gLastUpdateDate) return;
                // var  str = (json.netamount/10000).toFixed(2);
                // if (str.length<8) {
                //   for (var i=str.length; i<8; i++) {
                //     str+=" ";
                //   }
                // }
                //console.log(json.opendate, " ",str, " ",(json.r0_net/10000).toFixed(2));
                moneyFlowJson.push(json);       
            }
    });
  }
  //moneyFlowJson.reverse();
  return moneyFlowJson;
}


function writeMoneyFlowSync(stockId, jsonData) {
    var data = "";
    jsonData.forEach(function(line){
         for (attr in line) {
            if (attr==="opendate") {
              // var fields = line.opendate.split("-");
              // line.opendate = fields[1]+"/"+fields[2]+"/"+fields[0];
            } else {
              line[attr] = Number(line[attr]);
            }
         }

        if (data!=="") {
          data = data + "\r\n";
        }
        data = data + JSON.stringify(line);    
    });

    fs.writeFileSync("../datasource/moneyflow/"+stockId+".json", data);
}

exports.config = config;
exports.updateMoneyFlowData = updateMoneyFlowData;
exports.readMoneyFlowSync = readMoneyFlowSync;