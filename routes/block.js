let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
});
let username = process.env.RPC_USERNAME;
let password = process.env.RPC_PASSWORD;

router.get('/', (req, res, next) => {
  res.json({ status: 'block' });
});

router.get('/details/:id', (req, res, next) => {
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
