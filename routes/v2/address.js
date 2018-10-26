"use strict"

const express = require("express")
const router = express.Router()
const axios = require("axios")
const RateLimit = require("express-rate-limit")

//const WormholeHTTP = axios.create({
//  baseURL: process.env.WORMHOLE_RPC_BASEURL,
//});
//const wh_username = process.env.WORMHOLE_RPC_USERNAME;
//const wh_password = process.env.WORMHOLE_RPC_PASSWORD;

const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()

const config = {
  addressRateLimit1: undefined,
  addressRateLimit2: undefined,
  addressRateLimit3: undefined,
  addressRateLimit4: undefined
}

let i = 1
while (i < 6) {
  config[`addressRateLimit${i}`] = new RateLimit({
    windowMs: 60000, // 1 hour window
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    max: 60, // start blocking after 60 requests
    handler: function(req, res /*next*/) {
      res.format({
        json: function() {
          res.status(500).json({
            error: "Too many requests. Limits are 60 requests per minute."
          })
        }
      })
    }
  })
  i++
}

// Connect the route endpoints to their handler functions.
router.get("/", config.addressRateLimit1, root)
router.post("/details", config.addressRateLimit2, details)
router.get("/utxo/:address", config.addressRateLimit3, utxo)
router.get("/unconfirmed/:address", config.addressRateLimit4, unconfirmed)
router.get("/transactions/:address", config.addressRateLimit5, transactions)

// Root API endpoint. Simply acknowledges that it exists.
function root(req, res, next) {
  console.log(`Entering root()`)
  return res.json({ status: "address" })
}

// Retrieve details on an address.
// curl -d '{"addresses": [bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr, bchtest:qp6hgvevf4gzz6l7pgcte3gaaud9km0l459fa23dul]}' -H "Content-Type: application/json" http://localhost:3000/v2/address/details
async function details(req, res, next) {
  try {
    let addresses = req.body.addresses

    // Reject if address is not an array.
    if (!Array.isArray(addresses)) {
      res.status(403)
      res.json({ error: "addresses needs to be an array" })
    }

    // Parse the array.
    try {
      addresses = JSON.parse(addresses)
      // console.log(`addreses: ${JSON.stringify(addresses, null, 2)}`); // Used for debugging.
    } catch (err) {
      // Dev Note: This block triggered by non-array input, such as a curl
      // statement. It should silently exit this catch statement.
    }

    // Enforce: no more than 20 addresses.
    if (addresses.length > 20) {
      res.status(400)
      return res.json({
        error: "Array too large. Max 20 addresses"
      })
    }

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.send(
          `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        )
      }

      let path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}`
      //console.log(`path: ${path}`)

      // Not sure what this is doing?
      if (req.query.from && req.query.to)
        path = `${path}?from=${req.query.from}&to=${req.query.to}`
      //console.log(`path: ${path}`); // Used for debugging.

      // Query the Insight server.
      const response = await axios.get(path)

      // Parse the returned data.
      const parsed = response.data
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      parsed.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(parsed)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    // Write out error to console or debug log.
    //console.log(`Error in address.js/details(): `, err);

    // Return an error message to the caller.
    res.status(500)
    return res.json(`Error in address.js/details(): ${err.message}`)
  }
}

// Retrieve UTXO information for an address.
async function utxo(req, res, next) {
  try {
    let addresses = req.params.address

    // Force the input to be an array if it isn't.
    if (!Array.isArray(addresses)) addresses = [addresses]

    // Parse the array.
    try {
      addresses = JSON.parse(addresses)
      // console.log(`addreses: ${JSON.stringify(addresses, null, 2)}`); // Used for debugging.
    } catch (err) {
      // Dev Note: This block triggered by non-array input, such as a curl
      // statement. It should silently exit this catch statement.
    }

    // Enforce: no more than 20 addresses.
    if (addresses.length > 20) {
      res.status(400)
      return res.json({
        error: "Array too large. Max 20 addresses"
      })
    }

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.send(
          `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        )
      }

      const path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}/utxo`

      // Query the Insight server.
      const response = await axios.get(path)

      // Parse the returned data.
      const parsed = response.data
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      parsed.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(parsed)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    //console.log(`Error in address.js/utxo()`)

    // Return an error message to the caller.
    res.status(500)
    return res.json(`Error in address.js/utxo(): ${err.message}`)
  }
}

// Retrieve any unconfirmed TX information for a given address.
async function unconfirmed(req, res, next) {
  try {
    let addresses = req.params.address

    // Force the input to be an array if it isn't.
    if (!Array.isArray(addresses)) addresses = [addresses]

    // Parse the array.
    try {
      addresses = JSON.parse(addresses)
      // console.log(`addreses: ${JSON.stringify(addresses, null, 2)}`); // Used for debugging.
    } catch (err) {
      // Dev Note: This block triggered by non-array input, such as a curl
      // statement. It should silently exit this catch statement.
    }

    // Enforce: no more than 20 addresses.
    if (addresses.length > 20) {
      res.status(400)
      return res.json({
        error: "Array too large. Max 20 addresses"
      })
    }

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.send(
          `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        )
      }

      const path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}/utxo`

      // Query the Insight server.
      const response = await axios.get(path)

      // Parse the returned data.
      const parsed = response.data
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      parsed.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      // Loop through each returned UTXO.
      for (let j = 0; j < parsed.length; j++) {
        const thisUtxo = parsed[j]

        // Only interested in UTXOs with no confirmations.
        if (thisUtxo.confirmations === 0) retArray.push(thisUtxo)
      }
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    //console.log(`Error in address.js/unconfirmed().`)

    // Return an error message to the caller.
    res.status(500)
    return res.json(`Error in address.js/utxo(): ${err.message}`)
  }
}

// Get an array of TX information for a given address.
async function transactions(req, res, next) {
  try {
    let addresses = req.params.address

    // Force the input to be an array if it isn't.
    if (!Array.isArray(addresses)) addresses = [addresses]

    // Parse the array.
    try {
      addresses = JSON.parse(addresses)
      // console.log(`addreses: ${JSON.stringify(addresses, null, 2)}`); // Used for debugging.
    } catch (err) {
      // Dev Note: This block triggered by non-array input, such as a curl
      // statement. It should silently exit this catch statement.
    }

    // Enforce: no more than 20 addresses.
    if (addresses.length > 20) {
      res.status(400)
      return res.json({
        error: "Array too large. Max 20 addresses"
      })
    }

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.send(
          `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        )
      }

      const path = `${
        process.env.BITCOINCOM_BASEURL
      }txs/?address=${thisAddress}`

      // Query the Insight server.
      const response = await axios.get(path)

      // Parse the returned data.
      const parsed = response.data
      parsed.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      parsed.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(parsed)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    //console.log(`Error in address.js/transactions().`)

    // Return an error message to the caller.
    res.status(500)
    return res.json(`Error in address.js/transactions(): ${err.message}`)
  }
}

module.exports = {
  router,
  testableComponents: {
    root,
    details,
    utxo,
    unconfirmed,
    transactions
  }
}
