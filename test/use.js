var lib = require('../lib');

lib.verifyKey({
  email: 'some-email@gmail.com',
  fingerprint: 'SOMEFINGERPRINT'
}, function (err, res) {
  console.log(res);
});

