var a = 1;
var _obj = {
    method1: function(){
        console.log("a=",a);
    }

}

module.exports = function(opts){
    a = opts;
    return _obj;
}