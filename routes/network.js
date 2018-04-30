let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'network' });
});

router.get('/addNode', function(req, res, next) {
  res.json({ status: 'addNode' });
});

router.get('/clearBanned', function(req, res, next) {
  res.json({ status: 'clearBanned' });
});

router.get('/disconnectNode', function(req, res, next) {
  res.json({ status: 'disconnectNode' });
});

router.get('/getAddedNodeInfo', function(req, res, next) {
  res.json({ status: 'getAddedNodeInfo' });
});

router.get('/getConnectionCount', function(req, res, next) {
  res.json({ status: 'getConnectionCount' });
});

router.get('/getNetTotals', function(req, res, next) {
  res.json({ status: 'getNetTotals' });
});

router.get('/getNetworkInfo', function(req, res, next) {
  res.json({ status: 'getNetworkInfo' });
});

router.get('/getPeerInfo', function(req, res, next) {
  res.json({ status: 'getPeerInfo' });
});

router.get('/ping', function(req, res, next) {
  res.json({ status: 'ping' });
});

router.get('/setBan', function(req, res, next) {
  res.json({ status: 'setBan' });
});

router.get('/setNetworkActive', function(req, res, next) {
  res.json({ status: 'setNetworkActive' });
});

module.exports = router;
