/*
  This library provides common utility functions used by the routes.
*/

"use strict"

const axios = require("axios")

module.exports = {
  setEnvVars // Allows RPC variables to be set dynamically based on changing env vars.
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
