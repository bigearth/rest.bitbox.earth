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

let WormholeHTTP = axios.create({
  baseURL: process.env.WORMHOLE_RPC_BASEURL
});
let wh_username = process.env.WORMHOLE_RPC_USERNAME;
let wh_password = process.env.WORMHOLE_RPC_PASSWORD;

let config = {
  rawTransactionsRateLimit1: undefined,
  rawTransactionsRateLimit2: undefined,
  rawTransactionsRateLimit3: undefined,
  rawTransactionsRateLimit4: undefined,
  rawTransactionsRateLimit5: undefined,
  rawTransactionsRateLimit6: undefined,
  rawTransactionsRateLimit7: undefined,
  rawTransactionsRateLimit8: undefined,
  rawTransactionsRateLimit9: undefined,
  rawTransactionsRateLimit10: undefined,
  rawTransactionsRateLimit11: undefined
};

let i = 1;
while(i < 12) {
  config[`rawTransactionsRateLimit${i}`] = new RateLimit({
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

let whRequestConfig = {
  method: 'post',
  auth: {
    username: wh_username,
    password: wh_password
  },
  data: {
    jsonrpc: "1.0"
  }
};

router.get('/', config.rawTransactionsRateLimit1, (req, res, next) => {
  res.json({ status: 'rawtransactions' });
});

router.get('/decodeRawTransaction/:hex', config.rawTransactionsRateLimit2, (req, res, next) => {
  try {
    let transactions = JSON.parse(req.params.hex);
    if(transactions.length > 20) {
      res.json({
        error: 'Array too large. Max 20 transactions'
      });
    }
    let result = [];
    transactions = transactions.map((transaction) => {
      return BitboxHTTP({
        method: 'post',
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id:"decoderawtransaction",
          method: "decoderawtransaction",
          params: [
            transaction
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
    axios.all(transactions)
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
        id:"decoderawtransaction",
        method: "decoderawtransaction",
        params: [
          req.params.hex
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

router.get('/decodeScript/:script', config.rawTransactionsRateLimit3, (req, res, next) => {
  try {
    let scripts = JSON.parse(req.params.script);
    if(scripts.length > 20) {
      res.json({
        error: 'Array too large. Max 20 scripts'
      });
    }
    let result = [];
    scripts = scripts.map((script) => {
      return BitboxHTTP({
        method: 'post',
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id:"decodescript",
          method: "decodescript",
          params: [
            script
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
    axios.all(scripts)
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
        id:"decodescript",
        method: "decodescript",
        params: [
          req.params.script
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

router.get('/getRawTransaction/:txid', config.rawTransactionsRateLimit4, (req, res, next) => {
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
          id:"getrawtransaction",
          method: "getrawtransaction",
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
        id:"getrawtransaction",
        method: "getrawtransaction",
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

router.post('/sendRawTransaction/:hex', config.rawTransactionsRateLimit5, (req, res, next) => {
  try {
    let transactions = JSON.parse(req.params.hex);
    if(transactions.length > 20) {
      res.json({
        error: 'Array too large. Max 20 transactions'
      });
    }

    let result = [];
    transactions = transactions.map((transaction) => {
      return BitboxHTTP({
        method: 'post',
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id:"sendrawtransaction",
          method: "sendrawtransaction",
          params: [
            transaction
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
    axios.all(transactions)
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
        id:"sendrawtransaction",
        method: "sendrawtransaction",
        params: [
          req.params.hex
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

router.post('/change/:rawtx/:prevTxs/:destination/:fee', config.rawTransactionsRateLimit6, async (req, res, next) => {
  let params = [
    req.params.rawtx,
    JSON.parse(req.params.prevTxs),
    req.params.destination,
    parseFloat(req.params.fee)
  ];
  if(req.query.position) {
    params.push(parseInt(req.query.position));
  }

  whRequestConfig.data.id = "whc_createrawtx_change";
  whRequestConfig.data.method = "whc_createrawtx_change";
  whRequestConfig.data.params = params;

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    console.log(error.response.data)
    res.status(500).send(error.response.data.error.message);
  }
});

router.post('/input/:rawTx/:txid/:n', config.rawTransactionsRateLimit7, async (req, res, next) => {
  whRequestConfig.data.id = "whc_createrawtx_input";
  whRequestConfig.data.method = "whc_createrawtx_input";
  whRequestConfig.data.params = [
    req.params.rawTx,
    req.params.txid,
    parseInt(req.params.n)
  ];

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.post('/opReturn/:rawTx/:payload', config.rawTransactionsRateLimit8, async (req, res, next) => {
  whRequestConfig.data.id = "whc_createrawtx_opreturn";
  whRequestConfig.data.method = "whc_createrawtx_opreturn";
  whRequestConfig.data.params = [
    req.params.rawTx,
    req.params.payload
  ];

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.post('/reference/:rawTx/:destination', config.rawTransactionsRateLimit9, async (req, res, next) => {
  let params = [
    req.params.rawTx,
    req.params.destination
  ];
  if(req.query.amount) {
    params.push(req.query.amount);
  }

  whRequestConfig.data.id = "whc_createrawtx_reference";
  whRequestConfig.data.method = "whc_createrawtx_reference";
  whRequestConfig.data.params = params;

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.post('/decodeTransaction/:rawTx', config.rawTransactionsRateLimit10, async (req, res, next) => {
  let params = [
    req.params.rawTx
  ];
  if(req.query.prevTxs) {
    params.push(JSON.parse(req.query.prevTxs));
  }
  if(req.query.height) {
    params.push(req.query.height);
  }

  whRequestConfig.data.id = "whc_decodetransaction";
  whRequestConfig.data.method = "whc_decodetransaction";
  whRequestConfig.data.params = params;

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.post('/create/:inputs/:outputs', config.rawTransactionsRateLimit11, async (req, res, next) => {
  let params = [
    JSON.parse(req.params.inputs),
    JSON.parse(req.params.outputs)
  ];
  if(req.query.locktime) {
    params.push(req.query.locktime);
  }

  whRequestConfig.data.id = "createrawtransaction";
  whRequestConfig.data.method = "createrawtransaction";
  whRequestConfig.data.params = params;

  try {
    let response = await WormholeHTTP(whRequestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

module.exports = router;
