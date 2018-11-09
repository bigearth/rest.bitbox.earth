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
var bitdbToken = process.env.BITDB_TOKEN;
var bitboxproxy = require("slpjs").bitbox;
var utils = require("slpjs").utils;
var slpBalances = require("slp-balances");
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
var config = {
    slpRateLimit1: undefined,
    slpRateLimit2: undefined,
    slpRateLimit3: undefined,
    slpRateLimit4: undefined,
    slpRateLimit5: undefined,
    slpRateLimit6: undefined,
    slpRateLimit7: undefined
};
var i = 1;
while (i < 8) {
    config["slpRateLimit" + i] = new RateLimit({
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
router.get("/", config.slpRateLimit1, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ status: "slp" });
        return [2 /*return*/];
    });
}); });
router.get("/list", config.slpRateLimit2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var query, s, b64, url, header, tokenRes, tokens, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = {
                    v: 3,
                    q: {
                        find: { "out.h1": "534c5000", "out.s3": "GENESIS" },
                        limit: 1000
                    },
                    r: {
                        f: '[ .[] | { id: .tx.h, timestamp: (.blk.t | strftime("%Y-%m-%d %H:%M")), symbol: .out[0].s4, name: .out[0].s5, document: .out[0].s6 } ]'
                    }
                };
                s = JSON.stringify(query);
                b64 = Buffer.from(s).toString("base64");
                url = "https://bitdb.network/q/" + b64;
                header = {
                    headers: { key: bitdbToken }
                };
                return [4 /*yield*/, axios.get(url, header)];
            case 1:
                tokenRes = _a.sent();
                tokens = tokenRes.data.c;
                if (tokenRes.data.u && tokenRes.data.u.length)
                    tokens.concat(tokenRes.u);
                res.json(tokens.reverse());
                return [2 /*return*/, tokens];
            case 2:
                err_1 = _a.sent();
                res.status(500).send(err_1.response.data.error);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/list/:tokenId", config.slpRateLimit3, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var query, s, b64, url, header, tokenRes, tokens, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = {
                    v: 3,
                    q: {
                        find: { "out.h1": "534c5000", "out.s3": "GENESIS" },
                        limit: 1000
                    },
                    r: {
                        f: '[ .[] | { id: .tx.h, timestamp: (.blk.t | strftime("%Y-%m-%d %H:%M")), symbol: .out[0].s4, name: .out[0].s5, document: .out[0].s6 } ]'
                    }
                };
                s = JSON.stringify(query);
                b64 = Buffer.from(s).toString("base64");
                url = "https://bitdb.network/q/" + b64;
                header = {
                    headers: { key: bitdbToken }
                };
                return [4 /*yield*/, axios.get(url, header)];
            case 1:
                tokenRes = _a.sent();
                tokens = tokenRes.data.c;
                if (tokenRes.data.u && tokenRes.data.u.length)
                    tokens.concat(tokenRes.u);
                tokens.forEach(function (token) {
                    if (token.id === req.params.tokenId)
                        return res.json(token);
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).send(err_2.response.data.error);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/balancesForAddress/:address", config.slpRateLimit4, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var slpAddr, balances, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slpAddr = utils.toSlpAddress(req.params.address);
                return [4 /*yield*/, bitboxproxy.getAllTokenBalances(slpAddr)];
            case 1:
                balances = _a.sent();
                balances.slpAddress = slpAddr;
                balances.cashAddress = utils.toCashAddress(slpAddr);
                balances.legacyAddress = BITBOX.Address.toLegacyAddress(balances.cashAddress);
                return [2 /*return*/, res.json(balances)];
            case 2:
                err_3 = _a.sent();
                res.status(500).send(err_3.response.data.error);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/balance/:address/:tokenId", config.slpRateLimit5, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var slpAddr, balances, query, s, b64, url, header, tokenRes, tokens, t_1, obj, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                slpAddr = utils.toSlpAddress(req.params.address);
                return [4 /*yield*/, bitboxproxy.getAllTokenBalances(slpAddr)];
            case 1:
                balances = _a.sent();
                query = {
                    v: 3,
                    q: {
                        find: { "out.h1": "534c5000", "out.s3": "GENESIS" },
                        limit: 1000
                    },
                    r: {
                        f: '[ .[] | { id: .tx.h, timestamp: (.blk.t | strftime("%Y-%m-%d %H:%M")), symbol: .out[0].s4, name: .out[0].s5, document: .out[0].s6 } ]'
                    }
                };
                s = JSON.stringify(query);
                b64 = Buffer.from(s).toString("base64");
                url = "https://bitdb.network/q/" + b64;
                header = {
                    headers: { key: bitdbToken }
                };
                return [4 /*yield*/, axios.get(url, header)];
            case 2:
                tokenRes = _a.sent();
                tokens = tokenRes.data.c;
                if (tokenRes.data.u && tokenRes.data.u.length)
                    tokens.concat(tokenRes.u);
                tokens.forEach(function (token) {
                    if (token.id === req.params.tokenId)
                        t_1 = token;
                });
                obj = {};
                obj.id = t_1.id;
                obj.timestamp = t_1.timestamp;
                obj.symbol = t_1.symbol;
                obj.name = t_1.name;
                obj.document = t_1.document;
                obj.balance = balances[req.params.tokenId];
                obj.slpAddress = slpAddr;
                obj.cashAddress = utils.toCashAddress(slpAddr);
                obj.legacyAddress = BITBOX.Address.toLegacyAddress(obj.cashAddress);
                return [2 /*return*/, res.json(obj)];
            case 3:
                err_4 = _a.sent();
                res.status(500).send(err_4.response.data.error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/address/convert/:address", config.slpRateLimit6, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var slpAddr, obj;
    return __generator(this, function (_a) {
        try {
            slpAddr = utils.toSlpAddress(req.params.address);
            obj = {};
            obj.slpAddress = slpAddr;
            obj.cashAddress = utils.toCashAddress(slpAddr);
            obj.legacyAddress = BITBOX.Address.toLegacyAddress(obj.cashAddress);
            return [2 /*return*/, res.json(obj)];
        }
        catch (err) {
            res.status(500).send(err.response.data.error);
        }
        return [2 /*return*/];
    });
}); });
router.get("/balancesForToken/:tokenId", config.slpRateLimit7, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var balances, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, slpBalances.getBalances(bitdbToken, req.params.tokenId)];
            case 1:
                balances = _a.sent();
                return [2 /*return*/, res.json(balances)];
            case 2:
                err_5 = _a.sent();
                res.status(500).send(err_5.response.data.error);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
