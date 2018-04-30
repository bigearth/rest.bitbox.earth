let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'blockchain' });
});

router.get('/getBestBlockHash', function(req, res, next) {
  res.json({ status: 'getBestBlockHash' });
});

router.get('/getBlock', function(req, res, next) {
  res.json({ status: 'getBlock' });
});

router.get('/getBlockchainInfo', function(req, res, next) {
  res.json({ status: 'getBlockchainInfo' });
});

router.get('/getBlockCount', function(req, res, next) {
  res.json({ status: 'getBlockCount' });
});

router.get('/getBlockHash', function(req, res, next) {
  res.json({ status: 'getBlockHash' });
});

router.get('/getBlockHeader', function(req, res, next) {
  res.json({ status: 'getBlockHeader' });
});

router.get('/getChainTips', function(req, res, next) {
  res.json({ status: 'getChainTips' });
});

router.get('/getDifficulty', function(req, res, next) {
  res.json({ status: 'getDifficulty' });
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
  res.json({ status: 'getMempoolInfo' });
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
  res.json({ status: 'getTxOutSetInfo' });
});

router.get('/preciousBlock', function(req, res, next) {
  res.json({ status: 'preciousBlock' });
});

router.get('/pruneBlockchain', function(req, res, next) {
  res.json({ status: 'pruneBlockchain' });
});

router.get('/verifyChain', function(req, res, next) {
  res.json({ status: 'verifyChain' });
});

router.get('/verifyTxOutProof', function(req, res, next) {
  res.json({ status: 'verifyTxOutProof' });
});

module.exports = router;
