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
  res.json({ status: 'blockchain' });
});

router.get('/getBestBlockHash', function(req, res, next) {
  BITBOX.Blockchain.getBestBlockHash()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getBlock', function(req, res, next) {
  res.json({ status: 'getBlock' });
});

router.get('/getBlockchainInfo', function(req, res, next) {
  BITBOX.Blockchain.getBlockchainInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockCount', function(req, res, next) {
  BITBOX.Blockchain.getBlockCount()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockHash', function(req, res, next) {
  res.json({ status: 'getBlockHash' });
});

router.get('/getBlockHeader', function(req, res, next) {
  res.json({ status: 'getBlockHeader' });
});

router.get('/getChainTips', function(req, res, next) {
  BITBOX.Blockchain.getChainTips()
  .then((result) => {
    res.json({result: result});
  }, (err) => { console.log(err);
  });
});

router.get('/getDifficulty', function(req, res, next) {
  BITBOX.Blockchain.getDifficulty()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolAncestors', function(req, res, next) {
  res.json({ status: 'getMempoolAncestors' });
});

router.get('/getMempoolDescendants', function(req, res, next) {
  res.json({ status: 'getMempoolDescendants' });
});

router.get('/getMempoolEntry', function(req, res, next) {
  res.json({ status: 'getMempoolEntry' });
});

router.get('/getMempoolInfo', function(req, res, next) {
  BITBOX.Blockchain.getMempoolInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getRawMempool', function(req, res, next) {
  res.json({ status: 'getRawMempool' });
});

router.get('/getTxOut', function(req, res, next) {
  res.json({ status: 'getTxOut' });
});

router.get('/getTxOutProof', function(req, res, next) {
  res.json({ status: 'getTxOutProof' });
});

router.get('/getTxOutSetInfo', function(req, res, next) {
  BITBOX.Blockchain.getTxOutSetInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/preciousBlock', function(req, res, next) {
  res.json({ status: 'preciousBlock' });
});

router.get('/pruneBlockchain', function(req, res, next) {
  res.json({ status: 'pruneBlockchain' });
});

router.get('/verifyChain', function(req, res, next) {
  BITBOX.Blockchain.verifyChain()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/verifyTxOutProof', function(req, res, next) {
  res.json({ status: 'verifyTxOutProof' });
});

module.exports = router;
