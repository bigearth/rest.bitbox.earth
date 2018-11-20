"use strict"

import * as express from "express"
const router = express.Router()
import axios from "axios"
import { IRequestConfig } from "./interfaces/IRequestConfig"
const RateLimit = require("express-rate-limit")
const routeUtils = require("./route-utils")
const logger = require("./logging.js")

// Used to convert error messages to strings, to safely pass to users.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

const BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
})
const username = process.env.RPC_USERNAME
const password = process.env.RPC_PASSWORD

const requestConfig: IRequestConfig = {
  method: "post",
  auth: {
    username: username,
    password: password
  },
  data: {
    jsonrpc: "1.0"
  }
}

interface IRLConfig {
  [rawTransactionsRateLimit1: string]: any
  rawTransactionsRateLimit2: any
  rawTransactionsRateLimit3: any
  rawTransactionsRateLimit4: any
  rawTransactionsRateLimit5: any
  rawTransactionsRateLimit6: any
  rawTransactionsRateLimit7: any
  rawTransactionsRateLimit8: any
  rawTransactionsRateLimit9: any
  rawTransactionsRateLimit10: any
  rawTransactionsRateLimit11: any
}

const config: IRLConfig = {
  rawTransactionsRateLimit1: undefined,
  rawTransactionsRateLimit2: undefined,
  rawTransactionsRateLimit3: undefined,
  rawTransactionsRateLimit4: undefined,
  rawTransactionsRateLimit5: undefined,
  rawTransactionsRateLimit6: undefined,
  rawTransactionsRateLimit7: undefined,
  rawTransactionsRateLimit8: undefined,
  rawTransactionsRateLimit9: undefined,
  rawTransactionsRateLimit10: undefined,
  rawTransactionsRateLimit11: undefined
}

let i = 1

while (i < 12) {
  config[`rawTransactionsRateLimit${i}`] = new RateLimit({
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

router.get("/", config.rawTransactionsRateLimit1, root)
router.get(
  "/decodeRawTransaction/:hex",
  config.rawTransactionsRateLimit2,
  decodeRawTransaction
)
router.get(
  "/decodeScript/:hex",
  config.rawTransactionsRateLimit3,
  decodeScript
)
router.post(
  "/getRawTransaction/:txid",
  config.rawTransactionsRateLimit4, getRawTransaction)

function root(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return res.json({ status: "rawtransactions" })
}

// Decode transaction hex into a JSON object.
async function decodeRawTransaction(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const hex = req.params.hex

    // Throw an error if hex is empty.
    if (!hex || hex === "") {
      res.status(400)
      return res.json({ error: "hex can not be empty" })
    }

    const {
      BitboxHTTP,
      username,
      password,
      requestConfig
    } = routeUtils.setEnvVars()

    requestConfig.data.id = "decoderawtransaction"
    requestConfig.data.method = "decoderawtransaction"
    requestConfig.data.params = [hex]

    const response = await BitboxHTTP(requestConfig)
    return res.json(response.data.result)
  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in rawtransactions/decodeRawTransaction: `, err)

    res.status(500)
    return res.json({ error: util.inspect(error) })
  }
}

// Decode a raw transaction from hex to assembly.
async function decodeScript(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const hex = req.params.hex

    // Throw an error if hex is empty.
    if (!hex || hex === "") {
      res.status(400)
      return res.json({ error: "hex can not be empty" })
    }

    const {
      BitboxHTTP,
      username,
      password,
      requestConfig
    } = routeUtils.setEnvVars()

    requestConfig.data.id = "decodescript"
    requestConfig.data.method = "decodescript"
    requestConfig.data.params = [hex]

    const response = await BitboxHTTP(requestConfig)
    return res.json(response.data.result)

  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in rawtransactions/decodeScript: `, err)

    res.status(500)
    return res.json({ error: util.inspect(error) })
  }
}

// Get a JSON object breakdown of transaction details.
async function getRawTransaction(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let verbose = 0
    if (req.body.verbose && req.body.verbose === "true") verbose = 1

    const txids = req.body.txids
    if (!Array.isArray(txids)) {
      res.status(400)
      return res.json({error: "txids must be an array"})
    }
    if (txids.length > 20) {
      res.status(400)
      return res.json({error: "Array too large. Max 20 txids"})
    }

    const {
      BitboxHTTP,
      username,
      password,
      requestConfig
    } = routeUtils.setEnvVars()

    requestConfig.data.id = "getrawtransaction"
    requestConfig.data.method = "getrawtransaction"

    const results = []

    // Loop through each txid in the array
    for(let i=0; i < txids.length; i++) {
      const txid = txids[i]

      if (!txid || txid === "") {
        res.status(400)
        return res.json({ error: "Encountered empty TXID" })
      }

      requestConfig.data.params = [txid, verbose]

      const response = await BitboxHTTP(requestConfig)
      results.push(response.data.result)
    }

    return res.json(results)

  } catch(err) {
    // Write out error to error log.
    //logger.error(`Error in rawtransactions/getRawTransaction: `, err)

    res.status(500)
    return res.json({ error: util.inspect(err) })
  }


  /*
  try {
    let txids = JSON.parse(req.params.txid)
    if (txids.length > 20) {
      res.json({
        error: "Array too large. Max 20 txids"
      })
    }
    const result = [] as any
    txids = txids.map((txid: any) => {
      requestConfig.data.id = "getrawtransaction"
      requestConfig.data.method = "getrawtransaction"
      requestConfig.data.params = [txid, verbose]
      BitboxHTTP(requestConfig).catch(error => {
        try {
          return {
            data: {
              result: error.response.data.error.message
            }
          }
        } catch (ex) {
          return {
            data: {
              result: "unknown error"
            }
          }
        }
      })
    })
    axios.all(txids).then(
      axios.spread((...args) => {
        for (let i = 0; i < args.length; i++) {
          let tmp = {} as any
          const parsed = tmp.data.result
          result.push(parsed)
        }
        res.json(result)
      })
    )
  } catch (error) {
    requestConfig.data.id = "getrawtransaction"
    requestConfig.data.method = "getrawtransaction"
    requestConfig.data.params = [req.params.txid, verbose]
    BitboxHTTP(requestConfig)
      .then(response => {
        res.json(response.data.result)
      })
      .catch(error => {
        res.send(error.response.data.error.message)
      })
  }
  */
}


