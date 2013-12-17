
var url = require('url'),
    riot = require("./riot"), // moot.it/riotjs
    template = require('fs').readFileSync(__dirname + '/template.html', "utf-8"),

  test_user = {
    id: "johndoe",
    avatar: '//cloudinary-a.akamaihd.net/moot/image/upload/t_d1-avatar/v1365823782/tipiirai.jpg',
    email: "johndoe@acme.org",
    displayname: "John Doe",
    is_admin: false
  };

// required cryptographic functions
function BASE64(str) {
  return (new Buffer(str)).toString('base64');
}

function SHA1(str) {
  var sum = require('crypto').createHash('sha1');
  sum.update(str);
  return sum.digest('hex');
}

// convenience method
String.prototype.has = function(str) {
  return this.indexOf(str) != -1;
}

require('http').createServer(function(req, res) {

  var path = url.parse(req.url, true).pathname,
      message = {};

  // SSO user
  if (path.has("sso")) message.user = path.has("anon") ? {} : test_user;

  // signed config
  var data = {
    key: "testapikey",
    timestamp: Math.round(+new Date / 1000),
    message: BASE64(JSON.stringify(message)),
  };

  data.signature = SHA1('testapisecretkey' + ' ' + data.message + ' ' + data.timestamp);

  // commenting? (unrelated to SSO / signed config)
  if (path.has("comment")) data.path = "/comments";
  if (path.has("flat")) data.path = "/comments:my-key";

  res.writeHeader(200, { "Content-Type": "text/html" });
  res.write(riot.render(template, data));
  res.end();

}).listen(80);

