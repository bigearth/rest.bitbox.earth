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
  rawTransactionsRateLimit1: undefined,
  rawTransactionsRateLimit2: undefined,
  rawTransactionsRateLimit3: undefined,
  rawTransactionsRateLimit4: undefined,
  rawTransactionsRateLimit5: undefined,
};

let i = 1;
while(i < 6) {
  config[`rawTransactionsRateLimit${i}`] = new RateLimit({
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

router.get('/', config.rawTransactionsRateLimit1, (req, res, next) => {
  res.json({ status: 'rawtransactions' });
});

router.get('/decodeRawTransaction/:hex', config.rawTransactionsRateLimit2, (req, res, next) => {
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
});

router.get('/decodeScript/:script', config.rawTransactionsRateLimit3, (req, res, next) => {
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
});

router.get('/getRawTransaction/:txid', config.rawTransactionsRateLimit4, (req, res, next) => {
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
});

router.post('/sendRawTransaction/:hex', config.rawTransactionsRateLimit5, (req, res, next) => {
  try {
    let transactions = JSON.parse(req.params.hex);
    let result = [];
    transactions = transactions.map((transaction) => {
      return BITBOX.RawTransactions.sendRawTransaction(transaction)
    })
    axios.all(transactions)
    .then(axios.spread((...spread) => {
      result.push(...spread);
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

module.exports = router;
