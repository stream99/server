var sprintf = require('sprintf-js').sprintf;
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;


TARGET_DURATION = 5

HEADER = 
'#EXTM3U\n' +
'#EXT-X-VERSION:3\n' +
'#EXT-X-TARGETDURATION:' + TARGET_DURATION + '\n';

// The Stream object maintains a m3u8 playlist as new videos are appended to achieve live content streaming.
//
// TODO: !!! This class is completely broken under race condition. !!!
function Stream(options) {
  this._playlist = options.playlist;
  this._playlistDir = path.join(options.dir, this._playlist)
  this._tsDir = path.join(this._playlistDir, 'ts');
  this._bufferSize = options.bufferSize;
  this._segments = [];
  this._baseSegmentId = 0;

  var that = this;
  fs.mkdir(this._playlistDir, function (err) {
    // dir may already exist
    // if (err) throw err;
    fs.mkdir(that._tsDir, function (err) {
      // if (err) throw err;
    });
  });
}

Stream.prototype.append = function(video, ts) {
  // To simplify, convert a mp4 to ONE ts file + m3u8 file.
  // Ignores the generated m3u8 and append the ts file to the stream.
  
  // This assumes the the video is less than 5 seconds in length. 
  // TODO: revisit this.
  
  // video arrived out of order, discard old one.
  // TODO: fix this.
  if (this._segments.length && ts < this._segments[this._segments.length - 1].time) {
    console.log("Discarding stale video ", video, ts);
    return;
  }

  var that = this;
  var transcodeDir = path.join(this._playlistDir, '_transcode_' + ts);

  fs.mkdir(transcodeDir, function(err) {
    if (err) throw err;

    var tmpTranscodePlaylist = path.join(transcodeDir, 'output.m3u8');
    
    var child = exec(
        sprintf('ffmpeg -i %s -hls_list_size 1 -hls_time %d %s', video, TARGET_DURATION, tmpTranscodePlaylist),
        function (error, stdout, stderr) {
          if (error) {
            throw error;
          } 
          
          fs.readdir(transcodeDir, function(err, files) {
            file = files[files.length - 1];
            that._appendSegment({
              file: path.join(transcodeDir, file), // TODO
              time: ts
            }, function () {
              console.log("In callback: ", transcodeDir);
              exec('rm -rf ' + transcodeDir);
            });
          });
      });
  });
}

Stream.prototype._appendSegment = function(segment, callback) {
  // TODO: this is stupid.
  if (this._segments.length && segment.time < this._segments[this._segments.length - 1].time) {
    console.log("Discarding stale segment ", segment);
    callback();
    return;
  }
  this._segments.push(segment);
  
  var newSegmentId = this._segments.length - 1;  
  var newFileName = path.join(this._tsDir, newSegmentId + '.ts');
  
  var that = this;
  fs.rename(segment.file, newFileName, function (err) {
    if (err) throw err;
    segment.file = newFileName
    that._finalize(callback);
  });

  if (this._segments.length > this._bufferSize) {
    this._baseSegmentId += this._segments.length - this._bufferSize;

    for (var i = 0; i < this._segments.length - this._bufferSize; ++i) {
      fs.unlink(this._segments[i].file);
    }

    this._segments.slice(- this._bufferSize);
  }
}

Stream.prototype._finalize = function(callback) {
  var pl = '';
  pl += HEADER;
  pl += '#EXT-X-MEDIA-SEQUENCE:' + this._baseSegmentId + '\n';
  var that = this;
  this._segments.forEach(function(element, index) {
    pl += '#EXTINF:' + TARGET_DURATION + '\n';
    pl += 'ts/' + path.basename(element.file) + '\n';
  });

  console.log("Playlist: ", pl);
  fs.writeFile(path.join(this._playlistDir, 'live.m3u8'), pl, function(err) {
    if (err) throw err;
  });

  callback();
}

exports.Stream = Stream
