let chai = require('chai');
let assert = require('assert');
let expect = chai.expect;
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
});
