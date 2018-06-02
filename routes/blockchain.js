let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let BitboxHTTP = axios.create({
  baseURL: `http://138.68.54.100:8332/`
});
let username = 'bitcoin';
let password = 'xhFjluMJMyOXcYvF';

router.get('/', function(req, res, next) {
  res.json({ status: 'blockchain' });
});

router.get('/getBestBlockHash', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getbestblockhash",
      method: "getbestblockhash"
    }
  })
  .then((response) => {
    res.send(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlock/:hash', (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getblock",
      method: "getblock",
      params: [
        req.params.hash,
        verbose
      ]
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockchainInfo', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getblockchaininfo",
      method: "getblockchaininfo"
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockCount', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getblockcount",
      method: "getblockcount"
    }
  })
  .then((response) => {
    res.send(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockHash/:height', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getblockhash",
      method: "getblockhash",
      params: [
        parseInt(req.params.height)
      ]
    }
  })
  .then((response) => {
    res.send(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockHeader/:hash', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getblockheader",
      method: "getblockheader",
      params: [
        req.params.hash,
        verbose
      ]
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    // console.log(error)
    res.send(error.response.data.error.message);
  });
});

router.get('/getChainTips', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getchaintips",
      method: "getchaintips"
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getDifficulty', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getdifficulty",
      method: "getdifficulty"
    }
  })
  .then((response) => {
    res.send(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getMempoolAncestors/:txid', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getmempoolancestors",
      method: "getmempoolancestors",
      params: [
        req.params.txid,
        verbose
      ]
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    // console.log(error)
    res.send(error.response.data.error.message);
  });
});

router.get('/getMempoolDescendants/:txid', function(req, res, next) {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }
  BITBOX.Blockchain.getMempoolDescendants(req.params.txid, verbose)
  .then((result) => {
    res.send(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolEntry/:txid', function(req, res, next) {
  BITBOX.Blockchain.getMempoolEntry(req.params.txid)
  .then((result) => {
    res.send(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMempoolInfo', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getmempoolinfo",
      method: "getmempoolinfo"
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
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
    res.send(result);
  }, (err) => { console.log(err);
  });
});

router.get('/verifyChain', function(req, res, next) {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"verifychain",
      method: "verifychain"
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/verifyTxOutProof/:proof', function(req, res, next) {
  BITBOX.Blockchain.verifyTxOutProof(req.params.proof)
  .then((result) => {
    res.send(result);
  }, (err) => { console.log(err);
  });
});

module.exports = router;
