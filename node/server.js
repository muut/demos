
var riot = require("./riot"), // https://moot.it/riotjs/
  template = require('fs').readFileSync(__dirname + '/template.html', "utf-8");

function BASE64(str) {
  return (new Buffer(str)).toString('base64');
}

function SHA1(str) {
  var sum = require('crypto').createHash('sha1');
  sum.update(str);
  return sum.digest('hex');
}


require('http').createServer(function(request, response) {

  var data = {
    title: "Private forum",
    key: "testapikey",
    timestamp: Math.round(+new Date / 1000),
    message: BASE64(JSON.stringify({}))
  };

  data.signature = SHA1('testapisecretkey' + ' ' + data.message + ' ' + data.timestamp);

  response.writeHeader(200, { "Content-Type": "text/html" });
  response.write(riot.render(template, data));
  response.end();

}).listen(8022);

