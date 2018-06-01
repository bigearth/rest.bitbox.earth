let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let healthCheckRoute = require('../routes/health-check');

describe("#HealthCheckRouter", () => {
  describe("#root", () => {
    it("should return 'winnging' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      healthCheckRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'winning'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });
});
