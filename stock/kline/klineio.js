var fs = require("fs");
var ajaxRequest = require('request');


var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2016"); 

var cacheIO = false;
var cacheIOObj = {};
var cacheSampleObj = {};
var loadingCallbackQueue = {};
var stockIdIdxMap = {};

function config(start, end, cache){
  startDate = start;
  endDate = end;
  // cacheIO = cache
  return this;
}

function cacheSample(stockId, index, obj) {
  cacheSampleObj[stockId+"_"+index] = obj;
}

function getSample(stockId, index) {
  return cacheSampleObj[stockId+"_"+index];
}

function getAllStockIds (match) {
    var klinefiles = fs.readdirSync("../datasource/klines_base/");
    var stockIds = [];
    var cnt = 0;
    klinefiles.forEach(function (fileName) {
        if (match===undefined || fileName.indexOf(match) >= 0) {
            var sid = fileName.substring(0, fileName.indexOf("."));
            stockIds.push(sid);
            stockIdIdxMap[sid] = cnt++;
        }
    });
    return stockIds;
}

function readLatestKLineAjax(callback) {
  var stockIds = getAllStockIds();
  var stockIdParam = "";

  var latestKLineAjaxJson = {};
  var len = stockIds.length;
  var counter = 0;
  var timer = new Date();

  for (var i=0; i<len; i++) {
    stockIdParam += stockIds[i];
    if ((i)%500 === 499 || i===len-1) {
      
      ajaxRequest('http://hq.sinajs.cn/list='+stockIdParam.toLowerCase(), function (error, response, body) {

        if (!error && response.statusCode == 200) {
          var lines = body.split(';')
          var linec = 0;
          lines.forEach(function (line) {
            //http://www.cnblogs.com/me115/archive/2011/05/09/2040826.html
            //var hq_str_sh601006="大秦铁路,6.68,6.65,6.70,6.72,6.65,6.70,6.71,38209704,255822755,35179,6.70,161140,6.69,365546,6.68,270900,6.67,358300,6.66,526520,6.71,639590,6.72,525568,6.73,449200,6.74,395731,6.75,2014-04-09,15:03:04,00";
            if (line.length===1) {//"\n"
              return;
            }
            //if (line.indexOf("sh600000")>-1) console.log("0000", line)
            
            linec++;
            var sid = line.substr(line.indexOf("var hq_str_")+"var hq_str_".length, 8).toUpperCase();
            if (!sid) console.log("Error: readLatestKLineAjax", line);

            var values = line.substring(line.indexOf("\"")+1, line.lastIndexOf("\"")).split(",");
            if (values.length<31) {
              //终止上市
              console.log(stockIdParam, line)
              return;
            }

            var datesplits = values[30].split("-");
            if (sid.indexOf("SH")<0 && sid.indexOf("SZ")<0) 
                console.log("0000", sid, line.indexOf("var hq_str_"), "var hq_str_".length, 
                  line.substr(11, 8), "["+line.substr(0,20))
            
            latestKLineAjaxJson[sid] = {
                date: (datesplits[1]+"/"+datesplits[2]+"/"+datesplits[0]),
                open:Number(values[1]), 
                high: Number(values[4]), 
                low: Number(values[5]), 
                close: Number(values[3]), 
                volume: Number(values[8]), 
                amount: Number(values[9])
                };
            
          });

            counter += linec;
            if (counter === len) {
              if (callback) callback(latestKLineAjaxJson);
              console.log("readLatestKLineAjax time:", (new Date())-timer);
            }
          //console.log(body) // Print the google web page.
        } else {
          console.log("error", error)
        }
        
      });
      stockIdParam = "";
    } else {
      stockIdParam += ",";
    }
  }

}

function readKLineBaseSync(stockId, callback) {
  
  var kLineJson = [];

  var content = fs.readFileSync("../datasource/klines_base/"+stockId+".TXT","utf8");
  var lines = content.split("\r\n");
  var count = 0;
  lines.forEach(function(line) {
      var lineEle = line.split(",");

      if (lineEle.length===7)  {
          count++;
          var vol = parseFloat(lineEle[5]);
          if (vol>0) {
              kLineJson.push({date: lineEle[0],
                open: parseFloat(lineEle[1]), 
                high: parseFloat(lineEle[2]),
                low: parseFloat(lineEle[3]), 
                close: parseFloat(lineEle[4]), 
                volume: parseFloat(lineEle[5]), 
                amount: parseFloat(lineEle[6])});
          } else {
            //console.log("==",stockId, lineEle);
            if (count<lines.length-2) console.log(stockId, count, lines.length, lineEle);
          }
      }
  });
  
  //console.log("Read K line data:"+stockId, kLineJson.length);
  callback(stockId, kLineJson);
  
}

