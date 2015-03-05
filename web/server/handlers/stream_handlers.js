var mongoose = require('mongoose');

utils = require('../utils/utils.js')

// TODO: mongoose connection 
var Stream = mongoose.model('Stream', {
  ID: {type: [String], index: true },
  creator: String
});

function createStream(req, res) {
  // TODO: consider auto increament ID.
  var streamID = utils.randomStreamID(6)
  var stream = new Stream({ ID: streamID });
  stream.save(function (err) {
    if (err) {
      console.log("Error saving stream.")
    }
  });
  res.send({
    status: 'SUCCESS',
    streamID: streamID
  })
}

exports.createStream = createStream
