let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'mining' });
});

router.get('/getBlockTemplate', function(req, res, next) {
  res.json({ status: 'getBlockTemplate' });
});

router.get('/getMiningInfo', function(req, res, next) {
  res.json({ status: 'getMiningInfo' });
});

router.get('/getNetworkHashps', function(req, res, next) {
  res.json({ status: 'getNetworkHashps' });
});

router.get('/prioritiseTransaction', function(req, res, next) {
  res.json({ status: 'prioritiseTransaction' });
});

router.get('/submitBlock', function(req, res, next) {
  res.json({ status: 'submitBlock' });
});

module.exports = router;
