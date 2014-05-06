var fs = require("fs");
var ajaxRequest = require('request');

var moneyFlowUrl = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/MoneyFlow.ssl_qsfx_zjlrqs?page=1&num="
+1000+"&sort=opendate&asc=0&daima=";

var stocks = getAllStockIds();

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

    var step = 10;
    console.log("updateMoneyFlowData", startIndex)
    
    var counter = 0;
    for (var i=startIndex; i<len && i<startIndex+step; i++) {
        var stockId = stocks[i];
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
                  writeMoneyFlowSync(_stockId, json);
                  counter++;

                  if (counter===i-startIndex) {
                    updateMoneyFlowData(startIndex+step, callback);
                  }
                } else {
                  console.log("error", error)
                }

            });
        })();
    
  }

}

function readMoneyFlowSync(stockId) {
  var moneyFlowJson = [];
  var content = fs.readFileSync("../datasource/moneyflow/"+stockId+".json","utf8");
  content.split("\r\n").forEach(function(line) {
          if (line.length>0) {
              var json = JSON.parse(line);
              if (json.turnover===0) return;
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

  moneyFlowJson.reverse();

  return moneyFlowJson;
}


function writeMoneyFlowSync(stockId, jsonData) {
    var data = "";
    jsonData.forEach(function(line){
         for (attr in line) {
            if (attr==="opendate") {
              var fields = line.opendate.split("-");
              line.opendate = fields[1]+"/"+fields[2]+"/"+fields[0];
            }
            else line[attr] = Number(line[attr]);
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