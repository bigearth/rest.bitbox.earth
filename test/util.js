let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let utilRoute = require('../routes/util');

describe("#UtilRouter", () => {
  describe("#root", () => {
    it("should return 'util' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      utilRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'util'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

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
});
