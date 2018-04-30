let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'rawtransaction' });
});

router.get('/decodeRawTransaction', function(req, res, next) {
  res.json({ status: 'decodeRawTransaction' });
});

router.get('/decodeScript', function(req, res, next) {
  res.json({ status: 'decodeScript' });
});

router.get('/getRawTransaction', function(req, res, next) {
  res.json({ status: 'getRawTransaction' });
});

router.get('/sendRawTransaction', function(req, res, next) {
  res.json({ status: 'sendRawTransaction' });
});

module.exports = router;
