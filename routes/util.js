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
  res.json({ status: 'util' });
});

router.get('/estimateSmartFee/:nblocks', function(req, res, next) {
  BITBOX.Util.estimateSmartFee(parseInt(req.params.nblocks))
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/estimateSmartPriority/:nblocks', function(req, res, next) {
  BITBOX.Util.estimateSmartPriority(parseInt(req.params.nblocks))
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/createMultisig/:nrequired/:keys', function(req, res, next) {
  BITBOX.Util.createMultisig(parseInt(req.params.nrequired), req.params.keys)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/estimateFee/:nblocks', function(req, res, next) {
  BITBOX.Util.estimateFee(parseInt(req.params.nblocks))
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/estimatePriority/:nblocks', function(req, res, next) {
  BITBOX.Util.estimatePriority(parseInt(req.params.nblocks))
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/signMessageWithPrivKey/:privkey/:message', function(req, res, next) {
  BITBOX.Util.signMessageWithPrivKey(req.params.privkey, req.params.message)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/validateAddress/:address', function(req, res, next) {
  BITBOX.Util.validateAddress(req.params.address)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/verifyMessage/:address/:signature/:message', function(req, res, next) {
  BITBOX.Util.verifyMessage(req.params.address, req.params.signature, req.params.message)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

module.exports = router;
