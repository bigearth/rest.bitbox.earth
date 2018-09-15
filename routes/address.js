"use strict";

const express = require("express");
const router = express.Router();
const axios = require("axios");
const RateLimit = require("express-rate-limit");

const util = require("util");
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
};

const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();

const config = {
  addressRateLimit1: undefined,
  addressRateLimit2: undefined,
  addressRateLimit3: undefined,
  addressRateLimit4: undefined,
};

let i = 1;
while (i < 6) {
  config[`addressRateLimit${i}`] = new RateLimit({
    windowMs: 60000, // 1 hour window
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    max: 60, // start blocking after 60 requests
    handler: function(req, res /*next*/) {
      res.format({
        json: function() {
          res.status(500).json({ error: "Too many requests. Limits are 60 requests per minute." });
        },
      });
    },
  });
  i++;
}

router.get("/", config.addressRateLimit1, root);
router.get("/details/:address", config.addressRateLimit2, details2);

// Root API endpoint. Simply acknowledges that it exists.
function root(req, res, next) {
  return res.json({ status: "address" });
}

// Retrieve details on an address.
function details(req, res, next) {
  //console.log(`executing details. req.params: ${JSON.stringify(req.params)}`);
  try {
    // --> This code path never executes. Can you give me a CURL statement that would execute it?
    let addresses = JSON.parse(req.params.address);
    //console.log(`addresses: ${JSON.stringify(addresses,null,2)}`)

    // Enforce: no more than 20 addresses.
    if (addresses.length > 20) {
      res.json({
        error: "Array too large. Max 20 addresses",
      });
    }

    const result = [];
    addresses = addresses.map(address => {
      console.log(`executing addresses.map...`);
      const path = `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(
        address
      )}`;
      //console.log(`URL path: ${path}`);
      const temp = axios.get(path); // Returns a promise.
      console.log(`axios returned: ${util.inspect(temp)}`);
      return temp;
    });
    console.log(`addresses: ${JSON.stringify(addresses)}`);

    axios.all(addresses).then(
      axios.spread((...args) => {
        for (let i = 0; i < args.length; i++) {
          const parsed = args[i].data;
          parsed.legacyAddress = BITBOX.Address.toLegacyAddress(parsed.addrStr);
          parsed.cashAddress = BITBOX.Address.toCashAddress(parsed.addrStr);
          delete parsed.addrStr;
          result.push(parsed);
        }
        res.json(result);
      })
    );

    // Typically executes because JSON.parse() errors out.
  } catch (error) {
    //console.log(`Caught error in details: `, error);
    let path = `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(
      req.params.address
    )}`;
    if (req.query.from && req.query.to) path = `${path}?from=${req.query.from}&to=${req.query.to}`;
    console.log(`path: ${path}`);

    axios
      .get(path)
      .then(response => {
        const parsed = response.data;
        delete parsed.addrStr;
        parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
        parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
        res.json(parsed);
      })
      .catch(error => {
        //console.error(`details caught: `, error);
        console.error(`details errored out.`);
        res.send(error.response.data.error.message);
      });
  }
}

// A new implementation of details.
async function details2(req, res, next) {
  try {
    //console.log(`details2 executing...`);

    // Ensure the input is a valid BCH address.
    try {
      var legacyAddr = BITBOX.Address.toLegacyAddress(req.params.address);
    } catch (err) {
      res.status(400);
      return res.send(
        `Invalid BCH address. Double check your address is valid: ${req.params.address}`
      );
    }

    let path = `${process.env.BITCOINCOM_BASEURL}/addr/${legacyAddr}`;

    if (req.query.from && req.query.to) path = `${path}?from=${req.query.from}&to=${req.query.to}`;
    console.log(`path: ${path}`);

    /*
    axios
      .get(path)
      .then(response => {
        const parsed = response.data;
        delete parsed.addrStr;
        parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
        parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
        res.json(parsed);
      })
      .catch(error => {
        //console.error(`details caught: `, error);
        console.error(`details errored out.`);
        //res.send(error.response.data.error.message);
        return res.send(error);
      });
    */

    // Query the Insight server.
    const response = await axios.get(path);

    const parsed = response.data;
    parsed.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
    parsed.cashAddress = BITBOX.Address.toCashAddress(req.params.address);

    return res.json(parsed);
  } catch (err) {
    console.log(`Error in address.js/details2():`, err);
    res.status(500);
    return res.json(err);
  }
}

