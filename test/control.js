let chai = require('chai');
let assert = require('assert');
let expect = chai.expect;
let httpMocks = require("node-mocks-http");
let controlRoute = require('../routes/control');

describe("#ControlRouter", () => {
  describe("#root", () => {
    it("should return 'control' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      controlRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'control'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#ControlGetMemoryInfo", () => {
    it("should GET /getMemoryInfo ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMemoryInfo"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      controlRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        // Just check to make this is an appropriate test. Only deepEquals one result? More keys inside of locked..
        assert.deepEqual(actualResponseBody, [ 'locked' ]);
        done();
      });
    });
  });

});