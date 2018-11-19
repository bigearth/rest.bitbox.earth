/*
  BLOCKED. See GitHub Issue #104:
  https://github.com/Bitcoin-com/rest.bitcoin.com/issues/104

*/

"use strict"

//const chai = require("chai");
const assert = require("assert")
const httpMocks = require("node-mocks-http")
const panda = require("./helpers/panda")
//process.env.RPC_BASEURL = "http://localhost:48332/"
const blockchainRoute = require("../../dist/routes/v2/blockchain")
/*
describe("#BlockchainRouter", () => {
  // local node will be started in regtest mode on the port 48332
  before(panda.runLocalNode)
  after(() => {
    // otherwise the panda will run forever
    process.exit()
  })

  describe("#root", () => {
    it("should return 'blockchain' for GET /", () => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      })

      const mockResponse = httpMocks.createResponse()

      blockchainRoute(mockRequest, mockResponse)

      const actualResponseBody = mockResponse._getData()
      const expectedResponseBody = {
        status: "blockchain"
      }

      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody)
    })
  })

  describe("#BlockchainGetBlockchainInfo", () => {
    it("should GET /getBlockchainInfo ", done => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockchainInfo"
      })

      const mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      })

      blockchainRoute(mockRequest, mockResponse)

      mockResponse.on("end", () => {
        const actualResponseBody = Object.keys(
          JSON.parse(mockResponse._getData())
        )

        assert.deepEqual(actualResponseBody, [
          "chain",
          "blocks",
          "headers",
          "bestblockhash",
          "difficulty",
          "mediantime",
          "verificationprogress",
          "chainwork",
          "pruned",
          "softforks",
          "bip9_softforks",
          "pruneheight"
        ])

        return done()
      })
    })
  })
})
*/