router.post(
  "/sendRawTransaction/:hex",
  config.rawTransactionsRateLimit5,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {https://twitter.com/vinarmani/status/1064504066259210240
      let transactions = JSON.parse(req.params.hex)
      if (transactions.length > 20) {
        res.json({
          error: "Array too large. Max 20 transactions"
        })
      }

      const result = [] as any
      transactions = transactions.map((transaction: any) => {
        requestConfig.data.id = "sendrawtransaction"
        requestConfig.data.method = "sendrawtransaction"
        requestConfig.data.params = [transaction]
        BitboxHTTP(requestConfig).catch(error => {
          try {
            return {
              data: {
                result: error.response.data.error.message
              }
            }
          } catch (ex) {
            return {
              data: {
                result: "unknown error"
              }
            }
          }
        })
      })
      axios.all(transactions).then(
        axios.spread((...args) => {
          for (let i = 0; i < args.length; i++) {
            let tmp = {} as any
            const parsed = tmp.data.result
            result.push(parsed)
          }
          res.json(result)
        })
      )
    } catch (error) {
      requestConfig.data.id = "sendrawtransaction"
      requestConfig.data.method = "sendrawtransaction"
      requestConfig.data.params = [req.params.hex]
      BitboxHTTP(requestConfig)
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)

router.post(
  "/change/:rawtx/:prevTxs/:destination/:fee",
  config.rawTransactionsRateLimit6,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const params = [
        req.params.rawtx,
        JSON.parse(req.params.prevTxs),
        req.params.destination,
        parseFloat(req.params.fee)
      ]
      if (req.query.position) params.push(parseInt(req.query.position))

      requestConfig.data.id = "whc_createrawtx_change"
      requestConfig.data.method = "whc_createrawtx_change"
      requestConfig.data.params = params

      try {
        const response = await BitboxHTTP(requestConfig)
        res.json(response.data.result)
      } catch (error) {
        res.status(500).send(error.response.data.error)
      }
    } catch (err) {
      res.status(500)
      res.send(`Error in /change: ${err.message}`)
    }
  }
)

router.post(
  "/input/:rawTx/:txid/:n",
  config.rawTransactionsRateLimit7,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_createrawtx_input"
    requestConfig.data.method = "whc_createrawtx_input"
    requestConfig.data.params = [
      req.params.rawTx,
      req.params.txid,
      parseInt(req.params.n)
    ]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.post(
  "/opReturn/:rawTx/:payload",
  config.rawTransactionsRateLimit8,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_createrawtx_opreturn"
    requestConfig.data.method = "whc_createrawtx_opreturn"
    requestConfig.data.params = [req.params.rawTx, req.params.payload]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.post(
  "/reference/:rawTx/:destination",
  config.rawTransactionsRateLimit9,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [req.params.rawTx, req.params.destination]
    if (req.query.amount) params.push(req.query.amount)

    requestConfig.data.id = "whc_createrawtx_reference"
    requestConfig.data.method = "whc_createrawtx_reference"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.post(
  "/decodeTransaction/:rawTx",
  config.rawTransactionsRateLimit10,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [req.params.rawTx]
    if (req.query.prevTxs) params.push(JSON.parse(req.query.prevTxs))

    if (req.query.height) params.push(req.query.height)

    requestConfig.data.id = "whc_decodetransaction"
    requestConfig.data.method = "whc_decodetransaction"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error.message)
    }
  }
)

router.post(
  "/create/:inputs/:outputs",
  config.rawTransactionsRateLimit11,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [
      JSON.parse(req.params.inputs),
      JSON.parse(req.params.outputs)
    ]
    if (req.query.locktime) params.push(req.query.locktime)

    requestConfig.data.id = "createrawtransaction"
    requestConfig.data.method = "createrawtransaction"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error.message)
    }
  }
)

module.exports = {
  router,
  testableComponents: {
    root,
    decodeRawTransaction,
    decodeScript,
    getRawTransaction
  }
}
