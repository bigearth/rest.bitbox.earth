let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let blockchainRoute = require('../routes/blockchain');

describe("#BlockchainRouter", () => {
  describe("#root", () => {
    it("should return 'blockchain' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      blockchainRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'blockchain'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#BlockchainGetBestBlockHash", () => {
    it("should GET /getBestBlockHash ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBestBlockHash"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: check actual value not just length
        actualResponseBody = "0000000000000000010601d5f62fc53698ef0aca2e2ef11321af0c83cdc7eb67"
        assert.equal(actualResponseBody.length, 64);
        done();
      });
    });
  });

  describe("#BlockchainGetBlock", () => {
    it("should GET /getblock/:id", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getblock/00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'hash', 'confirmations', 'size', 'height', 'version', 'versionHex', 'merkleroot', 'tx', 'time', 'mediantime', 'nonce', 'bits', 'difficulty', 'chainwork', 'previousblockhash', 'nextblockhash' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetBlockchainInfo", () => {
    it("should GET /getBlockchainInfo ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockchainInfo"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'chain', 'blocks', 'headers', 'bestblockhash', 'difficulty', 'mediantime', 'verificationprogress', 'chainwork', 'pruned', 'softforks', 'bip9_softforks' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetBlockCount", () => {
    it("should GET /getBlockCount ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockCount"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = parseInt(mockResponse._getData());
        assert.equal(typeof actualResponseBody, "number");
        done();
      });
    });
  });

});
