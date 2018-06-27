let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

//testnet creds
let BitboxHTTP = axios.create({
  baseURL: `http://167.99.110.201:18332/`
});
let username = 'bitcoin';
let password = 'rD9yw2Y9RkOnYjYnDX';

// mainnet creds
// let BitboxHTTP = axios.create({
//   baseURL: `http://138.68.54.100:8332/`
// });
// let username = 'bitcoin';
// let password = 'xhFjluMJMyOXcYvF';

router.get('/', (req, res, next) => {
  res.json({ status: 'rawtransactions' });
});

router.get('/decodeRawTransaction/:hex', (req, res, next) => {
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

router.get('/decodeScript/:script', (req, res, next) => {
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

router.get('/getRawTransaction/:txid', (req, res, next) => {
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

router.post('/sendRawTransaction/:hex', (req, res, next) => {
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
    res.send(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

module.exports = router;
