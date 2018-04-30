let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: "138.68.54.100",
  port: "8332",
  username: "bitcoin",
  password: "xhFjluMJMyOXcYvF"
});

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
  BITBOX.Network.getConnectionCount()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getNetTotals', function(req, res, next) {
  BITBOX.Network.getNetTotals()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkInfo', function(req, res, next) {
  BITBOX.Network.getNetworkInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getPeerInfo', function(req, res, next) {
  BITBOX.Network.getPeerInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/ping', function(req, res, next) {
  BITBOX.Network.ping()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/setBan', function(req, res, next) {
  res.json({ status: 'setBan' });
});

router.get('/setNetworkActive', function(req, res, next) {
  res.json({ status: 'setNetworkActive' });
});

module.exports = router;
