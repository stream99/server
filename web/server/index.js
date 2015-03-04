var cors = require('cors')
var compress = require('compression')
var debug = require('debug')('instant')
var express = require('express')
var http = require('http')
var https = require('https')
var jade = require('jade')
var parallel = require('run-parallel')
var path = require('path')
var url = require('url')

var config = require('../config')

var app = express()
var httpServer = http.createServer(app)

// Templating
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.set('x-powered-by', false)
app.engine('jade', jade.renderFile)

app.use(compress())

app.use(function (req, res, next) {
  // Force SSL
  if (config.isProd && req.protocol !== 'https')
    return res.redirect('https://' + (req.hostname || 'instant.io') + req.url)

  // Redirect www to non-www
  if (config.isProd && req.hostname === 'www.instant.io')
    return res.redirect('https://instant.io' + req.url)

  // Strict transport security (to prevent MITM attacks on the site)
  if (config.isProd)
    res.header('Strict-Transport-Security', 'max-age=31536000')

  // Add cross-domain header for fonts, required by spec, Firefox, and IE.
  var extname = path.extname(url.parse(req.url).pathname)
  if (['.eot', '.ttf', '.otf', '.woff'].indexOf(extname) >= 0)
    res.header('Access-Control-Allow-Origin', '*')

  // Prevents IE and Chrome from MIME-sniffing a response. Reduces exposure to
  // drive-by download attacks on sites serving user uploaded content.
  res.header('X-Content-Type-Options', 'nosniff')

  // Prevent rendering of site within a frame.
  res.header('X-Frame-Options', 'DENY')

  // Enable the XSS filter built into most recent web browsers. It's usually
  // enabled by default anyway, so role of this headers is to re-enable for this
  // particular website if it was disabled by the user.
  res.header('X-XSS-Protection', '1; mode=block')

  // Force IE to use latest rendering engine or Chrome Frame
  res.header('X-UA-Compatible', 'IE=Edge,chrome=1')

  next()
})

app.use(express.static(path.join(__dirname, '../static')))

app.get('/', function (req, res) {
  res.render('index')
})

app.get('*', function (req, res) {
  res.status(404).render('error', { message: '404 Not Found' })
})

// error handling middleware
app.use(function (err, req, res, next) {
  error(err)
  res.status(500).render('error', { message: err.message || err })
})

parallel([
  function (cb) {
    httpServer.listen(config.ports.http, config.host, cb)
  },
  function (cb) {
    // httpsServer.listen(config.ports.https, config.host, cb)
  }
], function (err) {
  if (err) throw err
  debug('listening on port %s', JSON.stringify(config.ports))
  util.downgradeUid()
})

function error (err) {
  console.error(err.stack || err.message || err)
}
