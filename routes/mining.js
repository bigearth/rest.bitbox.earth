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
  miningRateLimit1: undefined,
  miningRateLimit2: undefined,
  miningRateLimit3: undefined
};

let i = 1;
while(i < 4) {
  config[`miningRateLimit${i}`] = new RateLimit({
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

router.get('/', config.miningRateLimit1, async (req, res, next) => {
  res.json({ status: 'mining' });
});
//
// router.get('/getBlockTemplate/:templateRequest', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"getblocktemplate",
//       method: "getblocktemplate",
//       params: [
//         req.params.templateRequest
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

router.get('/getMiningInfo', config.miningRateLimit2, async (req, res, next) => {
  requestConfig.data.id = "getmininginfo";
  requestConfig.data.method = "getmininginfo";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});

router.get('/getNetworkHashps', config.miningRateLimit3, async (req, res, next) => {
  requestConfig.data.id = "getnetworkhashps";
  requestConfig.data.method = "getnetworkhashps";
  requestConfig.data.params = [ ];

  try {
    let response = await BitboxHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error.message);
  }
});
//
// router.post('/submitBlock/:hex', (req, res, next) => {
//   let parameters = '';
//   if(req.query.parameters && req.query.parameters !== '') {
//     parameters = true;
//   }
//
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"submitblock",
//       method: "submitblock",
//       params: [
//         req.params.hex,
//         parameters
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

module.exports = router;
