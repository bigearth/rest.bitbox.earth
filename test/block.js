let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let blockRoute = require('../routes/block');

describe("#BlockRouter", () => {
  describe("#root", () => {
    it("should return 'block' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      blockRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'block'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#BlockDetails", () => {
    it("should GET /details/:id height", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/details/500000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'hash', 'size', 'height', 'version', 'merkleroot', 'tx', 'time', 'nonce', 'bits', 'difficulty', 'chainwork', 'confirmations', 'previousblockhash', 'nextblockhash', 'reward', 'isMainChain', 'poolInfo' ]);
        done();
      });
    });

    it("should GET /details/:id hash", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/details/00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'hash', 'size', 'height', 'version', 'merkleroot', 'tx', 'time', 'nonce', 'bits', 'difficulty', 'chainwork', 'confirmations', 'previousblockhash', 'nextblockhash', 'reward', 'isMainChain', 'poolInfo' ]);
        done();
      });
    });
  });
});
