let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let transactionRoute = require('../routes/transaction');

describe("#TransactionRouter", () => {
  describe("#root", () => {
    it("should return 'transaction' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      transactionRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'transaction'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#TransactionDetails", () => {
    it("should GET /details/:txid single txid", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/details/78b5847f469f3e96b68c49097261d19c10ca5830c1e883333eb80e9252d9df86"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      transactionRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'txid', 'version', 'locktime', 'vin', 'vout', 'blockhash', 'blockheight', 'confirmations', 'time', 'blocktime', 'valueOut', 'size', 'valueIn', 'fees' ]);
        done();
      });
    });

    it("should GET /details/:txid array", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: '/details/["113f1fe1c454a56436d4f93c7c6e315d1ed985d111299e9c2a3e2d3d1e9f177f", "f813f112cadd8b32670486dedcf81b4c2242c967759c9b61dee20b7e0830bb85"%5D'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      transactionRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, [ 'txid', 'version', 'locktime', 'vin', 'vout', 'blockhash', 'blockheight', 'confirmations', 'time', 'blocktime', 'valueOut', 'size', 'valueIn', 'fees' ]);
        done();
      });
    });
  });
});
