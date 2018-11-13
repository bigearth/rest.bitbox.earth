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

interface IRLConfig {
  [blockchainRateLimit1: string]: any
  blockchainRateLimit2: any
  blockchainRateLimit3: any
  blockchainRateLimit4: any
  blockchainRateLimit5: any
  blockchainRateLimit6: any
  blockchainRateLimit7: any
  blockchainRateLimit8: any
  blockchainRateLimit9: any
  blockchainRateLimit10: any
  blockchainRateLimit11: any
  blockchainRateLimit12: any
  blockchainRateLimit13: any
  blockchainRateLimit14: any
  blockchainRateLimit15: any
  blockchainRateLimit16: any
  blockchainRateLimit17: any
}

const config: IRLConfig = {
  blockchainRateLimit1: undefined,
  blockchainRateLimit2: undefined,
  blockchainRateLimit3: undefined,
  blockchainRateLimit4: undefined,
  blockchainRateLimit5: undefined,
  blockchainRateLimit6: undefined,
  blockchainRateLimit7: undefined,
  blockchainRateLimit8: undefined,
  blockchainRateLimit9: undefined,
  blockchainRateLimit10: undefined,
  blockchainRateLimit11: undefined,
  blockchainRateLimit12: undefined,
  blockchainRateLimit13: undefined,
  blockchainRateLimit14: undefined,
  blockchainRateLimit15: undefined,
  blockchainRateLimit16: undefined,
  blockchainRateLimit17: undefined
}

