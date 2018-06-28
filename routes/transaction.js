let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

router.get('/', (req, res, next) => {
  res.json({ status: 'transaction' });
});

router.get('/details/:txid', (req, res, next) => {
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
    axios.get(`${process.env.BITCOINCOM_BASEURL}tx/${req.params.txid}`)
    .then((response) => {
      let parsed = response.data;
      if(parsed && parsed.vin) {
        parsed.vin.forEach((vin) => {
          if(!vin.coinbase) {
            let address = vin.addr;
            vin.legacyAddress = BITBOX.Address.toLegacyAddress(address);
            vin.cashAddress = BITBOX.Address.toCashAddress(address);
            vin.value = vin.valueSat;
            delete vin.addr;
            delete vin.valueSat;
            delete vin.doubleSpentTxID;
          }
        });
      }
      res.json(parsed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});



module.exports = router;
