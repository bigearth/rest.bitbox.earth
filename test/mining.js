let chai = require('chai');
let assert = require('assert');
let expect = chai.expect;
let httpMocks = require("node-mocks-http");
let miningRoute = require('../routes/mining');

describe("#MiningRouter", () => {
  describe("#root", () => {
    it("should return 'mining' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      miningRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'mining'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });
  //
  // describe("#MiningGetBlockTemplate", () => {
  //   it("should GET /getBlockTemplate", (done) => {
  //     let mockRequest = httpMocks.createRequest({
  //       method: "GET",
  //       url: "/getBlockTemplate/{}"
  //     });
  //     let mockResponse = httpMocks.createResponse({
  //       eventEmitter: require('events').EventEmitter
  //     });
  //     miningRoute(mockRequest, mockResponse);
  //
  //     mockResponse.on('end', () => {
  //       let actualResponseBody = mockResponse._getData();
  //       assert.equal(actualResponseBody, 'JSON value is not an object as expected');
  //       done();
  //     });
  //   });
  // });

  describe("#MiningGetMiningInfo", () => {
    it("should GET /getMiningInfo", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMiningInfo"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      miningRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'blocks', 'currentblocksize', 'currentblocktx', 'difficulty', 'blockprioritypercentage', 'errors', 'networkhashps', 'pooledtx', 'chain' ]);
        done();
      });
    });
  });

  describe("#MiningGetNetworkHashps", () => {
    it("should GET /getNetworkHashps", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getNetworkHashps"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      miningRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = parseInt(mockResponse._getData());
        assert.equal(typeof actualResponseBody, "number");
        done();
      });
    });
  });
  //
  // describe("#MiningSubmitBlock", () => {
  //   it("should POST /SubmitBlock", (done) => {
  //     let mockRequest = httpMocks.createRequest({
  //       method: "POST",
  //       url: "/submitBlock/000000000000000000df19ff517463e288aca3de261ece7d53f97da65f9b7b8d"
  //     });
  //     let mockResponse = httpMocks.createResponse({
  //       eventEmitter: require('events').EventEmitter
  //     });
  //     miningRoute(mockRequest, mockResponse);
  //
  //     mockResponse.on('end', () => {
  //       let actualResponseBody = mockResponse._getData();
  //       assert.equal(actualResponseBody, "Block decode failed");
  //       done();
  //     });
  //   });
  // });
});
