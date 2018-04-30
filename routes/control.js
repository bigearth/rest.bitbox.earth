let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'control' });
});

router.get('/getInfo', function(req, res, next) {
  res.json({ status: 'getInfo' });
});

router.get('/getMemoryInfo', function(req, res, next) {
  res.json({ status: 'getMemoryInfo' });
});

router.get('/help', function(req, res, next) {
  res.json({ status: 'help' });
});

router.get('/stop', function(req, res, next) {
  res.json({ status: 'stop' });
});

module.exports = router;
