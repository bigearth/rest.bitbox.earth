"use strict"

const express = require("express")
const router = express.Router()
const RateLimit = require("express-rate-limit")

const indexRateLimit1 = new RateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
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

/* GET home page. */
router.get("/v2", indexRateLimit1, (req, res, next) => {
  res.render("swagger-v2")
})

module.exports = router
