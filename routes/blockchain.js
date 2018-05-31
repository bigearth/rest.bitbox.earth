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

router.get('/getBlock/:hash', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getBlock(req.params.hash, verbose)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockchainInfo', function(req, res, next) {
  BITBOX.Blockchain.getBlockchainInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockCount', function(req, res, next) {
  BITBOX.Blockchain.getBlockCount()
  .then((result) => {
    res.json(JSON.stringify(result));
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockHash/:height', function(req, res, next) {
  BITBOX.Blockchain.getBlockHash(req.params.height)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getBlockHeader/:hash', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getBlockHeader(req.params.hash, verbose)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getChainTips', function(req, res, next) {
  BITBOX.Blockchain.getChainTips()
  .then((result) => {
    res.json(result);
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

router.get('/getMempoolAncestors/:txid', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getMempoolAncestors(req.params.txid, verbose)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolDescendants/:txid', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getMempoolDescendants(req.params.txid, verbose)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolEntry/:txid', function(req, res, next) {
  BITBOX.Blockchain.getMempoolEntry(req.params.txid)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolInfo', function(req, res, next) {
  BITBOX.Blockchain.getMempoolInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getRawMempool', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getRawMempool(verbose)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getTxOut/:txid/:n', function(req, res, next) {
  let include_mempool = false;
  if(req.query.include_mempool && req.query.include_mempool === 'true') {
    include_mempool = true;
  }
  BITBOX.Blockchain.getTxOut(req.params.txid, parseInt(req.params.n), include_mempool)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getTxOutProof/:txids', function(req, res, next) {
  // TODO finish this
  BITBOX.Blockchain.getTxOutProof(req.params.txids)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/preciousBlock/:hash', function(req, res, next) {
  BITBOX.Blockchain.preciousBlock(req.params.hash)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.post('/pruneBlockchain/:height', function(req, res, next) {
  BITBOX.Blockchain.pruneBlockchain(req.params.height)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/verifyChain', function(req, res, next) {
  // TODO finish this
  BITBOX.Blockchain.verifyChain()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/verifyTxOutProof/:proof', function(req, res, next) {
  BITBOX.Blockchain.verifyTxOutProof(req.params.proof)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

module.exports = router;
