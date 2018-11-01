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
//const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
//const BITBOX = new BITBOXCli();
var BitboxHTTP = axios.create({
    baseURL: process.env.RPC_BASEURL
});
var username = process.env.RPC_USERNAME;
var password = process.env.RPC_PASSWORD;
var config = {
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
};
var i = 1;
while (i < 12) {
    config["rawTransactionsRateLimit" + i] = new RateLimit({
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
//const requestConfig = {
//  method: "post",
//  auth: {
//    username: username,
//    password: password,
//  },
//  data: {
//    jsonrpc: "1.0",
//  },
//};
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
router.get("/", config.rawTransactionsRateLimit1, function (req, res, next) {
    res.json({ status: "rawtransactions" });
});
router.get("/decodeRawTransaction/:hex", config.rawTransactionsRateLimit2, function (req, res, next) {
    try {
        var transactions = JSON.parse(req.params.hex);
        if (transactions.length > 20) {
            res.json({
                error: "Array too large. Max 20 transactions"
            });
        }
        var result_1 = [];
        transactions = transactions.map(function (transaction) {
            return BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "decoderawtransaction",
                    method: "decoderawtransaction",
                    params: [transaction]
                }
            }).catch(function (error) {
                try {
                    return {
                        data: {
                            result: error.response.data.error.message
                        }
                    };
                }
                catch (ex) {
                    return {
                        data: {
                            result: "unknown error"
                        }
                    };
                }
            });
        });
        axios.all(transactions).then(axios.spread(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i_1 = 0; i_1 < args.length; i_1++) {
                var parsed = args[i_1].data.result;
                result_1.push(parsed);
            }
            res.json(result_1);
        }));
    }
    catch (error) {
        BitboxHTTP({
            method: "post",
            auth: {
                username: username,
                password: password
            },
            data: {
                jsonrpc: "1.0",
                id: "decoderawtransaction",
                method: "decoderawtransaction",
                params: [req.params.hex]
            }
        })
            .then(function (response) {
            res.json(response.data.result);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
router.get("/decodeScript/:script", config.rawTransactionsRateLimit3, function (req, res, next) {
    try {
        var scripts = JSON.parse(req.params.script);
        if (scripts.length > 20) {
            res.json({
                error: "Array too large. Max 20 scripts"
            });
        }
        var result_2 = [];
        scripts = scripts.map(function (script) {
            return BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "decodescript",
                    method: "decodescript",
                    params: [script]
                }
            }).catch(function (error) {
                try {
                    return {
                        data: {
                            result: error.response.data.error.message
                        }
                    };
                }
                catch (ex) {
                    return {
                        data: {
                            result: "unknown error"
                        }
                    };
                }
            });
        });
        axios.all(scripts).then(axios.spread(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i_2 = 0; i_2 < args.length; i_2++) {
                var parsed = args[i_2].data.result;
                result_2.push(parsed);
            }
            res.json(result_2);
        }));
    }
    catch (error) {
        BitboxHTTP({
            method: "post",
            auth: {
                username: username,
                password: password
            },
            data: {
                jsonrpc: "1.0",
                id: "decodescript",
                method: "decodescript",
                params: [req.params.script]
            }
        })
            .then(function (response) {
            res.json(response.data.result);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
router.get("/getRawTransaction/:txid", config.rawTransactionsRateLimit4, function (req, res, next) {
    var verbose = 0;
    if (req.query.verbose && req.query.verbose === "true")
        verbose = 1;
    try {
        var txids = JSON.parse(req.params.txid);
        if (txids.length > 20) {
            res.json({
                error: "Array too large. Max 20 txids"
            });
        }
        var result_3 = [];
        txids = txids.map(function (txid) {
            return BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "getrawtransaction",
                    method: "getrawtransaction",
                    params: [txid, verbose]
                }
            }).catch(function (error) {
                try {
                    return {
                        data: {
                            result: error.response.data.error.message
                        }
                    };
                }
                catch (ex) {
                    return {
                        data: {
                            result: "unknown error"
                        }
                    };
                }
            });
        });
        axios.all(txids).then(axios.spread(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i_3 = 0; i_3 < args.length; i_3++) {
                var parsed = args[i_3].data.result;
                result_3.push(parsed);
            }
            res.json(result_3);
        }));
    }
    catch (error) {
        BitboxHTTP({
            method: "post",
            auth: {
                username: username,
                password: password
            },
            data: {
                jsonrpc: "1.0",
                id: "getrawtransaction",
                method: "getrawtransaction",
                params: [req.params.txid, verbose]
            }
        })
            .then(function (response) {
            res.json(response.data.result);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
router.post("/sendRawTransaction/:hex", config.rawTransactionsRateLimit5, function (req, res, next) {
    try {
        var transactions = JSON.parse(req.params.hex);
        if (transactions.length > 20) {
            res.json({
                error: "Array too large. Max 20 transactions"
            });
        }
        var result_4 = [];
        transactions = transactions.map(function (transaction) {
            return BitboxHTTP({
                method: "post",
                auth: {
                    username: username,
                    password: password
                },
                data: {
                    jsonrpc: "1.0",
                    id: "sendrawtransaction",
                    method: "sendrawtransaction",
                    params: [transaction]
                }
            }).catch(function (error) {
                try {
                    return {
                        data: {
                            result: error.response.data.error.message
                        }
                    };
                }
                catch (ex) {
                    return {
                        data: {
                            result: "unknown error"
                        }
                    };
                }
            });
        });
        axios.all(transactions).then(axios.spread(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i_4 = 0; i_4 < args.length; i_4++) {
                var parsed = args[i_4].data.result;
                result_4.push(parsed);
            }
            res.json(result_4);
        }));
    }
    catch (error) {
        BitboxHTTP({
            method: "post",
            auth: {
                username: username,
                password: password
            },
            data: {
                jsonrpc: "1.0",
                id: "sendrawtransaction",
                method: "sendrawtransaction",
                params: [req.params.hex]
            }
        })
            .then(function (response) {
            res.json(response.data.result);
        })
            .catch(function (error) {
            res.send(error.response.data.error.message);
        });
    }
});
router.post("/change/:rawtx/:prevTxs/:destination/:fee", config.rawTransactionsRateLimit6, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                params = [
                    req.params.rawtx,
                    JSON.parse(req.params.prevTxs),
                    req.params.destination,
                    parseFloat(req.params.fee)
                ];
                if (req.query.position)
                    params.push(parseInt(req.query.position));
                requestConfig.data.id = "whc_createrawtx_change";
                requestConfig.data.method = "whc_createrawtx_change";
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
                error_1 = _a.sent();
                res.status(500).send(error_1.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                res.status(500);
                res.send("Error in /change: " + err_1.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post("/input/:rawTx/:txid/:n", config.rawTransactionsRateLimit7, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createrawtx_input";
                requestConfig.data.method = "whc_createrawtx_input";
                requestConfig.data.params = [
                    req.params.rawTx,
                    req.params.txid,
                    parseInt(req.params.n)
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
                error_2 = _a.sent();
                res.status(500).send(error_2.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/opReturn/:rawTx/:payload", config.rawTransactionsRateLimit8, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createrawtx_opreturn";
                requestConfig.data.method = "whc_createrawtx_opreturn";
                requestConfig.data.params = [req.params.rawTx, req.params.payload];
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
router.post("/reference/:rawTx/:destination", config.rawTransactionsRateLimit9, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [req.params.rawTx, req.params.destination];
                if (req.query.amount)
                    params.push(req.query.amount);
                requestConfig.data.id = "whc_createrawtx_reference";
                requestConfig.data.method = "whc_createrawtx_reference";
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
                error_4 = _a.sent();
                res.status(500).send(error_4.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/decodeTransaction/:rawTx", config.rawTransactionsRateLimit10, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [req.params.rawTx];
                if (req.query.prevTxs)
                    params.push(JSON.parse(req.query.prevTxs));
                if (req.query.height)
                    params.push(req.query.height);
                requestConfig.data.id = "whc_decodetransaction";
                requestConfig.data.method = "whc_decodetransaction";
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
                error_5 = _a.sent();
                res.status(500).send(error_5.response.data.error.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/create/:inputs/:outputs", config.rawTransactionsRateLimit11, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [
                    JSON.parse(req.params.inputs),
                    JSON.parse(req.params.outputs)
                ];
                if (req.query.locktime)
                    params.push(req.query.locktime);
                requestConfig.data.id = "createrawtransaction";
                requestConfig.data.method = "createrawtransaction";
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
                error_6 = _a.sent();
                res.status(500).send(error_6.response.data.error.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
