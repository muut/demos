
var fs = require('fs'),
    url = require('url'),
    riot = require('./riot')

var test_user = {
  id: 'johndoe',
  avatar: '//cloudinary-a.akamaihd.net/moot/image/upload/t_d1-avatar/v1365823782/tipiirai.jpg',
  email: 'johndoe@acme.org',
  displayname: 'John Doe',
  is_admin: false
}

function read(filename) {
  try {
    return fs.readFileSync(__dirname + '/' + filename, 'utf-8')
  } catch (ignored) {}
}

// required cryptographic functions
function BASE64(str) {
  return (new Buffer(str)).toString('base64')
}

function SHA1(str) {
  var sum = require('crypto').createHash('sha1')
  sum.update(str)
  return sum.digest('hex')
}

// convenience method
String.prototype.has = function(str) {
  return this.indexOf(str) != -1
}

require('http').createServer(function(req, res) {

  var data = { key: 'testapikey', timestamp: Math.round(+new Date / 1000) },
      path = url.parse(req.url, true).pathname,
      html = read('default.html'),
      message = {}

  // favicon
  if (path.has('favicon')) return res.end()


  // commenting? (unrelated to SSO / signed config)
  if (path.has('flat')) data.path = '/comments:my-key'
  else if (path.has('comment')) data.path = '/comments'
  else if (path.length > 2) {
    message.user = test_user
    var pth = path.split('/').slice(-1)[0] + '.html'
    var str = read(pth)
    if (str) html = str
  }

  // SSO user
  if (path.has('sso')) message.user = test_user
  if (path.has('anon')) delete message.user


  data.message = BASE64(JSON.stringify(message))
  data.signature = SHA1('testapisecretkey' + ' ' + data.message + ' ' + data.timestamp)

  res.writeHeader(200, { 'Content-Type': 'text/html' })

  res.write(riot.render(html, data))
  res.end()

}).listen(80)

