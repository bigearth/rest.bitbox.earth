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
var _this = this;
var express = require("express");
var router = express.Router();
var axios = require("axios");
var RateLimit = require("express-rate-limit");
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
var BitboxHTTP = axios.create({
    baseURL: process.env.RPC_BASEURL
});
var username = process.env.RPC_USERNAME;
var password = process.env.RPC_PASSWORD;
var config = {
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
};
var i = 1;
while (i < 21) {
    config["dataRetrievalRateLimit" + i] = new RateLimit({
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
var requestConfig = {
    method: "post",
    auth: {
        username: username,
        password: password
    },
    data: {
        jsonrpc: "1.0"
    }
};
router.get("/", config.dataRetrievalRateLimit1, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ status: "dataRetrieval" });
        return [2 /*return*/];
    });
}); });
router.get("/balancesForAddress/:address", config.dataRetrievalRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getallbalancesforaddress";
                requestConfig.data.method = "whc_getallbalancesforaddress";
                requestConfig.data.params = [req.params.address];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).send(error_1.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/balancesForId/:propertyId", config.dataRetrievalRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getallbalancesforid";
                requestConfig.data.method = "whc_getallbalancesforid";
                requestConfig.data.params = [parseInt(req.params.propertyId)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                //res.status(500).send(error.response.data.error)
                res.status(500);
                return [2 /*return*/, res.send(error_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/balance/:address/:propertyId", config.dataRetrievalRateLimit3, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getbalance";
                requestConfig.data.method = "whc_getbalance";
                requestConfig.data.params = [
                    req.params.address,
                    parseInt(req.params.propertyId)
                ];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).send(error_3.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/balancesHash/:propertyId", config.dataRetrievalRateLimit4, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getbalanceshash";
                requestConfig.data.method = "whc_getbalanceshash";
                requestConfig.data.params = [parseInt(req.params.propertyId)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).send(error_4.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/crowdSale/:propertyId", config.dataRetrievalRateLimit5, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var verbose, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                verbose = false;
                if (req.query.verbose && req.query.verbose === "true")
                    verbose = true;
                requestConfig.data.id = "whc_getcrowdsale";
                requestConfig.data.method = "whc_getcrowdsale";
                requestConfig.data.params = [parseInt(req.params.propertyId), verbose];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                //res.status(500).send(error.response.data.error);
                res.status(500);
                return [2 /*return*/, res.send(error_5)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/currentConsensusHash", config.dataRetrievalRateLimit6, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getcurrentconsensushash";
                requestConfig.data.method = "whc_getcurrentconsensushash";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500).send(error_6.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/grants/:propertyId", config.dataRetrievalRateLimit8, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getgrants";
                requestConfig.data.method = "whc_getgrants";
                requestConfig.data.params = [parseInt(req.params.propertyId)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                //res.status(500).send(error.response.data.error);
                res.status(500);
                return [2 /*return*/, res.send(error_7)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/info", config.dataRetrievalRateLimit9, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getinfo";
                requestConfig.data.method = "whc_getinfo";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(500).send(error_8.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/payload/:txid", config.dataRetrievalRateLimit10, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getpayload";
                requestConfig.data.method = "whc_getpayload";
                requestConfig.data.params = [req.params.txid];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                res.status(500).send(error_9.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/property/:propertyId", config.dataRetrievalRateLimit11, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getproperty";
                requestConfig.data.method = "whc_getproperty";
                requestConfig.data.params = [parseInt(req.params.propertyId)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                res.status(500).send(error_10.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/seedBlocks/:startBlock/:endBlock", config.dataRetrievalRateLimit12, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getseedblocks";
                requestConfig.data.method = "whc_getseedblocks";
                requestConfig.data.params = [
                    parseInt(req.params.startBlock),
                    parseInt(req.params.endBlock)
                ];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                res.status(500).send(error_11.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/STO/:txid/:recipientFilter", config.dataRetrievalRateLimit13, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_getsto";
                requestConfig.data.method = "whc_getsto";
                requestConfig.data.params = [req.params.txid, req.params.recipientFilter];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_12 = _a.sent();
                res.status(500).send(error_12.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/transaction/:txid", config.dataRetrievalRateLimit14, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_gettransaction";
                requestConfig.data.method = "whc_gettransaction";
                requestConfig.data.params = [req.params.txid];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_13 = _a.sent();
                //res.status(500).send(error.response.data.error);
                res.status(500);
                return [2 /*return*/, res.send(error_13)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/blockTransactions/:index", config.dataRetrievalRateLimit15, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_listblocktransactions";
                requestConfig.data.method = "whc_listblocktransactions";
                requestConfig.data.params = [parseInt(req.params.index)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_14 = _a.sent();
                res.status(500).send(error_14.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/pendingTransactions", config.dataRetrievalRateLimit16, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [];
                if (req.query.address)
                    params.push(req.query.address);
                requestConfig.data.id = "whc_listpendingtransactions";
                requestConfig.data.method = "whc_listpendingtransactions";
                requestConfig.data.params = params;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_15 = _a.sent();
                res.status(500);
                return [2 /*return*/, res.send(error_15)
                    //res.status(500).send(error.response.data.error)
                ];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/properties", config.dataRetrievalRateLimit17, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_listproperties";
                requestConfig.data.method = "whc_listproperties";
                requestConfig.data.params = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_16 = _a.sent();
                res.status(500).send(error_16.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/frozenBalance/:address/:propertyId", config.dataRetrievalRateLimit18, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [
                    BITBOX.Address.toCashAddress(req.params.address),
                    parseInt(req.params.propertyId)
                ];
                requestConfig.data.id = "whc_getfrozenbalance";
                requestConfig.data.method = "whc_getfrozenbalance";
                requestConfig.data.params = params;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_17 = _a.sent();
                res.status(500).send(error_17.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/frozenBalanceForAddress/:address", config.dataRetrievalRateLimit19, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [BITBOX.Address.toCashAddress(req.params.address)];
                requestConfig.data.id = "whc_getfrozenbalanceforaddress";
                requestConfig.data.method = "whc_getfrozenbalanceforaddress";
                requestConfig.data.params = params;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_18 = _a.sent();
                res.status(500).send(error_18.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/frozenBalanceForId/:propertyId", config.dataRetrievalRateLimit20, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [parseInt(req.params.propertyId)];
                requestConfig.data.id = "whc_getfrozenbalanceforid";
                requestConfig.data.method = "whc_getfrozenbalanceforid";
                requestConfig.data.params = params;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BitboxHTTP(requestConfig)];
            case 2:
                response = _a.sent();
                res.json(response.data.result);
                return [3 /*break*/, 4];
            case 3:
                error_19 = _a.sent();
                res.status(500).send(error_19.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
