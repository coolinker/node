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

var intersectionsMap = {};
var intersetionArray = [];
var combinationArrayIndex = 0;
var allForms = klineformanalyser.bullKLineFormMethods();
function config(r){  
  var formsLen = allForms.length;
  intersetionArray = math.CArr(formsLen,r);
  readJson();
  return this;
}

function getIndex() {
  return combinationArrayIndex;
}

function next() {
  combinationArrayIndex++;
  if (combinationArrayIndex>=intersetionArray.length) return false;
  //if (combinationArrayIndex>2) return false;
  return true;
}

function has(forms) {
  var key = forms.toString();
  return !!intersectionsMap[key];
}

function getFormsCombination() {
  var currentIndexs = intersetionArray[combinationArrayIndex];
  var forms = klineformanalyser.selectedBullKLineFormMethods(currentIndexs);
  return forms;
}

function getFormsCombinationAt(idx) {
  var currentIndexs = intersetionArray[idx];
  var forms = klineformanalyser.selectedBullKLineFormMethods(currentIndexs);
  return forms;
}

function isValidCombinationArrayIndex(idx) {
  return idx>=0 && idx < intersetionArray.length;
}

function merge(obj) {
  for (var att in obj) {
    if (intersectionsMap[att]) {
      console.error("intersectionsMap key dupe:", att);
    } else {
      intersectionsMap[att] = obj[att];
    }
  }
}

function readJson() {
  if(fs.existsSync("../datasource/intersection.json")) {
    var content = fs.readFileSync("../datasource/intersection" + ".json")
    intersectionsMap = JSON.parse(content);
  }
}

function writeJson() {
  var content = JSON.stringify(intersectionsMap);
  fs.writeFileSync("../datasource/intersection" + ".json", content);
}

exports.config = config;

exports.getIndex = getIndex;
exports.readJson = readJson;
exports.writeJson = writeJson;

exports.has = has;
exports.next = next;
exports.merge = merge;
exports.isValidCombinationArrayIndex = isValidCombinationArrayIndex;
exports.getFormsCombination = getFormsCombination;
exports.getFormsCombinationAt = getFormsCombinationAt;