var crypto = require('crypto')

function randomStreamID(length) {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(current_date + random).digest('hex').substring(0, length);
}

exports.randomStreamID = randomStreamID
