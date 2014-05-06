var klineutil = require("../klineutil");
var bullklineforms = require("./bullklineforms");
var math = require("../../mathutil");
var fs = require("fs");

var klineformanalyser = require("../form/analyser").config({
  startDate: startDate,
  endDate: endDate
});

var startDate = new Date("01/01/2005");
var endDate = new Date("01/01/2014");

var intersectionsMap = {};
var intersetionArray = [];
var combinationArrayIndex = -1;
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

  //if (combinationArrayIndex>4500) return false;

  if (this.has(this.getFormsCombination())) return this.next();

  return true;
}

function has(forms) {
  var key = forms.toString();
  return !!intersectionsMap[key];
}

function matchRatio(forms) {

  var maxRatio = 0;
  var mRatioForms;
  for (var i=3; i>0; i--) {
    var len = forms.length;
    if (len<i)  continue;
    var idxArr = math.CArr(len,i);
    
    for (var j=0; j<idxArr.length; j++) {
      var formsStr = itemsAtIndexs(forms, idxArr[j]).toString();

      var obj = intersectionsMap[formsStr];
      //console.log(formsStr, obj)
      if (obj && obj.ratio>maxRatio) {
          maxRatio = obj.ratio;
          mRatioForms = formsStr;
      }

    }

  }
  //if (forms.length>3)
  //console.log(maxRatio, mRatioForms, " of ", forms);
  return maxRatio;
}

function itemsAtIndexs(forms, idxs) {
  var items = [];
  for (var i=0; i<idxs.length; i++) {
    items.push(forms[idxs[i]])
  }
  return items;
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
  if(fs.existsSync("../config/intersection.json")) {
    var content = fs.readFileSync("../config/intersection" + ".json")
    intersectionsMap = JSON.parse(content);

    for (var att in intersectionsMap) {
      var obj = intersectionsMap[att];
      obj.ratio = Number((obj.win/obj.total).toFixed(4));
        // if(obj.ratio>0.8 && obj.total>500 && att.indexOf("bullPulsing")>-1)
        //   console.log("readJson:",att,  JSON.stringify(obj));
    }
  }
}

function writeJson() {
  var content = JSON.stringify(intersectionsMap);
  fs.writeFileSync("../config/intersection" + ".json", content);
}

exports.config = config;

exports.getIndex = getIndex;
exports.readJson = readJson;
exports.writeJson = writeJson;

exports .matchRatio = matchRatio;

exports.has = has;
exports.next = next;
exports.merge = merge;
exports.isValidCombinationArrayIndex = isValidCombinationArrayIndex;
exports.getFormsCombination = getFormsCombination;
exports.getFormsCombinationAt = getFormsCombinationAt;