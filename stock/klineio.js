var fs = require("fs");
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

function readKLineBaseSync(stockId, callback) {
  
  var kLineJson = [];

  var content = fs.readFileSync("../datasource/klines_base/"+stockId+".TXT","utf8");

  content.split("\r\n").forEach(function(line) {
      var lineEle = line.split(",");

      if (lineEle.length===7)  {
            kLineJson.push({date: lineEle[0],
              open: parseFloat(lineEle[1]), 
              high: parseFloat(lineEle[2]),
              low: parseFloat(lineEle[3]), 
              close: parseFloat(lineEle[4]), 
              volume: parseFloat(lineEle[5]), 
              amount: parseFloat(lineEle[6])});
      }
  });
  
  //console.log("Read K line data:"+stockId, kLineJson.length);
  callback(kLineJson);
  
}
function readKLineBase(stockId, callback) {
  //console.log("Read K line data:"+stockId);
  var kLineJson = [];

  fs.readFile("../datasource/klines_base/"+stockId+".TXT","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      content.split("\r\n").forEach(function(line) {
          var lineEle = line.split(",");

          if (lineEle.length===7)  {
                kLineJson.push({date: lineEle[0],
                  open: parseFloat(lineEle[1]), 
                  high: parseFloat(lineEle[2]),
                  low: parseFloat(lineEle[3]), 
                  close: parseFloat(lineEle[4]), 
                  volume: parseFloat(lineEle[5]), 
                  amount: parseFloat(lineEle[6])});
          }
      });

    }
    console.log(stockId, kLineJson.length)
    callback(kLineJson);
  });
  
}

function readKLine(stockId, callback) {
  //console.log("Read K line data:"+stockId);
  var kLineJson = [];
  var startDate = new Date("01/01/2005");
  fs.readFile("../datasource/klines/"+stockId+".json","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      content.split("\r\n").forEach(function(line) {
          if (line.length>0) {
              var json = JSON.parse(line);
              if (new Date(json.date) > startDate) {
                  kLineJson.push(json);       
              }
          }
      });

    }
    callback(kLineJson);
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
exports.readKLineBaseSync = readKLineBaseSync;
exports.readKLineBase = readKLineBase;
exports.readKLine = readKLine;

exports.writeKLineSync = writeKLineSync;
exports.writeKLine = writeKLine;
exports.getAllStockIds = getAllStockIds;
