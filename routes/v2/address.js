"use strict"

const express = require("express")
const router = express.Router()
const axios = require("axios")
const RateLimit = require("express-rate-limit")
const logger = require("./logging.js")

// Used for processing error messages before sending them to the user.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

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
router.post("/utxo/:address", config.addressRateLimit3, utxo)
router.post("/unconfirmed/:address", config.addressRateLimit4, unconfirmed)
router.post("/transactions/:address", config.addressRateLimit5, transactions)

// Root API endpoint. Simply acknowledges that it exists.
function root(req, res, next) {
  return res.json({ status: "address" })
}

// Retrieve details on an address.
// curl -d '{"addresses": ["bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr", "bchtest:qp6hgvevf4gzz6l7pgcte3gaaud9km0l459fa23dul"]}' -H "Content-Type: application/json" http://localhost:3000/v2/address/details
// curl -d '{"addresses": ["bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr", "bchtest:qp6hgvevf4gzz6l7pgcte3gaaud9km0l459fa23dul"], "from": 1, "to": 5}' -H "Content-Type: application/json" http://localhost:3000/v2/address/details
async function details(req, res, next) {
  try {
    const addresses = req.body.addresses

    // Reject if address is not an array.
    if (!Array.isArray(addresses)) {
      res.status(400)
      return res.json({ error: "addresses needs to be an array" })
    }

    logger.debug(`Executing address/details with these addresses: `, addresses)

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.json({
          error: `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        })
      }

      const networkIsValid = validateNetwork(thisAddress)
      if (!networkIsValid) {
        res.status(400)
        return res.json({
          error: `Invalid network. Trying to use a testnet address on mainnet, or vice versa.`
        })
      }

      let path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}`

      // Optional query strings limit the number of TXIDs.
      // https://github.com/bitpay/insight-api/blob/master/README.md#notes-on-upgrading-from-v02
      if (req.body.from && req.body.to)
        path = `${path}?from=${req.body.from}&to=${req.body.to}`

      // Query the Insight server.
      const response = await axios.get(path)

      // Append different address formats to the return data.
      const retData = response.data
      retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(retData)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in address/details: `, error)

    // Return error message to the caller.
    res.status(500)
    if (error.response && error.response.data && error.response.data.error)
      return res.json({ error: error.response.data.error })
    return res.json({ error: util.inspect(error) })
  }
}

// Retrieve UTXO information for an address.
async function utxo(req, res, next) {
  try {
    const addresses = req.body.addresses

    // Reject if address is not an array.
    if (!Array.isArray(addresses)) {
      res.status(400)
      return res.json({ error: "addresses needs to be an array" })
    }

    logger.debug(`Executing address/utxo with these addresses: `, addresses)

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.json({
          error: `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        })
      }

      const path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}/utxo`

      // Query the Insight server.
      const response = await axios.get(path)

      // Append different address formats to the return data.
      const retData = response.data
      retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(retData)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    // Write out error to error log.
    //logger.error(`Error in address/details: `, error)

    // Return error message to the caller.
    res.status(500)
    if (error.response && error.response.data && error.response.data.error)
      return res.json({ error: error.response.data.error })
    return res.json({ error: util.inspect(error) })
  }
}

// Retrieve any unconfirmed TX information for a given address.
async function unconfirmed(req, res, next) {
  try {
    const addresses = req.body.addresses

    // Reject if address is not an array.
    if (!Array.isArray(addresses)) {
      res.status(400)
      return res.json({ error: "addresses needs to be an array" })
    }

    logger.debug(`Executing address/utxo with these addresses: `, addresses)

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        var legacyAddr = BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.json({
          error: `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        })
      }

      const path = `${process.env.BITCOINCOM_BASEURL}addr/${legacyAddr}/utxo`

      // Query the Insight server.
      const response = await axios.get(path)

      // Append different address formats to the return data.
      const retData = response.data
      retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      // Loop through each returned UTXO.
      for (let j = 0; j < retData.length; j++) {
        const thisUtxo = retData[j]

        // Only interested in UTXOs with no confirmations.
        if (thisUtxo.confirmations === 0) retArray.push(thisUtxo)
      }
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    // Write out error to error log.
    //logger.error(`Error in address/details: `, error)

    // Return error message to the caller.
    res.status(500)
    if (error.response && error.response.data && error.response.data.error)
      return res.json({ error: error.response.data.error })
    return res.json({ error: util.inspect(error) })
  }
}

// Get an array of TX information for a given address.
async function transactions(req, res, next) {
  try {
    const addresses = req.body.addresses

    // Reject if address is not an array.
    if (!Array.isArray(addresses)) {
      res.status(400)
      return res.json({ error: "addresses needs to be an array" })
    }

    logger.debug(`Executing address/utxo with these addresses: `, addresses)

    // Loop through each address.
    const retArray = []
    for (let i = 0; i < addresses.length; i++) {
      const thisAddress = addresses[i] // Current address.

      // Ensure the input is a valid BCH address.
      try {
        BITBOX.Address.toLegacyAddress(thisAddress)
      } catch (err) {
        res.status(400)
        return res.json({
          error: `Invalid BCH address. Double check your address is valid: ${thisAddress}`
        })
      }

      const path = `${
        process.env.BITCOINCOM_BASEURL
      }txs/?address=${thisAddress}`

      // Query the Insight server.
      const response = await axios.get(path)

      // Append different address formats to the return data.
      const retData = response.data
      retData.legacyAddress = BITBOX.Address.toLegacyAddress(thisAddress)
      retData.cashAddress = BITBOX.Address.toCashAddress(thisAddress)

      retArray.push(retData)
    }

    // Return the array of retrieved address information.
    res.status(200)
    return res.json(retArray)
  } catch (err) {
    // Write out error to error log.
    //logger.error(`Error in address/details: `, error)

    // Return error message to the caller.
    res.status(500)
    if (error.response && error.response.data && error.response.data.error)
      return res.json({ error: error.response.data.error })
    return res.json({ error: util.inspect(error) })
  }
}

// Returns true if user-provided cash address matches the correct network,
// mainnet or testnet. If NETWORK env var is not defined, it returns false.
function validateNetwork(addr) {
  try {
    const network = process.env.NETWORK

    // Return false if NETWORK is not defined.
    if (!network || network === "") {
      console.log(`Warning: NETWORK environment variable is not defined!`)
      return false
    }

    // Convert the user-provided address to a cashaddress, for easy detection
    // of the intended network.
    const cashAddr = BITBOX.Address.toCashAddress(addr)

    // Return true if the network and address both match testnet
    const addrIsTest = cashAddr.indexOf(`bchtest`) > -1
    if (network === "testnet" && addrIsTest) return true

    // Return true if the network and address both match mainnet
    const addrIsMain = cashAddr.indexOf(`bitcoincash`) > -1
    if (network === "mainnet" && addrIsMain) return true

    return false
  } catch (err) {
    logger.error(`Error in validateNetwork()`)
    return false
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
