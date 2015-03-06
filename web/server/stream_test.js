var Stream = require('./stream.js').Stream

var options = {
  dir: 'tmp1',
  playlist: 'my_playlist',
  bufferSize: 5
};

var s = new Stream(options);

console.log(s);

for (var i = 0; i < 8; ++i) {
  s.append('videos/sample/sintel_trailer-480p_' + i + '.mp4', i + 100);
}
