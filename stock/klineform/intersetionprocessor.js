var klineutil = require("../klineutil");
var bullklineforms = require("./bullklineforms");
var math = require("../mathutil");
var fs = require("fs");

var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

var startDate = new Date("01/01/2005"); 
var endDate = new Date("01/01/2014"); 

var  formsLen = klineformanalyser.bullKLineFormMethods().length;
formsLen = 3;
var intersetionArray = math.CArr(formsLen,2);


function readJson(callback) {
  //console.log("Read K line data:"+stockId, startDate, endDate);
  var intersections = [];
  
  fs.readFile("../datasource/intersection"+".json","utf8", function(error, content) {
    if(error) {
      console.log(error);
    } else {
      content.split("\r\n").forEach(function(line) {
          if (line.length>0) {
              var json = JSON.parse(line);
              intersections.push(json);
              
          }
      });

    }
    callback(intersections);
  });
  
}

function writeJson(jsonData, callback) {
  var data = "";
  jsonData.forEach(function(line){
    if (data!=="") {
      data = data + "\r\n";
    }
    data = data + JSON.stringify(line);    
  });

  fs.writeFileSync("../datasource/intersection"+".json", data);
}

function bullKLineFormMethods() {
    var methods = [];
    for (var attr in bullklineforms) {
        methods.push(attr);
    }

    return methods.sort();
}
