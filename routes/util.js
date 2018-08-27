let express = require('express');
let router = express.Router();
let axios = require('axios');
let RateLimit = require('express-rate-limit');

let BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
});
let username = process.env.RPC_USERNAME;
let password = process.env.RPC_PASSWORD;

let config = {
  utilRateLimit1: undefined,
  utilRateLimit2: undefined
};

let i = 1;
while(i < 3) {
  config[`utilRateLimit${i}`] = new RateLimit({
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

router.get('/', config.utilRateLimit1, async (req, res, next) => {
  res.json({ status: 'util' });
});

router.get('/validateAddress/:address', config.utilRateLimit2, async (req, res, next) => {
  requestConfig.data.id = "validateaddress";
  requestConfig.data.method = "validateaddress";
  requestConfig.data.params = [
    req.params.address
  ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

module.exports = router;
