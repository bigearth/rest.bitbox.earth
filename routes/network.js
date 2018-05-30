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

// router.post('/addNode/:node/:command', function(req, res, next) {
//   BITBOX.Network.addNode(req.params.node, req.params.command)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//     });
// });
//
// router.post('/clearBanned', function(req, res, next) {
//   BITBOX.Network.clearBanned()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/disconnectNode/:address/:nodeid', function(req, res, next) {
//   BITBOX.Network.disconnectNode(req.params.address, req.params.nodeid)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.get('/getAddedNodeInfo/:node', function(req, res, next) {
//   BITBOX.Network.getAddedNodeInfo(req.params.node)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });

router.get('/getConnectionCount', function(req, res, next) {
  BITBOX.Network.getConnectionCount()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getNetTotals', function(req, res, next) {
  BITBOX.Network.getNetTotals()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkInfo', function(req, res, next) {
  BITBOX.Network.getNetworkInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getPeerInfo', function(req, res, next) {
  BITBOX.Network.getPeerInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/ping', function(req, res, next) {
  BITBOX.Network.ping()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});
//
// router.post('/setBan/:subnet/:command', function(req, res, next) {
//   // TODO finish this
//   BITBOX.Network.getConnectionCount(req.params.subnet, req.params.command)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/setNetworkActive/:state', function(req, res, next) {
//   let state = true;
//   if(req.params.state  && req.params.state === 'false') {
//     state = false;
//   }
//   BITBOX.Network.getConnectionCount(state)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });

module.exports = router;
