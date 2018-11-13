"use strict"

import * as express from "express"
const router = express.Router()
import axios from "axios"
import { IRequestConfig } from "./interfaces/IRequestConfig"
const RateLimit = require("express-rate-limit")
const logger = require("./logging.js")
const routeUtils = require("./route-utils")

// Used for processing error messages before sending them to the user.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

// Typescript
interface IRLConfig {
  [controlRateLimit1: string]: any
  controlRateLimit2: any
}

// Typescript
const config: IRLConfig = {
  controlRateLimit1: undefined,
  controlRateLimit2: undefined
}

// JavaScript
//const config = {
//  controlRateLimit1: undefined,
//  controlRateLimit2: undefined
//}

let i = 1
while (i < 3) {
  config[`controlRateLimit${i}`] = new RateLimit({
    windowMs: 60000, // 1 hour window
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    max: 60, // start blocking after 60 requests
    handler: (req: express.Request, res: express.Response /*next*/) => {
      res.format({
        json: () => {
          res.status(500).json({
            error: "Too many requests. Limits are 60 requests per minute."
          })
        }
      })
    }
  })
  i++
}

router.get("/", config.controlRateLimit1, root)
router.get("/getInfo", config.controlRateLimit2, getInfo)

function root(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return res.json({ status: "control" })
}

// Execute the RPC getinfo call.
async function getInfo(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const {BitboxHTTP, username, password, requestConfig} = routeUtils.setEnvVars()

  requestConfig.data.id = "getinfo"
  requestConfig.data.method = "getinfo"
  requestConfig.data.params = []

  try {
    const response = await BitboxHTTP(requestConfig)

    return res.json(response.data.result)
  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in control/getInfo: `, error)

    res.status(500)
    if (error.response && error.response.data && error.response.data.error)
      return res.json({ error: error.response.data.error })
    return res.json({ error: util.inspect(error) })
  }
}

// router.get('/getMemoryInfo', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"getmemoryinfo",
//       method: "getmemoryinfo"
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.get('/help', (req, res, next) => {
//   BITBOX.Control.help()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/stop', (req, res, next) => {
//   BITBOX.Control.stop()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });

module.exports = {
  router,
  testableComponents: {
    root,
    getInfo
  }
}
