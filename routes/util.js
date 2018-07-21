let express = require('express');
let router = express.Router();
let axios = require('axios');

let BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
});
let username = process.env.RPC_USERNAME;
let password = process.env.RPC_PASSWORD;

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
