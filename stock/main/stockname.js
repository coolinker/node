var fs = require("fs");

var http = require("http");
var options = {
  hostname: 'hq.sinajs.cn',
  port: 80,
  path: '/list=sh600066',
  method: 'GET'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('GB-18030');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
    fs.writeFileSync("../config/stocknames.json", chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.end();