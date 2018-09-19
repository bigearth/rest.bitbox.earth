"use strict";
const express = require("express");
const router = express.Router();
const axios = require("axios");
const RateLimit = require("express-rate-limit");

const WormholeHTTP = axios.create({
  baseURL: process.env.WORMHOLE_RPC_BASEURL,
});
const username = process.env.WORMHOLE_RPC_USERNAME;
const password = process.env.WORMHOLE_RPC_PASSWORD;

const config = {
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
};

let i = 1;
while (i < 19) {
  config[`dataRetrievalRateLimit${i}`] = new RateLimit({
    windowMs: 60000, // 1 hour window
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    max: 60, // start blocking after 60 requests
    handler: function(req, res /*next*/) {
      res.format({
        json: function() {
          res.status(500).json({
            error: "Too many requests. Limits are 60 requests per minute.",
          });
        },
      });
    },
  });
  i++;
}

const requestConfig = {
  method: "post",
  auth: {
    username: username,
    password: password,
  },
  data: {
    jsonrpc: "1.0",
  },
};

router.get("/", config.dataRetrievalRateLimit1, async (req, res, next) => {
  res.json({ status: "dataRetrieval" });
});

router.get("/balancesForAddress/:address", config.dataRetrievalRateLimit2, async (req, res, next) => {
  requestConfig.data.id = "whc_getallbalancesforaddress";
  requestConfig.data.method = "whc_getallbalancesforaddress";
  requestConfig.data.params = [req.params.address];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.response.data.error);
  }
});

router.get("/balancesForId/:propertyId", config.dataRetrievalRateLimit2, async (req, res, next) => {
  requestConfig.data.id = "whc_getallbalancesforid";
  requestConfig.data.method = "whc_getallbalancesforid";
  requestConfig.data.params = [parseInt(req.params.propertyId)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/balance/:address/:propertyId", config.dataRetrievalRateLimit3, async (req, res, next) => {
  requestConfig.data.id = "whc_getbalance";
  requestConfig.data.method = "whc_getbalance";
  requestConfig.data.params = [req.params.address, parseInt(req.params.propertyId)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/balancesHash/:propertyId", config.dataRetrievalRateLimit4, async (req, res, next) => {
  requestConfig.data.id = "whc_getbalanceshash";
  requestConfig.data.method = "whc_getbalanceshash";
  requestConfig.data.params = [parseInt(req.params.propertyId)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/crowdSale/:propertyId", config.dataRetrievalRateLimit5, async (req, res, next) => {
  let verbose = false;
  if (req.query.verbose && req.query.verbose === "true") verbose = true;

  requestConfig.data.id = "whc_getcrowdsale";
  requestConfig.data.method = "whc_getcrowdsale";
  requestConfig.data.params = [parseInt(req.params.propertyId), verbose];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    //res.status(500).send(error.response.data.error);
    res.status(500);
    return res.send(error);
  }
});

router.get("/currentConsensusHash", config.dataRetrievalRateLimit6, async (req, res, next) => {
  requestConfig.data.id = "whc_getcurrentconsensushash";
  requestConfig.data.method = "whc_getcurrentconsensushash";
  requestConfig.data.params = [];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/grants/:propertyId", config.dataRetrievalRateLimit8, async (req, res, next) => {
  requestConfig.data.id = "whc_getgrants";
  requestConfig.data.method = "whc_getgrants";
  requestConfig.data.params = [parseInt(req.params.propertyId)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    //res.status(500).send(error.response.data.error);
    res.status(500);
    return res.send(error);
  }
});

router.get("/info", config.dataRetrievalRateLimit9, async (req, res, next) => {
  requestConfig.data.id = "whc_getinfo";
  requestConfig.data.method = "whc_getinfo";
  requestConfig.data.params = [];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/payload/:txid", config.dataRetrievalRateLimit10, async (req, res, next) => {
  requestConfig.data.id = "whc_getpayload";
  requestConfig.data.method = "whc_getpayload";
  requestConfig.data.params = [req.params.txid];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/property/:propertyId", config.dataRetrievalRateLimit11, async (req, res, next) => {
  requestConfig.data.id = "whc_getproperty";
  requestConfig.data.method = "whc_getproperty";
  requestConfig.data.params = [parseInt(req.params.propertyId)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/seedBlocks/:startBlock/:endBlock", config.dataRetrievalRateLimit12, async (req, res, next) => {
  requestConfig.data.id = "whc_getseedblocks";
  requestConfig.data.method = "whc_getseedblocks";
  requestConfig.data.params = [parseInt(req.params.startBlock), parseInt(req.params.endBlock)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/STO/:txid/:recipientFilter", config.dataRetrievalRateLimit13, async (req, res, next) => {
  requestConfig.data.id = "whc_getsto";
  requestConfig.data.method = "whc_getsto";
  requestConfig.data.params = [req.params.txid, req.params.recipientFilter];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/transaction/:txid", config.dataRetrievalRateLimit14, async (req, res, next) => {
  requestConfig.data.id = "whc_gettransaction";
  requestConfig.data.method = "whc_gettransaction";
  requestConfig.data.params = [req.params.txid];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    //res.status(500).send(error.response.data.error);
    res.status(500);
    return res.send(error);
  }
});

router.get("/blockTransactions/:index", config.dataRetrievalRateLimit15, async (req, res, next) => {
  requestConfig.data.id = "whc_listblocktransactions";
  requestConfig.data.method = "whc_listblocktransactions";
  requestConfig.data.params = [parseInt(req.params.index)];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/pendingTransactions", config.dataRetrievalRateLimit16, async (req, res, next) => {
  const params = [];
  if (req.query.address) params.push(req.query.address);

  requestConfig.data.id = "whc_listpendingtransactions";
  requestConfig.data.method = "whc_listpendingtransactions";
  requestConfig.data.params = params;

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});

router.get("/properties", config.dataRetrievalRateLimit17, async (req, res, next) => {
  requestConfig.data.id = "whc_listproperties";
  requestConfig.data.method = "whc_listproperties";
  requestConfig.data.params = [];

  try {
    const response = await WormholeHTTP(requestConfig);
    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.response.data.error);
  }
});
module.exports = router;
