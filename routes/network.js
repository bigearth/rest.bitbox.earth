let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

router.get('/', (req, res, next) => {
  res.json({ status: 'network' });
});

// router.post('/addNode/:node/:command', (req, res, next) => {
//   BITBOX.Network.addNode(req.params.node, req.params.command)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//     });
// });
//
// router.post('/clearBanned', (req, res, next) => {
//   BITBOX.Network.clearBanned()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/disconnectNode/:address/:nodeid', (req, res, next) => {
//   BITBOX.Network.disconnectNode(req.params.address, req.params.nodeid)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.get('/getAddedNodeInfo/:node', (req, res, next) => {
//   BITBOX.Network.getAddedNodeInfo(req.params.node)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });

router.get('/getConnectionCount', (req, res, next) => {
  BITBOX.Network.getConnectionCount()
  .then((result) => {
    res.json(JSON.stringify(result));
  }, (err) => { console.log(err);
  });
});

router.get('/getNetTotals', (req, res, next) => {
  BITBOX.Network.getNetTotals()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkInfo', (req, res, next) => {
  BITBOX.Network.getNetworkInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getPeerInfo', (req, res, next) => {
  BITBOX.Network.getPeerInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/ping', (req, res, next) => {
  BITBOX.Network.ping()
  .then((result) => {
    res.json(JSON.stringify(result));
  }, (err) => { console.log(err);
  });
});
//
// router.post('/setBan/:subnet/:command', (req, res, next) => {
//   // TODO finish this
//   BITBOX.Network.getConnectionCount(req.params.subnet, req.params.command)
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/setNetworkActive/:state', (req, res, next) => {
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
