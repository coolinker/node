// var a = 1;
// var _obj = {
//     method1: function(){
//         console.log("a=",a);
//     }

// }

// module.exports = function(opts){
//     a = opts;
//     return _obj;
// }

module.exports = function(opts){
    var analyser = require("../../klineform/analyser");
    analyser.config(opts);
    return analyser;
}
