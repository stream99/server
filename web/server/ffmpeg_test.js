var ffmpeg = require('fluent-ffmpeg');
/*
ffmpeg()
  .input('uploads/b398e262afcea09e9f1ed0b668840ca6.mp4')
  .save('uploads/b398e262afcea09e9f1ed0b668840ca6.m3u8');
*/
var exec = require('child_process').exec, child;

child = exec('ffmpeg -i uploads/b398e262afcea09e9f1ed0b668840ca6.mp4 -hls_list_size 1 uploads/b398e262afcea09e9f1ed0b668840ca6-1-segment.m3u8',
  function (error, stdout, stderr) {
  });

console.log("end")
