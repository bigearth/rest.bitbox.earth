let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli({
  restURL: "http://localhost:3000/v1/"
});

router.get('/', (req, res, next) => {
  res.json({ status: 'address' });
});

router.get('/details/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    let result = [];
    addresses = addresses.map((address) => {
      let path = `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(address)}`;
      return axios.get(path)
    })
    axios.all(addresses)
    .then(axios.spread((...args) => {
      for (let i = 0; i < args.length; i++) {
        let parsed = args[i].data;
        parsed.legacyAddress = BITBOX.Address.toLegacyAddress(parsed.addrStr);
        parsed.cashAddress = BITBOX.Address.toCashAddress(parsed.addrStr);
        delete parsed.addrStr;
        result.push(parsed);
      }
      res.json(result);
    }));
  }
  catch(error) {
    let path = `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(req.params.address)}`;
    if(req.query.from && req.query.to) {
      path = `${path}?from=${req.query.from}&to=${req.query.to}`;
    }

    axios.get(path)
    .then((response) => {
      let parsed = response.data;
      delete parsed.addrStr;
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
      parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
      res.json(parsed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});

router.get('/utxo/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    addresses = addresses.map((address) => {
      return BITBOX.Address.toLegacyAddress(address)
    })
    let final = [];
    addresses.forEach((address) => {
      final.push([])
    });

    axios.get(`${process.env.BITCOINCOM_BASEURL}addrs/${addresses}/utxo`)
    .then((response) => {
      let parsed = response.data;
      parsed.forEach((data) => {
        data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
        data.cashAddress = BITBOX.Address.toCashAddress(data.address);
        delete data.address;
        addresses.forEach((address, index) => {
          if(addresses[index] === data.legacyAddress) {
            final[index].push(data);
          }
        });
      });
      res.json(final);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
  catch(error) {
    axios.get(`${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(req.params.address)}/utxo`)
    .then((response) => {
      let parsed = response.data;
      parsed.forEach((data) => {
        delete data.address;
        data.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
        data.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
      });
      res.json(parsed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});

router.get('/unconfirmed/:address', (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    addresses = addresses.map((address) => {
      return BITBOX.Address.toLegacyAddress(address)
    });
    let final = [];
    addresses.forEach((address) => {
      final.push([])
    });
    axios.get(`${process.env.BITCOINCOM_BASEURL}addrs/${addresses}/utxo`)
    .then((response) => {
      let parsed = response.data;
      parsed.forEach((data) => {
        data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
        data.cashAddress = BITBOX.Address.toCashAddress(data.address);
        delete data.address;
        if(data.confirmations === 0) {
          addresses.forEach((address, index) => {
            if(addresses[index] === data.legacyAddress) {
              final[index].push(data);
            }
          });
        }
      });
      res.json(final);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
  catch(error) {
    axios.get(`${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(req.params.address)}/utxo`)
    .then((response) => {
      let parsed = response.data;
      let unconfirmed = [];
      parsed.forEach((data) => {
        data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
        data.cashAddress = BITBOX.Address.toCashAddress(data.address);
        delete data.address;
        if(data.confirmations === 0) {
          unconfirmed.push(data);
        }
      })
      res.json(unconfirmed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  }
});

module.exports = router;
