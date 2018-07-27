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
  blockRateLimit1: undefined,
  blockRateLimit2: undefined
};

let i = 1;
while(i < 3) {
  config[`blockRateLimit${i}`] = new RateLimit({
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

router.get('/', config.blockRateLimit1, (req, res, next) => {
  res.json({ status: 'block' });
});

router.get('/details/:id', config.blockRateLimit2, (req, res, next) => {
  if(req.params.id.length !== 64) {
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
          parseInt(req.params.id)
        ]
      }
    })
    .then((response) => {
      axios.get(`${process.env.BITCOINCOM_BASEURL}block/${response.data.result}`)
      .then((response) => {
        let parsed = response.data;
        res.json(parsed);
      })
      .catch((error) => {
        res.send(error.response.data.error.message);
      });
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  } else {
    axios.get(`${process.env.BITCOINCOM_BASEURL}block/${req.params.id}`)
    .then((response) => {
      let parsed = response.data;
      res.json(parsed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});

module.exports = router;
