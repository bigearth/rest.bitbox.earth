let chai = require('chai');
let assert = require('assert');
let expect = chai.expect;
let httpMocks = require("node-mocks-http");
let generatingRoute = require('../routes/generating');

describe("#GeneratingRouter", () => {
  describe("#root", () => {
    it("should return 'generating' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      generatingRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'generating'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });
//
//   describe("#GeneratingGenerateToAddress", () => {
//     it("should POST /generateToAddress/:n/:address ", (done) => {
//       let mockRequest = httpMocks.createRequest({
//         method: "POST",
//         url: "/generateToAddress/1/qrff52mj0ml4scljzxrex7ses2gst42k9sfz2lftjq"
//       });
//       let mockResponse = httpMocks.createResponse({
//         eventEmitter: require('events').EventEmitter
//       });
//       generatingRoute(mockRequest, mockResponse);
//
//       mockResponse.on('end', () => {
//         let actualResponseBody = mockResponse._getData();
//         assert.equal(actualResponseBody, "JSON value is not an integer as expected");
//         done();
//       });
//     });
//   });
});
