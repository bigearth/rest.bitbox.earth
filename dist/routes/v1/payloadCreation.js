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
var BitboxHTTP = axios.create({
    baseURL: process.env.RPC_BASEURL
});
var username = process.env.RPC_USERNAME;
var password = process.env.RPC_PASSWORD;
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
var config = {
    payloadCreationRateLimit1: undefined,
    payloadCreationRateLimit2: undefined,
    payloadCreationRateLimit3: undefined,
    payloadCreationRateLimit4: undefined,
    payloadCreationRateLimit5: undefined,
    payloadCreationRateLimit6: undefined,
    payloadCreationRateLimit7: undefined,
    payloadCreationRateLimit8: undefined,
    payloadCreationRateLimit9: undefined,
    payloadCreationRateLimit10: undefined,
    payloadCreationRateLimit11: undefined,
    payloadCreationRateLimit12: undefined,
    payloadCreationRateLimit13: undefined,
    payloadCreationRateLimit14: undefined,
    payloadCreationRateLimit15: undefined
};
var i = 1;
while (i < 16) {
    config["payloadCreationRateLimit" + i] = new RateLimit({
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
router.get("/", config.payloadCreationRateLimit1, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ status: "payloadCreation" });
        return [2 /*return*/];
    });
}); });
router.get("/burnBCH", config.payloadCreationRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_burnbch";
                requestConfig.data.method = "whc_createpayload_burnbch";
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
                error_1 = _a.sent();
                res.status(500).send(error_1.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/changeIssuer/:propertyId", config.payloadCreationRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_changeissuer";
                requestConfig.data.method = "whc_createpayload_changeissuer";
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
                res.status(500).send(error_2.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/closeCrowdSale/:propertyId", config.payloadCreationRateLimit3, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_closecrowdsale";
                requestConfig.data.method = "whc_createpayload_closecrowdsale";
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
                error_3 = _a.sent();
                res.status(500).send(error_3.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/grant/:propertyId/:amount", config.payloadCreationRateLimit4, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [parseInt(req.params.propertyId), req.params.amount];
                if (req.query.memo)
                    params.push(req.query.memo);
                requestConfig.data.id = "whc_createpayload_grant";
                requestConfig.data.method = "whc_createpayload_grant";
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
                //res.status(500).send(error.response.data.error);
                res.status(500);
                return [2 /*return*/, res.send(error_4)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/crowdsale/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data/:propertyIdDesired/:tokensPerUnit/:deadline/:earlyBonus/:undefine/:totalNumber", config.payloadCreationRateLimit6, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var now, OneHundredYears, OneHundredYearsFromNow, OneHundredYearsFromNowUnixTimestamp, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = new Date();
                OneHundredYears = 1000 * 60 * 60 * 24 * 365 * 100;
                OneHundredYearsFromNow = now.getTime() + OneHundredYears;
                OneHundredYearsFromNowUnixTimestamp = Math.floor(OneHundredYearsFromNow / 1000);
                if (req.params.deadline > OneHundredYearsFromNowUnixTimestamp) {
                    res.status(422);
                    res.send("Invalid deadline. Unix timestamp should be less than 100 years from now. Unix timestamp === JavaScript getTime()/1000");
                    return [2 /*return*/];
                }
                requestConfig.data.id = "whc_createpayload_issuancecrowdsale";
                requestConfig.data.method = "whc_createpayload_issuancecrowdsale";
                requestConfig.data.params = [
                    parseInt(req.params.ecosystem),
                    parseInt(req.params.propertyPrecision),
                    parseInt(req.params.previousId),
                    req.params.category,
                    req.params.subcategory,
                    req.params.name,
                    req.params.url,
                    req.params.data,
                    parseInt(req.params.propertyIdDesired),
                    req.params.tokensPerUnit,
                    parseInt(req.params.deadline),
                    parseInt(req.params.earlyBonus),
                    parseInt(req.params.undefine),
                    req.params.totalNumber
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
                error_5 = _a.sent();
                res.status(500).send(error_5.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/fixed/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data/:amount", config.payloadCreationRateLimit7, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_issuancefixed";
                requestConfig.data.method = "whc_createpayload_issuancefixed";
                requestConfig.data.params = [
                    parseInt(req.params.ecosystem),
                    parseInt(req.params.propertyPrecision),
                    parseInt(req.params.previousId),
                    req.params.category,
                    req.params.subcategory,
                    req.params.name,
                    req.params.url,
                    req.params.data,
                    req.params.amount
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
                error_6 = _a.sent();
                res.status(500).send(error_6.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/managed/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data", config.payloadCreationRateLimit8, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_issuancemanaged";
                requestConfig.data.method = "whc_createpayload_issuancemanaged";
                requestConfig.data.params = [
                    parseInt(req.params.ecosystem),
                    parseInt(req.params.propertyPrecision),
                    parseInt(req.params.previousId),
                    req.params.category,
                    req.params.subcategory,
                    req.params.name,
                    req.params.url,
                    req.params.data
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
                error_7 = _a.sent();
                res.status(500).send(error_7.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/participateCrowdSale/:amount", config.payloadCreationRateLimit9, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_particrowdsale";
                requestConfig.data.method = "whc_createpayload_particrowdsale";
                requestConfig.data.params = [req.params.amount];
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
router.post("/revoke/:propertyId/:amount", config.payloadCreationRateLimit10, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [parseInt(req.params.propertyId), req.params.amount];
                if (req.query.memo)
                    params.push(req.query.memo);
                requestConfig.data.id = "whc_createpayload_revoke";
                requestConfig.data.method = "whc_createpayload_revoke";
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
                error_9 = _a.sent();
                res.status(500).send(error_9.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/sendAll/:ecosystem", config.payloadCreationRateLimit11, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_sendall";
                requestConfig.data.method = "whc_createpayload_sendall";
                requestConfig.data.params = [parseInt(req.params.ecosystem)];
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
router.post("/simpleSend/:propertyId/:amount", config.payloadCreationRateLimit12, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestConfig.data.id = "whc_createpayload_simplesend";
                requestConfig.data.method = "whc_createpayload_simplesend";
                requestConfig.data.params = [
                    parseInt(req.params.propertyId),
                    req.params.amount
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
router.post("/STO/:propertyId/:amount", config.payloadCreationRateLimit13, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [parseInt(req.params.propertyId), req.params.amount];
                if (req.query.distributionProperty)
                    params.push(parseInt(req.query.distributionProperty));
                requestConfig.data.id = "whc_createpayload_sto";
                requestConfig.data.method = "whc_createpayload_sto";
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
                error_12 = _a.sent();
                res.status(500).send(error_12.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/freeze/:toAddress/:propertyId", config.payloadCreationRateLimit14, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [
                    BITBOX.Address.toCashAddress(req.params.toAddress),
                    parseInt(req.params.propertyId),
                    "100"
                ];
                requestConfig.data.id = "whc_createpayload_freeze";
                requestConfig.data.method = "whc_createpayload_freeze";
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
                error_13 = _a.sent();
                res.status(500).send(error_13.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/unfreeze/:toAddress/:propertyId", config.payloadCreationRateLimit15, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var params, response, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = [
                    BITBOX.Address.toCashAddress(req.params.toAddress),
                    parseInt(req.params.propertyId),
                    "100"
                ];
                requestConfig.data.id = "whc_createpayload_unfreeze";
                requestConfig.data.method = "whc_createpayload_unfreeze";
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
                error_14 = _a.sent();
                res.status(500).send(error_14.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
