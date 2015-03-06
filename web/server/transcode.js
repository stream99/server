var ffmpeg = require('fluent-ffmpeg');

function transcode(input, output) {
  ffmpeg()
    .input(input)
    .save(output);
}

exports.transcode = transcode
