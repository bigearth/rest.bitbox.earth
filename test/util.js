"use strict";

//const chai = require("chai");
const assert = require("assert");
const httpMocks = require("node-mocks-http");
const utilRoute = require("../routes/util");

describe("#UtilRouter", () => {
  describe("#root", () => {
    it("should return 'util' for GET /", () => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/",
      });
      const mockResponse = httpMocks.createResponse();
      utilRoute(mockRequest, mockResponse);
      const actualResponseBody = mockResponse._getData();
      const expectedResponseBody = {
        status: "util",
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });
  /*
  describe("#ValidateAddress", () => {
    it("should GET /validateAddress/:address", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/validateAddress/bitcoincash:qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      utilRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, ['isvalid', 'address', 'scriptPubKey', 'ismine', 'iswatchonly', 'isscript']);
        done();
      });
    });
  });
*/
});
