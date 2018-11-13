"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var RateLimit = require("express-rate-limit");
var routeUtils = require("./route-utils");
var logger = require("./logging.js");
// Used to convert error messages to strings, to safely pass to users.
var util = require("util");
util.inspect.defaultOptions = { depth: 1 };
var config = {
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
};
var i = 1;
while (i < 18) {
    config["blockchainRateLimit" + i] = new RateLimit({
        windowMs: 60000,
        delayMs: 0,
        max: 60,
        handler: function (req, res /*next*/) {
            res.format({
                json: function () {
                    res.status(500).json({
                        error: "Too many requests. Limits are 60 requests per minute."
                    });
                }
            });
        }
    });
    i++;
}
// Define routes.
router.get("/", config.blockchainRateLimit1, root);
router.get("/getBestBlockHash", config.blockchainRateLimit2, getBestBlockHash);
function root(req, res, next) {
    return res.json({ status: "blockchain" });
}
// Returns the hash of the best (tip) block in the longest block chain.
function getBestBlockHash(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, BitboxHTTP, username, password, requestConfig, response, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = routeUtils.setEnvVars(), BitboxHTTP = _a.BitboxHTTP, username = _a.username, password = _a.password, requestConfig = _a.requestConfig;
                    requestConfig.data.id = "getbestblockhash";
                    requestConfig.data.method = "getbestblockhash";
                    requestConfig.data.params = [];
                    return [4 /*yield*/, BitboxHTTP(requestConfig)];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, res.json(response.data.result)];
                case 2:
                    error_1 = _b.sent();
                    // Write out error to error log.
                    logger.error("Error in control/getInfo: ", error_1);
                    res.status(500);
                    return [2 /*return*/, res.json({ error: util.inspect(error_1) })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/*
router.get(
  "/getBlock/:hash",
  config.blockchainRateLimit3,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
)

router.get(
  "/getBlockchainInfo",
  config.blockchainRateLimit4,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "getblockchaininfo"
    requestConfig.data.method = "getblockchaininfo"
    requestConfig.data.params = []

    let response;

    try {
      response = await BitboxHTTP(requestConfig)
    } catch (error) {
      return res.status(500).send(error.response.data.error)
    }

    res.json(response.data.result);
    res.end();
  }
)

router.get(
  "/getBlockCount",
  config.blockchainRateLimit5,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "getblockcount"
    requestConfig.data.method = "getblockcount"
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

router.get(
  "/getChainTips",
  config.blockchainRateLimit8,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "getchaintips"
    requestConfig.data.method = "getchaintips"
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
  "/getDifficulty",
  config.blockchainRateLimit9,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "getdifficulty"
    requestConfig.data.method = "getdifficulty"
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

router.get(
  "/getMempoolInfo",
  config.blockchainRateLimit13,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    requestConfig.data.id = "getmempoolinfo"
    requestConfig.data.method = "getmempoolinfo"
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
    router: router,
    testableComponents: {
        root: root,
        getBestBlockHash: getBestBlockHash
    }
};
