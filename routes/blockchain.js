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
    windowMs: 60000, // 1 hour window
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

let requestConfig = {
  method: 'post',
  auth: {
    username: username,
    password: password
  },
  data: {
    jsonrpc: "1.0"
  }
};

router.get('/', config.blockchainRateLimit1, async (req, res, next) => {
  res.json({ status: 'blockchain' });
});

router.get('/getBestBlockHash', config.blockchainRateLimit2, async (req, res, next) => {
  requestConfig.data.id = "getbestblockhash";
  requestConfig.data.method = "getbestblockhash";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getBlock/:hash', config.blockchainRateLimit2, async (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  requestConfig.data.id = "getblock";
  requestConfig.data.method = "getblock";
  requestConfig.data.params = [
    req.params.hash,
    verbose
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getBlockchainInfo', config.blockchainRateLimit3, async (req, res, next) => {
  requestConfig.data.id = "getblockchaininfo";
  requestConfig.data.method = "getblockchaininfo";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getBlockCount', config.blockchainRateLimit4, async (req, res, next) => {
  requestConfig.data.id = "getblockcount";
  requestConfig.data.method = "getblockcount";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getBlockHash/:height', config.blockchainRateLimit5, async (req, res, next) => {
  try {
    let heights = JSON.parse(req.params.height);
    if(heights.length > 20) {
      res.json({
        error: 'Array too large. Max 20 heights'
      });
    }
    let result = [];
    heights = heights.map((height) => {
      return BitboxHTTP({
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
            height
          ]
        }
      })
      .catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          };
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          };
        }
      })
    })
    axios.all(heights)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data.result;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
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
  }
});

router.get('/getBlockHeader/:hash', config.blockchainRateLimit6, async (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  try {
    let hashes = JSON.parse(req.params.hash);
    if(hashes.length > 20) {
      res.json({
        error: 'Array too large. Max 20 hashes'
      });
    }
    let result = [];
    hashes = hashes.map((hash) => {
      return BitboxHTTP({
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
            hash,
            verbose
          ]
        }
      })
      .catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          };
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          };
        }
      })
    })
    axios.all(hashes)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data.result;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
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
      res.send(error.response.data.error.message);
    });
  }
});

router.get('/getChainTips', config.blockchainRateLimit7, async (req, res, next) => {
  requestConfig.data.id = "getchaintips";
  requestConfig.data.method = "getchaintips";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getDifficulty', config.blockchainRateLimit8, async (req, res, next) => {
  requestConfig.data.id = "getdifficulty";
  requestConfig.data.method = "getdifficulty";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getMempoolAncestors/:txid', config.blockchainRateLimit9, async (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  try {
    let txids = JSON.parse(req.params.txid);
    if(txids.length > 20) {
      res.json({
        error: 'Array too large. Max 20 txids'
      });
    }
    let result = [];
    txids = txids.map((txid) => {
      return BitboxHTTP({
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
            txid,
            verbose
          ]
        }
      })
      .catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          };
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          };
        }
      })
    })
    axios.all(txids)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data.result;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
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
      res.send(error.response.data.error.message);
    });
  }
});

router.get('/getMempoolDescendants/:txid', config.blockchainRateLimit10, async (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  try {
    let txids = JSON.parse(req.params.txid);
    if(txids.length > 20) {
      res.json({
        error: 'Array too large. Max 20 txids'
      });
    }
    let result = [];
    txids = txids.map((txid) => {
      return BitboxHTTP({
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
            txid,
            verbose
          ]
        }
      })
      .catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          };
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          };
        }
      })
    })
    axios.all(txids)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data.result;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
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
      res.send(error.response.data.error.message);
    });
  }
});

router.get('/getMempoolEntry/:txid', config.blockchainRateLimit11, async (req, res, next) => {
  try {
    let txids = JSON.parse(req.params.txid);
    if(txids.length > 20) {
      res.json({
        error: 'Array too large. Max 20 txids'
      });
    }
    let result = [];
    txids = txids.map((txid) => {
      return BitboxHTTP({
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
            txid
          ]
        }
      })
      .catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          };
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          };
        }
      })
    })
    axios.all(txids)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data.result;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
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
  }
});

router.get('/getMempoolInfo', config.blockchainRateLimit12, async (req, res, next) => {
  requestConfig.data.id = "getmempoolinfo";
  requestConfig.data.method = "getmempoolinfo";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getRawMempool', config.blockchainRateLimit13, async (req, res, next) => {
  let verbose = false;
  if(req.query.verbose && req.query.verbose === 'true') {
    verbose = true;
  }

  requestConfig.data.id = "getrawmempool";
  requestConfig.data.method = "getrawmempool";
  requestConfig.data.params = [
    verbose
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getTxOut/:txid/:n', config.blockchainRateLimit14, async (req, res, next) => {
  let include_mempool = false;
  if(req.query.include_mempool && req.query.include_mempool === 'true') {
    include_mempool = true;
  }

  requestConfig.data.id = "gettxout";
  requestConfig.data.method = "gettxout";
  requestConfig.data.params = [
    req.params.txid,
    parseInt(req.params.n),
    include_mempool
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getTxOutProof/:txids', config.blockchainRateLimit15, async (req, res, next) => {
  requestConfig.data.id = "gettxoutproof";
  requestConfig.data.method = "gettxoutproof";
  requestConfig.data.params = [
    req.params.txids
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});
//
// router.get('/preciousBlock/:hash', async (req, res, next) => {
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
// router.post('/pruneBlockchain/:height', async (req, res, next) => {
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
// router.get('/verifyChain', async (req, res, next) => {
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

router.get('/verifyTxOutProof/:proof', config.blockchainRateLimit16, async (req, res, next) => {
  requestConfig.data.id = "verifytxoutproof";
  requestConfig.data.method = "verifytxoutproof";
  requestConfig.data.params = [
    req.params.proof
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

module.exports = router;
