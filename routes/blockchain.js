let express = require('express');
let router = express.Router();
let axios = require('axios');
let RateLimit = require('express-rate-limit');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
});
let username = process.env.RPC_USERNAME;
let password = process.env.RPC_PASSWORD;

let config = {
  blockchainRateLimit1: undefined,
  blockchainRateLimit2: undefined,
  blockchainRateLimit3: undefined,
  blockchainRateLimit4: undefined,
  blockchainRateLimit5: undefined,
  blockchainRateLimit6: undefined,
  blockchainRateLimit7: undefined,
  blockchainRateLimit8: undefined,
  blockchainRateLimit9: undefined,
  blockchainRateLimit10: undefined,
  blockchainRateLimit11: undefined,
  blockchainRateLimit12: undefined,
  blockchainRateLimit13: undefined,
  blockchainRateLimit14: undefined,
  blockchainRateLimit15: undefined,
  blockchainRateLimit16: undefined
};

let i = 1;
while(i < 17) {
  config[`blockchainRateLimit${i}`] = new RateLimit({
    windowMs: 60*60*1000, // 1 hour window
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    max: 60, // start blocking after 60 requests
    handler: function (req, res, /*next*/) {
      res.format({
        json: function () {
          res.status(500).json({ error: 'Too many requests. Limits are 60 requests per minute.' });
        }
      });
    }
  });
  i++;
}

router.get('/', config.blockchainRateLimit1, (req, res, next) => {
  res.json({ status: 'blockchain' });
});

router.get('/getBestBlockHash', config.blockchainRateLimit2, (req, res, next) => {
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
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlock/:hash', config.blockchainRateLimit2, (req, res, next) => {
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

router.get('/getBlockchainInfo', config.blockchainRateLimit3, (req, res, next) => {
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

router.get('/getBlockCount', config.blockchainRateLimit4, (req, res, next) => {
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
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockHash/:height', config.blockchainRateLimit5, (req, res, next) => {
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
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getBlockHeader/:hash', config.blockchainRateLimit6, (req, res, next) => {
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

router.get('/getChainTips', config.blockchainRateLimit7, (req, res, next) => {
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

router.get('/getDifficulty', config.blockchainRateLimit8, (req, res, next) => {
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
    res.json(JSON.stringify(response.data.result));
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

router.get('/getMempoolAncestors/:txid', config.blockchainRateLimit9, (req, res, next) => {
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
    if(typeof respons.data.result === 'string') {
      res.send(response.data.result);
    } else {
      res.json(response.data.result);
    }
  })
  .catch((error) => {
    // console.log(error)
    res.send(error.response.data.error.message);
  });
});

router.get('/getMempoolDescendants/:txid', config.blockchainRateLimit10, (req, res, next) => {
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
      id:"getmempooldescendants",
      method: "getmempooldescendants",
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

router.get('/getMempoolEntry/:txid', config.blockchainRateLimit11, (req, res, next) => {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getmempoolentry",
      method: "getmempoolentry",
      params: [
        req.params.txid
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

router.get('/getMempoolInfo', config.blockchainRateLimit12, (req, res, next) => {
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

router.get('/getRawMempool', config.blockchainRateLimit13, (req, res, next) => {
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
      id:"getrawmempool",
      method: "getrawmempool",
      params: [
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

router.get('/getTxOut/:txid/:n', config.blockchainRateLimit14, (req, res, next) => {
  let include_mempool = false;
  if(req.query.include_mempool && req.query.include_mempool === 'true') {
    include_mempool = true;
  }

  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"gettxout",
      method: "gettxout",
      params: [
        req.params.txid,
        parseInt(req.params.n),
        include_mempool
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

router.get('/getTxOutProof/:txids', config.blockchainRateLimit15, (req, res, next) => {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"gettxoutproof",
      method: "gettxoutproof",
      params: [
        req.params.txids
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
//
// router.get('/preciousBlock/:hash', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"preciousblock",
//       method: "preciousblock",
//       params: [
//         req.params.hash
//       ]
//     }
//   })
//   .then((response) => {
//     res.json(JSON.stringify(response.data.result));
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.post('/pruneBlockchain/:height', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"pruneblockchain",
//       method: "pruneblockchain",
//       params: [
//         req.params.height
//       ]
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.get('/verifyChain', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"verifychain",
//       method: "verifychain"
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });

router.get('/verifyTxOutProof/:proof', config.blockchainRateLimit16, (req, res, next) => {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"verifytxoutproof",
      method: "verifytxoutproof",
      params: [
        req.params.proof
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

module.exports = router;