router.get("/utxo/:address", config.addressRateLimit3, (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    if (addresses.length > 20) {
      res.json({
        error: "Array too large. Max 20 addresses",
      });
    }

    addresses = addresses.map(address => BITBOX.Address.toLegacyAddress(address));
    const final = [];
    addresses.forEach(address => {
      final.push([]);
    });

    axios
      .get(`${process.env.BITCOINCOM_BASEURL}addrs/${addresses}/utxo`)
      .then(response => {
        const parsed = response.data;
        parsed.forEach(data => {
          data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
          data.cashAddress = BITBOX.Address.toCashAddress(data.address);
          delete data.address;
          addresses.forEach((address, index) => {
            if (addresses[index] === data.legacyAddress) final[index].push(data);
          });
        });
        res.json(final);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  } catch (error) {
    axios
      .get(
        `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(
          req.params.address
        )}/utxo`
      )
      .then(response => {
        const parsed = response.data;
        parsed.forEach(data => {
          delete data.address;
          data.legacyAddress = BITBOX.Address.toLegacyAddress(req.params.address);
          data.cashAddress = BITBOX.Address.toCashAddress(req.params.address);
        });
        res.json(parsed);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  }
});

router.get("/unconfirmed/:address", config.addressRateLimit4, (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    if (addresses.length > 20) {
      res.json({
        error: "Array too large. Max 20 addresses",
      });
    }
    addresses = addresses.map(address => BITBOX.Address.toLegacyAddress(address));
    const final = [];
    addresses.forEach(address => {
      final.push([]);
    });
    axios
      .get(`${process.env.BITCOINCOM_BASEURL}addrs/${addresses}/utxo`)
      .then(response => {
        const parsed = response.data;
        parsed.forEach(data => {
          data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
          data.cashAddress = BITBOX.Address.toCashAddress(data.address);
          delete data.address;
          if (data.confirmations === 0) {
            addresses.forEach((address, index) => {
              if (addresses[index] === data.legacyAddress) final[index].push(data);
            });
          }
        });
        res.json(final);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  } catch (error) {
    axios
      .get(
        `${process.env.BITCOINCOM_BASEURL}addr/${BITBOX.Address.toLegacyAddress(
          req.params.address
        )}/utxo`
      )
      .then(response => {
        const parsed = response.data;
        const unconfirmed = [];
        parsed.forEach(data => {
          data.legacyAddress = BITBOX.Address.toLegacyAddress(data.address);
          data.cashAddress = BITBOX.Address.toCashAddress(data.address);
          delete data.address;
          if (data.confirmations === 0) unconfirmed.push(data);
        });
        res.json(unconfirmed);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  }
});

router.get("/transactions/:address", config.addressRateLimit5, (req, res, next) => {
  try {
    let addresses = JSON.parse(req.params.address);
    if (addresses.length > 20) {
      res.json({
        error: "Array too large. Max 20 addresses",
      });
    }
    addresses = addresses.map(address => BITBOX.Address.toLegacyAddress(address));
    const final = [];
    addresses.forEach(address => {
      final.push([]);
    });
    axios
      .get(`${process.env.BITCOINCOM_BASEURL}txs/?address=${addresses}`)
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  } catch (error) {
    axios
      .get(
        `${process.env.BITCOINCOM_BASEURL}txs/?address=${BITBOX.Address.toLegacyAddress(
          req.params.address
        )}`
      )
      .then(response => {
        //console.log(response.data);
        res.json(response.data);
      })
      .catch(error => {
        res.send(error.response.data.error.message);
      });
  }
});

module.exports = {
  router,
  testableComponents: {
    root,
    details,
    details2,
  },
};
