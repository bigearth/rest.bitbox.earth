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

const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()

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
  [dataRetrievalRateLimit1: string]: any
  dataRetrievalRateLimit2: any
  dataRetrievalRateLimit3: any
  dataRetrievalRateLimit4: any
  dataRetrievalRateLimit5: any
  dataRetrievalRateLimit6: any
  dataRetrievalRateLimit7: any
  dataRetrievalRateLimit8: any
  dataRetrievalRateLimit9: any
  dataRetrievalRateLimit10: any
  dataRetrievalRateLimit11: any
  dataRetrievalRateLimit12: any
  dataRetrievalRateLimit13: any
  dataRetrievalRateLimit14: any
  dataRetrievalRateLimit15: any
  dataRetrievalRateLimit16: any
  dataRetrievalRateLimit17: any
  dataRetrievalRateLimit18: any
  dataRetrievalRateLimit19: any
  dataRetrievalRateLimit20: any
}

const config: IRLConfig = {
  dataRetrievalRateLimit1: undefined,
  dataRetrievalRateLimit2: undefined,
  dataRetrievalRateLimit3: undefined,
  dataRetrievalRateLimit4: undefined,
  dataRetrievalRateLimit5: undefined,
  dataRetrievalRateLimit6: undefined,
  dataRetrievalRateLimit7: undefined,
  dataRetrievalRateLimit8: undefined,
  dataRetrievalRateLimit9: undefined,
  dataRetrievalRateLimit10: undefined,
  dataRetrievalRateLimit11: undefined,
  dataRetrievalRateLimit12: undefined,
  dataRetrievalRateLimit13: undefined,
  dataRetrievalRateLimit14: undefined,
  dataRetrievalRateLimit15: undefined,
  dataRetrievalRateLimit16: undefined,
  dataRetrievalRateLimit17: undefined,
  dataRetrievalRateLimit18: undefined,
  dataRetrievalRateLimit19: undefined,
  dataRetrievalRateLimit20: undefined
}

let i = 1
while (i < 21) {
  config[`dataRetrievalRateLimit${i}`] = new RateLimit({
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

router.get("/", config.dataRetrievalRateLimit1, root)
router.get("/currentConsensusHash", config.dataRetrievalRateLimit6, getCurrentConsensusHash)
router.get("/info", config.dataRetrievalRateLimit9, info)

function root(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return res.json({ status: "dataRetrieval" })
}


router.get(
  "/balancesForAddress/:address",
  config.dataRetrievalRateLimit2,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getallbalancesforaddress"
    requestConfig.data.method = "whc_getallbalancesforaddress"
    requestConfig.data.params = [req.params.address]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      // Check for no balance error
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.code === -8 &&
        error.response.data.error.message === "Address not found"
      ) {
        res.json([])
      } else {
        res.status(500).send(error.response.data.error)
      }
    }
  }
)

router.get(
  "/balancesForId/:propertyId",
  config.dataRetrievalRateLimit2,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getallbalancesforid"
    requestConfig.data.method = "whc_getallbalancesforid"
    requestConfig.data.params = [parseInt(req.params.propertyId)]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      //res.status(500).send(error.response.data.error)
      res.status(500)
      return res.send(error)
    }
  }
)

router.get(
  "/balance/:address/:propertyId",
  config.dataRetrievalRateLimit3,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getbalance"
    requestConfig.data.method = "whc_getbalance"
    requestConfig.data.params = [
      req.params.address,
      parseInt(req.params.propertyId)
    ]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/balancesHash/:propertyId",
  config.dataRetrievalRateLimit4,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getbalanceshash"
    requestConfig.data.method = "whc_getbalanceshash"
    requestConfig.data.params = [parseInt(req.params.propertyId)]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/crowdSale/:propertyId",
  config.dataRetrievalRateLimit5,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let verbose = false
    if (req.query.verbose && req.query.verbose === "true") verbose = true

    requestConfig.data.id = "whc_getcrowdsale"
    requestConfig.data.method = "whc_getcrowdsale"
    requestConfig.data.params = [parseInt(req.params.propertyId), verbose]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      //res.status(500).send(error.response.data.error);
      res.status(500)
      return res.send(error)
    }
  }
)


