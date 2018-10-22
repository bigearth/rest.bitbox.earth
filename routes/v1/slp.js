"use strict"

const express = require("express")
const router = express.Router()
const axios = require("axios")
const RateLimit = require("express-rate-limit")
const bitdbToken = process.env.BITDB_TOKEN

const config = {
  slpRateLimit1: undefined,
  slpRateLimit2: undefined
}

let i = 1
while (i < 3) {
  config[`slpRateLimit${i}`] = new RateLimit({
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

router.get("/", config.slpRateLimit1, async (req, res, next) => {
  res.json({ status: "slp" })
})

router.get("/list", config.slpRateLimit2, async (req, res, next) => {
  try {
    const query = {
      v: 3,
      q: {
        db: ["c"],
        find: { "out.h1": "534c5000", "out.s3": "GENESIS" },
        limit: 1000
      },
      r: {
        f:
          '[ .[] | { timestamp: (.blk.t | strftime("%Y-%m-%d %H:%M")), symbol: .out[0].s4, name: .out[0].s5, document: .out[0].s6, URI: "https://tokengraph.network/token/\\(.tx.h)" } ]'
      }
    }

    const s = JSON.stringify(query)
    const b64 = Buffer.from(s).toString("base64")
    const url = `https://bitdb.network/q/${b64}`
    const header = {
      headers: { key: bitdbToken }
    }

    const tokenRes = await axios.get(url, header)
    const tokens = tokenRes.data.c
    if (tokenRes.data.u && tokenRes.data.u.length) tokens.concat(tokenRes.u)
    res.json(tokens)

    return tokens
  } catch (err) {
    res.status(500).send(error.response.data.error)
  }
})

module.exports = router
