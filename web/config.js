exports.isProd = process.env.NODE_ENV === 'production'
exports.forceSSL = false
exports.host = exports.isProd && '54.65.160.93'
exports.ports = {
  http: exports.isProd ? 80 : 2015,
  https: exports.isProd ? 443 : 2014
}
