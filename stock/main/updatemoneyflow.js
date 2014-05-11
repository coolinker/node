console.time("run");
var moneyflowio = require("../moneyflow/io").config();
 
 moneyflowio.updateMoneyFlowData(0, function(){
      console.timeEnd("run");
 })

//moneyflowio.readMoneyFlowSync("SH600260");
