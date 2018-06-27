let express = require('express');
let router = express.Router();
let axios = require('axios');
const request = require('request')
const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

router.get('/', (req, res, next) => {
  res.json({ status: 'address' });
});

router.get('/details/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    let result = [];
    addresses = addresses.map((address) => {
      return BITBOX.Address.details(address)
    })
    axios.all(addresses)
    .then(axios.spread((...spread) => {
      result.push(...spread);
      res.json(result);
    }));
  }
  catch(error) {
    let path = `http://194.14.246.69/api/addr/${BITBOX.Address.toLegacyAddress(req.params.address)}`;
    if(req.query.from && req.query.to) {
      path = `${path}?from=${req.query.from}&to=${req.query.to}`;
    }

    fixieRequest(path, (err, result, body) => {
      let parsed = JSON.parse(body);
      delete parsed.addrStr;
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
      parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
      res.json(parsed);
    });
  }
});

router.get('/utxo/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    let result = [];
    addresses = addresses.map((address) => {
      return BITBOX.Address.utxo(address)
    })
    axios.all(addresses)
    .then(axios.spread((...spread) => {
      result.push(...spread);
      res.json(result);
    }));
  }
  catch(error) {
    fixieRequest(`http://194.14.246.69/api/addr/${BITBOX.Address.toLegacyAddress(req.params.address)}/utxo`, (err, result, body) => {
      let parsed = JSON.parse(body);
      parsed.forEach((data) => {
        delete data.address;
        data.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
        data.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
      });
      res.json(parsed);
    });
  }
});

router.get('/unconfirmed/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    let result = [];
    addresses = addresses.map((address) => {
      return BITBOX.Address.unconfirmed(address)
    })
    axios.all(addresses)
    .then(axios.spread((...spread) => {
      result.push(...spread);
      res.json(result);
    }));
  }
  catch(error) {
    fixieRequest(`http://194.14.246.69/api/addr/${BITBOX.Address.toLegacyAddress(req.params.address)}/utxo`, (err, result, body) => {
      let parsed = JSON.parse(body);
      let unconfirmed = [];
      parsed.forEach((data) => {
        delete parsed.address;
        parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
        parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
        if(parsed.confirmations === 0) {
          unconfirmed.push(data);
        }
      })
      res.json(unconfirmed);
    });
  }
});

module.exports = router;
