var child_process = require('child_process');
var spawn = child_process.spawn;
var bufferStream = require('./stream-buffer');


var parseKeyOutput = function (keyOutput) {

  var key = {};

  var splitColons = function (line) {
    var colons = line.split(':');
    return colons;
  };

  var lines = keyOutput.split('\n');

  key.fingerprint = splitColons(lines[0])[4];
  
  return key;
};


var getKey = function (data, callback) {

  var email = data.email;

  var searchCommand = ['gpg', ['--search-keys', email]];
  var exportCommand = ['gpg', ['--armor', '--export', email]];
  var fingerprintCommand = ['gpg', ['--with-fingerprint', '--with-colons']];


  var exportProcess = spawn.apply(spawn, exportCommand);
  var keyOutputProcess = spawn.apply(spawn, fingerprintCommand);


  exportProcess.stdout.pipe(keyOutputProcess.stdin);

  var exportOutput = '';
  bufferStream(exportProcess.stdout, function (err, data) {
    if (err) return callback(err);

    exportOutput = data;

    console.log('exportOutput:', exportOutput);
  });

  var keyOutput = '';
  bufferStream(keyOutputProcess.stdout, function (err, data) {
    if (err) return callback(err);

    keyOutput = data;

    console.log('keyOutput:', keyOutput);

    var key = parseKeyOutput(keyOutput);

    callback(null, key);
  });

};


var verifyKey = function (data, callback) {

  getKey({
    email: data.email
  }, function (err, key) {

    var res = {
      key: key
    };

    if (key.fingerprint !== data.fingerprint) {
      res.verified = false;
      return callback(null, res);
    }
    else {
      res.verified = true;
      return callback(null, res);
    }

  });

};


module.exports = {
  verifyKey: verifyKey,
  getKey: getKey
};
