module.exports = function (stream, callback) {
  var buffer = '';
  var err;
  stream.on('data', function (data) {
    buffer += data;
  });
  stream.on('end', function () {
    callback(err, buffer);
  });
  stream.on('error', function (e) {
    err = e;
  });
};
