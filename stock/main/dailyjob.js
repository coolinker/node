
//var spawn = require("child_process").spawn("cmd_dailyjob");
var spawn = require('child_process').spawn;

var now = new Date();
var hours = now.getHours();
var mins = now.getMinutes()/60;
var wait = ((24-(hours+mins)+6.4)%24)*3600*1000;
console.log("wait", (24-(hours+mins)+6.4)%24);
setTimeout(doCommand, wait);

function doCommand () {
    console.log("doCommand", new Date())
    ls    = spawn("cmd_dailyjob.bat");
    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    ls.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
    setTimeout(doCommand, 24*3600*1000)
}