function readKLineRightBaseSync(stockId) {
  
  var kLineJson = {};
  var content = fs.readFileSync("../datasource/klines_base_right/"+stockId+".TXT","utf8");
  var lines = content.split("\r\n");
  var count = 0;
  lines.forEach(function(line) {
      var lineEle = line.split(",");

      if (lineEle.length===7)  {
          count++;
          var vol = parseFloat(lineEle[5]);
          if (vol>0) {
              kLineJson[lineEle[0]] = {date: lineEle[0],
                open: parseFloat(lineEle[1]), 
                high: parseFloat(lineEle[2]),
                low: parseFloat(lineEle[3]), 
                close: parseFloat(lineEle[4]), 
                volume: parseFloat(lineEle[5]), 
                amount: parseFloat(lineEle[6])};
          } else {
            //console.log("==",stockId, lineEle);
            if (count<lines.length-2) console.log(stockId, count, lines.length, lineEle);
          }
      }
  });
  
  return kLineJson;
}

function readKLineBase(stockId, callback) {
  //console.log("Read K line data:"+stockId);
  var kLineJson = [];

  fs.readFile("../datasource/klines_base/"+stockId+".TXT","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      var lines = content.split("\r\n");
      var count = 0;
      lines.split("\r\n").forEach(function(line) {
          var lineEle = line.split(",");

          if (lineEle.length===7)  {
                count++;
                var vol = parseFloat(lineEle[5]);
                if (vol>0) {
                  kLineJson.push({date: lineEle[0],
                    open: parseFloat(lineEle[1]), 
                    high: parseFloat(lineEle[2]),
                    low: parseFloat(lineEle[3]), 
                    close: parseFloat(lineEle[4]), 
                    volume: parseFloat(lineEle[5]), 
                    amount: parseFloat(lineEle[6])});
              }
          }
      });

    }
    console.log(stockId, kLineJson.length)
    callback(kLineJson);
  });
  
}

function readKLineSync(stockId, cacheIO) {
  var kLineJson = [];
  if (cacheIO &&  cacheIOObj[stockId]) {
    //callback(cacheIOObj[stockId]);
    return cacheIOObj[stockId];
  }

  var content = fs.readFileSync("../datasource/klines/"+stockId+".json","utf8");

  content.split("\r\n").forEach(function(line) {
          if (line.length>0) {
              var json = JSON.parse(line);
              var date = new Date(json.date);
              
              if (date > startDate && date < endDate) {
                  kLineJson.push(json);       
              }
          }
  });
  if (cacheIO) cacheIOObj[stockId] = kLineJson;
  return kLineJson;
}


function readKLine(stockId, callback) {
  //console.log("Read K line data:"+stockId, startDate, endDate);
  var kLineJson = [];
  if (cacheIO &&  cacheIOObj[stockId]) {
    callback(cacheIOObj[stockId]);
    return;
  }

  if (loadingCallbackQueue[stockId]) {
    loadingCallbackQueue[stockId].push(callback);
    return;
  } else {
    loadingCallbackQueue[stockId] = [callback];
  }

  fs.readFile("../datasource/klines/"+stockId+".json","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      content.split("\r\n").forEach(function(line) {
          if (line.length>0) {
              var json = JSON.parse(line);
              var date = new Date(json.date);
              
              if (date > startDate && date < endDate) {
                  kLineJson.push(json);       
              }
          }
      });

    }
    if (cacheIO) cacheIOObj[stockId] = kLineJson;

    for (var qidx = 0; qidx < loadingCallbackQueue[stockId].length; qidx++){
      loadingCallbackQueue[stockId][qidx](kLineJson);
    }
    
    delete loadingCallbackQueue[stockId];

  });
  
}

/*
function appendKLine(stockId, jsonData) {
  jsonData.forEach(function(line){
    line = "\r\n"+JSON.stringify(line);
    fs.appendFile("./datasource/klines/"+stockId+".json", line, function (err) {
      if (err) {
        console.log(err);
      }
    });

  });

}*/

function writeKLineSync(stockId, jsonData, callback) {
  var data = "";
  jsonData.forEach(function(line){
    //if (line.high_peak===true) console.log("peak", line.date);
    //if (line.low_trough===true) console.log("trough", line.date);

    if (data!=="") {
      data = data + "\r\n";
    }
    data = data + JSON.stringify(line);    
  });

  fs.writeFileSync("../datasource/klines/"+stockId+".json", data);
}

function writeKLine(stockId, jsonData, callback) {
  var data = "";
  jsonData.forEach(function(line){
    //if (line.high_peak===true) console.log("peak", line.date);
    //if (line.low_trough===true) console.log("trough", line.date);

    if (data!=="") {
      data = data + "\r\n";
    }
    data = data + JSON.stringify(line);    
  });

  fs.writeFile("../datasource/klines/"+stockId+".json", data, function(err) {
      if (callback) {
          callback(err);
      } else {
          if(err) {
              console.log("--------------------",err);
          } else {
              console.log(stockId+" the file was saved!");
          }
      }
      
  });
}

function getStockIdx (sid) {
  return stockIdIdxMap[sid];
}

exports.getStockIdx = getStockIdx;
exports.config = config;

exports.readLatestKLineAjax = readLatestKLineAjax;
exports.readKLineBaseSync = readKLineBaseSync;
exports.readKLineRightBaseSync = readKLineRightBaseSync;
exports.readKLineBase = readKLineBase;
exports.readKLineSync = readKLineSync;
exports.readKLine = readKLine;

exports.writeKLineSync = writeKLineSync;
exports.writeKLine = writeKLine;
exports.getAllStockIds = getAllStockIds;
