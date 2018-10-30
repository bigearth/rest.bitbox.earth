"use strict"

const express = require("express")
const router = express.Router()
const axios = require("axios")
const RateLimit = require("express-rate-limit")

const BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
})
const username = process.env.RPC_USERNAME
const password = process.env.RPC_PASSWORD

const config = {
  blockRateLimit1: undefined,
  blockRateLimit2: undefined,
  blockRateLimit3: undefined
}

let i = 1
while (i < 4) {
  config[`blockRateLimit${i}`] = new RateLimit({
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

router.get("/", config.blockRateLimit1, root)

function root(req, res, next) {
  res.json({ status: "block" })
}

router.get(
  "/detailsByHash/:hash",
  config.blockRateLimit2,
  async (req, res, next) => {
    try {
      const response = await axios.get(
        `${process.env.BITCOINCOM_BASEURL}block/${req.params.hash}`
      )
      const parsed = response.data
      res.json(parsed)
    } catch (error) {
      res.status(500)
      return res.send(error)
    }
  }
)

router.get(
  "/detailsByHeight/:height",
  config.blockRateLimit2,
  (req, res, next) => {
    BitboxHTTP({
      method: "post",
      auth: {
        username: username,
        password: password
      },
      data: {
        jsonrpc: "1.0",
        id: "getblockhash",
        method: "getblockhash",
        params: [parseInt(req.params.height)]
      }
    })
      .then(async response => {
        try {
          const response = await axios.get(
            `${process.env.BITCOINCOM_BASEURL}block/${response.data.result}`
          )
          const parsed = response.data
          res.json(parsed)
        } catch (error) {
          res.status(500)
          return res.send(error)
        }
      })
      .catch(error => {
        res.status(500)
        return res.send(error)
      })
  }
)

module.exports = {
  router,
  testableComponents: {
    root
  }
}