let i = 1
while (i < 18) {
  config[`blockchainRateLimit${i}`] = new RateLimit({
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

// Define routes.
router.get("/", config.blockchainRateLimit1, root)
router.get("/getBestBlockHash", config.blockchainRateLimit2, getBestBlockHash)
//router.get("/getBlock/:hash", config.blockchainRateLimit3, getBlock) // Same as block/getBlockByHash
router.get("/getBlockchainInfo", config.blockchainRateLimit4, getBlockchainInfo)
router.get("/getBlockCount", config.blockchainRateLimit5, getBlockCount)
router.get("/getChainTips", config.blockchainRateLimit8, getChainTips)
router.get("/getDifficulty", config.blockchainRateLimit9, getDifficulty)
router.get("/getMempoolInfo", config.blockchainRateLimit13, getMempoolInfo)

function root(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return res.json({ status: "blockchain" })
}

// Returns the hash of the best (tip) block in the longest block chain.
async function getBestBlockHash(
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

    requestConfig.data.id = "getbestblockhash"
    requestConfig.data.method = "getbestblockhash"
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

/*
// Get a block via the hash. This is a redundant function call. The same function
// is achieved by the block/detailsByHash() function.
async function getBlock(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let verbose = false
  if (req.query.verbose && req.query.verbose === "true") verbose = true

  let showTxs = true
  if (req.query.txs && req.query.txs === "false") showTxs = false

  requestConfig.data.id = "getblock"
  requestConfig.data.method = "getblock"
  requestConfig.data.params = [req.params.hash, verbose]

  try {
    const response = await BitboxHTTP(requestConfig)
    if (!showTxs) delete response.data.result.tx
    res.json(response.data.result)
  } catch (error) {
    res.status(500).send(error.response.data.error)
  }
}
*/

async function getBlockchainInfo(
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

    requestConfig.data.id = "getblockchaininfo"
    requestConfig.data.method = "getblockchaininfo"
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

async function getBlockCount(
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

    requestConfig.data.id = "getblockcount"
    requestConfig.data.method = "getblockcount"
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

// redundant. Same call is in block.tx/detailsByHash
/*
router.get(
  "/getBlockHash/:height",
  config.blockchainRateLimit6,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let heights = JSON.parse(req.params.height)
      if (heights.length > 20) {
        res.json({
          error: "Array too large. Max 20 heights"
        })
      }
      const result: any[] = []
      heights = heights.map((height: any) =>
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
            params: [height]
          }
        }).catch(error => {
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
      )
      axios.all(heights).then(
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
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)
*/

/*
router.get(
  "/getBlockHeader/:hash",
  config.blockchainRateLimit7,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let verbose = false
    if (req.query.verbose && req.query.verbose === "true") verbose = true

    try {
      let hashes = JSON.parse(req.params.hash)
      if (hashes.length > 20) {
        res.json({
          error: "Array too large. Max 20 hashes"
        })
      }
      const result = [] as any
      hashes = hashes.map((hash: any) =>
        BitboxHTTP({
          method: "post",
          auth: {
            username: username,
            password: password
          },
          data: {
            jsonrpc: "1.0",
            id: "getblockheader",
            method: "getblockheader",
            params: [hash, verbose]
          }
        }).catch(error => {
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
      )
      axios.all(hashes).then(
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
      BitboxHTTP({
        method: "post",
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id: "getblockheader",
          method: "getblockheader",
          params: [req.params.hash, verbose]
        }
      })
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)
*/

async function getChainTips(
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

    requestConfig.data.id = "getchaintips"
    requestConfig.data.method = "getchaintips"
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

async function getDifficulty(
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

    requestConfig.data.id = "getdifficulty"
    requestConfig.data.method = "getdifficulty"
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

/*
router.get(
  "/getMempoolAncestors/:txid",
  config.blockchainRateLimit10,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let verbose = false
    if (req.query.verbose && req.query.verbose === "true") verbose = true

    try {
      let txids = JSON.parse(req.params.txid)
      if (txids.length > 20) {
        res.json({
          error: "Array too large. Max 20 txids"
        })
      }
      const result = [] as any
      txids = txids.map((txid: any) =>
        BitboxHTTP({
          method: "post",
          auth: {
            username: username,
            password: password
          },
          data: {
            jsonrpc: "1.0",
            id: "getmempoolancestors",
            method: "getmempoolancestors",
            params: [txid, verbose]
          }
        }).catch(error => {
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
      )
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
      BitboxHTTP({
        method: "post",
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id: "getmempoolancestors",
          method: "getmempoolancestors",
          params: [req.params.txid, verbose]
        }
      })
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)

router.get(
  "/getMempoolDescendants/:txid",
  config.blockchainRateLimit11,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let verbose = false
    if (req.query.verbose && req.query.verbose === "true") verbose = true

    try {
      let txids = JSON.parse(req.params.txid)
      if (txids.length > 20) {
        res.json({
          error: "Array too large. Max 20 txids"
        })
      }
      const result = [] as any
      txids = txids.map((txid: any) =>
        BitboxHTTP({
          method: "post",
          auth: {
            username: username,
            password: password
          },
          data: {
            jsonrpc: "1.0",
            id: "getmempooldescendants",
            method: "getmempooldescendants",
            params: [txid, verbose]
          }
        }).catch(error => {
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
      )
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
      BitboxHTTP({
        method: "post",
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id: "getmempooldescendants",
          method: "getmempooldescendants",
          params: [req.params.txid, verbose]
        }
      })
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)

router.get(
  "/getMempoolEntry/:txid",
  config.blockchainRateLimit12,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let txids = JSON.parse(req.params.txid)
      if (txids.length > 20) {
        res.json({
          error: "Array too large. Max 20 txids"
        })
      }
      const result = [] as any
      txids = txids.map((txid: any) =>
        BitboxHTTP({
          method: "post",
          auth: {
            username: username,
            password: password
          },
          data: {
            jsonrpc: "1.0",
            id: "getmempoolentry",
            method: "getmempoolentry",
            params: [txid]
          }
        }).catch(error => {
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
      )
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
      BitboxHTTP({
        method: "post",
        auth: {
          username: username,
          password: password
        },
        data: {
          jsonrpc: "1.0",
          id: "getmempoolentry",
          method: "getmempoolentry",
          params: [req.params.txid]
        }
      })
        .then(response => {
          res.json(response.data.result)
        })
        .catch(error => {
          res.send(error.response.data.error.message)
        })
    }
  }
)
*/

async function getMempoolInfo(
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

    requestConfig.data.id = "getmempoolinfo"
    requestConfig.data.method = "getmempoolinfo"
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

/*
router.get(
  "/getRawMempool",
  config.blockchainRateLimit14,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let verbose = false
    if (req.query.verbose && req.query.verbose === "true") verbose = true

    requestConfig.data.id = "getrawmempool"
    requestConfig.data.method = "getrawmempool"
    requestConfig.data.params = [verbose]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)

router.get(
  "/getTxOut/:txid/:n",
  config.blockchainRateLimit15,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let include_mempool = false
    if (req.query.include_mempool && req.query.include_mempool === "true")
      include_mempool = true

    requestConfig.data.id = "gettxout"
    requestConfig.data.method = "gettxout"
    requestConfig.data.params = [
      req.params.txid,
      parseInt(req.params.n),
      include_mempool
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
  "/getTxOutProof/:txids",
  config.blockchainRateLimit16,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "gettxoutproof"
    requestConfig.data.method = "gettxoutproof"
    requestConfig.data.params = [req.params.txids]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)
//
// router.get('/preciousBlock/:hash', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"preciousblock",
//       method: "preciousblock",
//       params: [
//         req.params.hash
//       ]
//     }
//   })
//   .then((response) => {
//     res.json(JSON.stringify(response.data.result));
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.post('/pruneBlockchain/:height', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"pruneblockchain",
//       method: "pruneblockchain",
//       params: [
//         req.params.height
//       ]
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
// router.get('/verifyChain', async (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"verifychain",
//       method: "verifychain"
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });

router.get(
  "/verifyTxOutProof/:proof",
  config.blockchainRateLimit17,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "verifytxoutproof"
    requestConfig.data.method = "verifytxoutproof"
    requestConfig.data.params = [req.params.proof]

    try {
      const response = await BitboxHTTP(requestConfig)
      res.json(response.data.result)
    } catch (error) {
      res.status(500).send(error.response.data.error)
    }
  }
)
*/

module.exports = {
  router,
  testableComponents: {
    root,
    getBestBlockHash,
    //getBlock,
    getBlockchainInfo,
    getBlockCount,
    getChainTips,
    getDifficulty,
    getMempoolInfo
  }
}
