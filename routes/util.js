let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

//testnet creds
// let BitboxHTTP = axios.create({
//   baseURL: `http://167.99.110.201:18332/`
// });
// let username = 'bitcoin';
// let password = 'rD9yw2Y9RkOnYjYnDX';

// mainnet creds
let BitboxHTTP = axios.create({
  baseURL: `http://138.68.54.100:8332/`
});
let username = 'bitcoin';
let password = 'xhFjluMJMyOXcYvF';

router.get('/', (req, res, next) => {
  res.json({ status: 'util' });
});

router.get('/validateAddress/:address', (req, res, next) => {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"validateaddress",
      method: "validateaddress",
      params: [
        req.params.address
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
