var fs = require("fs");
        
function readKLineBase(stockId, callback) {
  console.log("Read K line data:"+stockId);
  var kLineJson = [];

  fs.readFile("./datasource/klines_base/"+stockId+".TXT","utf8", function(error, content) {
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
    callback(kLineJson);
  });
  
}

function readKLine(stockId, callback) {
  console.log("Read K line data:"+stockId);
  var kLineJson = [];

  fs.readFile("./datasource/klines/"+stockId+".json","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      content.split("\r\n").forEach(function(line) {
        if (line.length>0) {
          kLineJson.push(JSON.parse(line));
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

function writeKLine(stockId, jsonData, callback) {
  var data = "";
  jsonData.forEach(function(line){
    //if (line.high_peak===true) console.log("peak", line.date);
    if (line.low_trough===true) console.log("trough", line.date);

    if (data!=="") {
      data = data + "\r\n";
    }
    data = data + JSON.stringify(line);    
  });

  fs.writeFile("./datasource/klines/"+stockId+".json", data, function(err) {
      callback(err);
  });
}

exports.readKLineBase = readKLineBase;
exports.writeKLine = writeKLine;
//exports.appendKLine = appendKLine;