async function getCurrentConsensusHash(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const {
      BitboxHTTP,
      username,
      password,
      requestConfig
    } = routeUtils.setEnvVars()

    requestConfig.data.id = "whc_getcurrentconsensushash"
    requestConfig.data.method = "whc_getcurrentconsensushash"
    requestConfig.data.params = []

    const response = await BitboxHTTP(requestConfig)
    return res.json(response.data.result)
  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in control/getInfo: `, error)

    res.status(500)
    return res.json({ error: util.inspect(error) })
  }
}


router.get(
  "/grants/:propertyId",
  config.dataRetrievalRateLimit8,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getgrants"
    requestConfig.data.method = "whc_getgrants"
    requestConfig.data.params = [parseInt(req.params.propertyId)]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      //res.status(500).send(error.response.data.error);
      res.status(500)
      return res.send(error)
    }
  }
)


async function info(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const {
      BitboxHTTP,
      username,
      password,
      requestConfig
    } = routeUtils.setEnvVars()

    requestConfig.data.id = "whc_getinfo"
    requestConfig.data.method = "whc_getinfo"
    requestConfig.data.params = []

    const response = await BitboxHTTP(requestConfig)
    return res.json(response.data.result)
  } catch (error) {
    // Write out error to error log.
    //logger.error(`Error in control/getInfo: `, error)

    res.status(500)
    return res.json({ error: util.inspect(error) })
  }
}


router.get(
  "/payload/:txid",
  config.dataRetrievalRateLimit10,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getpayload"
    requestConfig.data.method = "whc_getpayload"
    requestConfig.data.params = [req.params.txid]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/property/:propertyId",
  config.dataRetrievalRateLimit11,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getproperty"
    requestConfig.data.method = "whc_getproperty"
    requestConfig.data.params = [parseInt(req.params.propertyId)]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/seedBlocks/:startBlock/:endBlock",
  config.dataRetrievalRateLimit12,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getseedblocks"
    requestConfig.data.method = "whc_getseedblocks"
    requestConfig.data.params = [
      parseInt(req.params.startBlock),
      parseInt(req.params.endBlock)
    ]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/STO/:txid/:recipientFilter",
  config.dataRetrievalRateLimit13,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_getsto"
    requestConfig.data.method = "whc_getsto"
    requestConfig.data.params = [req.params.txid, req.params.recipientFilter]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/transaction/:txid",
  config.dataRetrievalRateLimit14,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_gettransaction"
    requestConfig.data.method = "whc_gettransaction"
    requestConfig.data.params = [req.params.txid]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      //res.status(500).send(error.response.data.error);
      res.status(500)
      return res.send(error)
    }
  }
)

router.get(
  "/blockTransactions/:index",
  config.dataRetrievalRateLimit15,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_listblocktransactions"
    requestConfig.data.method = "whc_listblocktransactions"
    requestConfig.data.params = [parseInt(req.params.index)]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/pendingTransactions",
  config.dataRetrievalRateLimit16,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = []
    if (req.query.address) params.push(req.query.address)

    requestConfig.data.id = "whc_listpendingtransactions"
    requestConfig.data.method = "whc_listpendingtransactions"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500)
      return res.send(error)
      //res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/properties",
  config.dataRetrievalRateLimit17,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "whc_listproperties"
    requestConfig.data.method = "whc_listproperties"
    requestConfig.data.params = []

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/frozenBalance/:address/:propertyId",
  config.dataRetrievalRateLimit18,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [
      BITBOX.Address.toCashAddress(req.params.address),
      parseInt(req.params.propertyId)
    ]
    requestConfig.data.id = "whc_getfrozenbalance"
    requestConfig.data.method = "whc_getfrozenbalance"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/frozenBalanceForAddress/:address",
  config.dataRetrievalRateLimit19,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [BITBOX.Address.toCashAddress(req.params.address)]
    requestConfig.data.id = "whc_getfrozenbalanceforaddress"
    requestConfig.data.method = "whc_getfrozenbalanceforaddress"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/frozenBalanceForId/:propertyId",
  config.dataRetrievalRateLimit20,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const params = [parseInt(req.params.propertyId)]
    requestConfig.data.id = "whc_getfrozenbalanceforid"
    requestConfig.data.method = "whc_getfrozenbalanceforid"
    requestConfig.data.params = params

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

module.exports = {
  router,
  testableComponents: {
    root,
    getCurrentConsensusHash,
    info
  }
}
