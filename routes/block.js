let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let BitboxHTTP = axios.create({
  baseURL: `http://167.99.110.201:18332/`
});
let username = 'bitcoin';
let password = 'rD9yw2Y9RkOnYjYnDX';

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

      axios.get(`https://explorer.bitcoin.com/api/bch/block/${response.data.result}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.send(error.response.data.error.message);
      });

    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  } else {
    axios.get(`https://explorer.bitcoin.com/api/bch/block/${req.params.id}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});

module.exports = router;
