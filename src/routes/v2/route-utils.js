/*
  A private library of utility functions used by several different routes.
*/

"use strict"

const axios = require("axios")

const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()

module.exports = {
  validateNetwork, // Prevents a common user error
  setEnvVars // Allows RPC variables to be set dynamically based on changing env vars.
}

// Returns true if user-provided cash address matches the correct network,
// mainnet or testnet. If NETWORK env var is not defined, it returns false.
// This prevent a common user-error issue that is easy to make: passing a
// testnet address into rest.bitcoin.com or passing a mainnet address into
// trest.bitcoin.com.
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
    const addrIsTest = BITBOX.Address.isTestnetAddress(cashAddr)
    if (network === "testnet" && addrIsTest) return true

    // Return true if the network and address both match mainnet
    const addrIsMain = BITBOX.Address.isMainnetAddress(cashAddr)
    if (network === "mainnet" && addrIsMain) return true

    return false
  } catch (err) {
    logger.error(`Error in validateNetwork()`)
    return false
  }
}

// Dynamically set these based on env vars. Allows unit testing.
function setEnvVars() {
  const BitboxHTTP = axios.create({
    baseURL: process.env.RPC_BASEURL
  })
  const username = process.env.RPC_USERNAME
  const password = process.env.RPC_PASSWORD

  const requestConfig = {
    method: "post",
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0"
    }
  }

  return { BitboxHTTP, username, password, requestConfig }
}
