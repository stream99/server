var mongoose = require('mongoose');
var sprintf = require('sprintf-js').sprintf;

utils = require('../utils/utils.js')

var allStreams = {};

// TODO: mongoose connection 
var StreamModel = mongoose.model('Stream', {
  ID: {type: [String], index: true },
  creator: String
});

function createStream(req, res) {
  // TODO: consider auto increament ID.
  var streamID = utils.randomStreamID(6)
  var streamModel = new StreamModel({ ID: streamID });
  streamModel.save(function (err) {
    if (err) {
      console.log("Error saving stream.")
    }
  });
  res.json({
    status: 'SUCCESS',
    streamID: streamID
  })
}

exports.createStream = createStream

// TODO: remove following block
var Stream = require('../stream.js').Stream;
var options = {
  dir: 'videos/',
  playlist: 'stream1',
  bufferSize: 10
};
var stream = new Stream(options);

function uploadVideo(req, res) {
  console.log(req.files);
  file = req.files.upload;
  stream.append(file.path, req.params.timestamp);
  res.json({
    streamID: req.params.id,
    timestamp: req.params.timestamp
  })
}

exports.uploadVideo = uploadVideo
