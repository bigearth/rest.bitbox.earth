let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: "138.68.54.100",
  port: "8332",
  username: "bitcoin",
  password: "xhFjluMJMyOXcYvF"
});

let axios = require('axios');

router.get('/', function(req, res, next) {
  res.json({ status: 'transaction' });
});

router.get('/details/:txid', function(req, res, next) {
  let txid;
  try {
    txs = JSON.parse(req.params.txid);
    let result = [];
    txs = txs.map(function(tx) {
      return BITBOX.Transaction.details(tx)
    })
    axios.all(txs)
    .then(axios.spread(function (...spread) {
      result.push(...spread);
      res.json(result);
    }));
  }
  catch(error) {
    axios.get(`https://explorer.bitcoin.com/api/bch/addr/${BITBOX.Address.toLegacyAddress(address)}`)
    .then((result) => {
      res.json(result);
    });
  }
});



module.exports = router;
