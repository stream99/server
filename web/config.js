exports.isProd = process.env.NODE_ENV === 'production'
exports.host = exports.isProd && '23.239.22.146'
exports.ports = {
  http: exports.isProd ? 80 : 2015,
  https: exports.isProd ? 443 : 2014
}
