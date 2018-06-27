let express = require('express');
let router = express.Router();
let axios = require('axios');
const request = require('request')
const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});

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
    fixieRequest(`http://194.14.246.69/api/tx/${req.params.txid}`, (err, result, body) => {
      let parsed = JSON.parse(body);
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
    });
  }
});



module.exports = router;
