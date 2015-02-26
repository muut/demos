
/* A minimal signed configuration */

var riot = require("./riot"), // muut.com/riotjs
  template = require('fs').readFileSync(__dirname + '/template.html', "utf-8");

function BASE64(str) {
  return (new Buffer(str)).toString('base64');
}

function SHA1(str) {
  var sum = require('crypto').createHash('sha1');
  sum.update(str);
  return sum.digest('hex');
}

require('http').createServer(function(req, res) {

  var data = {
    timestamp: Math.round(+new Date / 1000),
    message: BASE64(JSON.stringify({})),
    key: "testapikey"
  };

  data.signature = SHA1('testapisecretkey' + ' ' + data.message + ' ' + data.timestamp);

  res.writeHeader(200, { "Content-Type": "text/html" });
  res.write(riot.render(template, data));
  res.end();

}).listen(8080);

