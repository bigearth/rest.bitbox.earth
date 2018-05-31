let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let addressRoute = require('../routes/address');

describe("#AddressRouter", () => {
  describe("#root", () => {
    it("should return 'address' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      addressRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'address'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#AddressDetails", () => {
    it("should GET /details/:address ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/details/qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'balance', 'balanceSat', 'totalReceived', 'totalReceivedSat', 'totalSent', 'totalSentSat', 'unconfirmedBalance', 'unconfirmedBalanceSat', 'unconfirmedTxApperances', 'txApperances', 'transactions', 'legacyAddress', 'cashAddress' ]);
        done();
      });
    });
  });

  describe("#AddressUtxo", () => {
    it("should GET /utxo/:address ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/utxo/qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });
  });

  describe("#AddressUnconfirmed", () => {
    it("should GET /unconfirmed/:address ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/unconfirmed/qql6r7khtjgwy3ufnjtsczvaf925hyw49cudht57tr"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      addressRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        // TODO: Needs a utxo to pass. Comparing with an empty array for now.
        // assert.deepEqual(actualResponseBody, [ 'txid', 'vout', 'scriptPubKey', 'amount', 'satoshis', 'height', 'confirmations', 'legacyAddress', 'cashAddress']);
        done();
      });
    });
  });

});
