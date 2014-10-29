console.time("run");
var moneyflowio = require("../moneyflow/io").config();
 
 var start = Number(process.argv[2]?process.argv[2]:"0");

 moneyflowio.updateMoneyFlowData(start, function(){
      console.timeEnd("run");
 })

//moneyflowio.readMoneyFlowSync("SH600260");
