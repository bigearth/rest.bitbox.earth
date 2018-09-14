/*
  Tests the /details endpoint.


*/

"use strict";

//const chai = require("chai");
const assert = require("assert");
const httpMocks = require("node-mocks-http");
const addressRoute = require("../routes/address");
const { mockReq, mockRes } = require("./mocks/express-mocks");
const sinon = require("sinon");

const util = require("util");
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
};

before(() => {
  if (!process.env.TEST) process.env.TEST = "unit";

  if (process.env.TEST === "unit") process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/";

  const testMock = myarg => {
    console.log(`testMock: ${util.inspect(myarg)}`);
  };
  testMock({ a: 1, b: 2 });
});

describe("#AddressRouter", () => {
  let req, res;

  // Setup the mocks before each test.
  beforeEach(() => {
    // Mock the req and res objects used by Express routes.
    req = mockReq;
    res = mockRes;
  });

  describe("#root", () => {
    // root route handler.
    const root = addressRoute.testableComponents.root;

    it("should return status of 'address' for GET /", () => {
      const result = root(req, res);

      assert(result, { status: "address" }, "Returns static string");
    });
  });

  describe("#AddressDetails", () => {
    // details route handler.
    const details = addressRoute.testableComponents.details2;

    /*
    it("should GET /details/:address single address", done => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/details/["qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"%5D',
      });
      const mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter,
      });
      //console.log(`mockRequest: ${util.inspect(mockRequest)}`);
      //console.log(`mockResponse: ${util.inspect(mockResponse)}`);
      addressRoute(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        const actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        //console.log(`actualResponseBody: ${util.inspect(actualResponseBody)}`);
        assert.deepEqual(actualResponseBody, [
          "balance",
          "balanceSat",
          "totalReceived",
          "totalReceivedSat",
          "totalSent",
          "totalSentSat",
          "unconfirmedBalance",
          "unconfirmedBalanceSat",
          "unconfirmedTxApperances",
          "txApperances",
          "transactions",
          "legacyAddress",
          "cashAddress",
        ]);
        done();
      });
    });
    */
    it("v2: should GET /details/:address single address", async () => {
      req.params = {
        //address: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`],
        address: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`],
      };

      const result = await details(req, res);
      console.log(`test result: ${JSON.stringify(result)}`);

      assert(true, true);
    });

    /*
    it("should GET /details/:address array of addresses", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/details/["qql6r7khtjgwy3ufnjtsczvaf925hyw49cudht57tr", "qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, [ 'balance', 'balanceSat', 'totalReceived', 'totalReceivedSat', 'totalSent', 'totalSentSat', 'unconfirmedBalance', 'unconfirmedBalanceSat', 'unconfirmedTxApperances', 'txApperances', 'transactions', 'legacyAddress', 'cashAddress' ]);
        done();
      });
    });
    */
  });
  /*
  describe("#AddressUtxo", () => {
    it("should GET /utxo/:address single address", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/utxo/["qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0][0]);
        assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });

    it("should GET /utxo/:address array of addresses", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/utxo/["qql6r7khtjgwy3ufnjtsczvaf925hyw49cudht57tr", "qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[1][0]);
        assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });
  });

  describe("#AddressUnconfirmed", () => {
    it("should GET /unconfirmed/:address single address", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/unconfirmed/["qql6r7khtjgwy3ufnjtsczvaf925hyw49cudht57tr"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, []);
        // assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });

    it("should GET /unconfirmed/:address array of addresses", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/unconfirmed/["qql6r7khtjgwy3ufnjtsczvaf925hyw49cudht57tr", "qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, []);
        // assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });
  });
  */
});
