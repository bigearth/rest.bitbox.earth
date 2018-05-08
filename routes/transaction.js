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
  try {
    let txs = JSON.parse(req.params.txid);
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
    axios.get(`https://explorer.bitcoin.com/api/bch/tx/${req.params.txid}`)
    .then((result) => {
      if(result.data && result.data.vin) {
        result.data.vin.forEach((vin) => {
          let address = vin.addr;
          vin.legacyAddress = BITBOX.Address.toLegacyAddress(address);
          vin.cashAddress = BITBOX.Address.toCashAddress(address);
          vin.value = vin.valueSat;
          delete vin.addr;
          delete vin.valueSat;
          delete vin.doubleSpentTxID;
        });
      }
      res.json(result.data);
    });
  }
});



module.exports = router;
