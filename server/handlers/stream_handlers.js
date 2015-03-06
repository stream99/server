var mongoose = require('mongoose');
var sprintf = require('sprintf-js').sprintf;

utils = require('../utils/utils.js')
transcode = require('../transcode.js')

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
  res.json({
    status: 'SUCCESS',
    streamID: streamID
  })
}

exports.createStream = createStream

function uploadVideo(req, res) {
  console.log(req.files)
  file = req.files.upload
  transcode.transcode(file.path, sprintf("streams/%s/%s.m3u8", req.params.id, file.name.slice(0, -4)))
  res.json({
    streamID: req.params.id,
    timestamp: req.params.timestamp
  })
}

exports.uploadVideo = uploadVideo
