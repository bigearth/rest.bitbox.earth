/*

*/

"use strict"

//const chai = require("chai");
//const assert = require("assert")
//const httpMocks = require("node-mocks-http")
//const panda = require("./helpers/panda")
//process.env.RPC_BASEURL = "http://localhost:48332/"

const chai = require("chai")
const assert = chai.assert
const nock = require("nock") // HTTP mocking
const blockchainRoute = require("../../dist/routes/v2/blockchain")

// Mocking data.
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/blockchain-mock")

let originalEnvVars // Used during transition from integration to unit tests.

describe("#BlockchainRouter", () => {
  let req, res

  // local node will be started in regtest mode on the port 48332
  //before(panda.runLocalNode)

  before(() => {
    // Save existing environment variables.
    originalEnvVars = {
      BITCOINCOM_BASEURL: process.env.BITCOINCOM_BASEURL,
      RPC_BASEURL: process.env.RPC_BASEURL,
      RPC_USERNAME: process.env.RPC_USERNAME,
      RPC_PASSWORD: process.env.RPC_PASSWORD
    }

    // Set default environment variables for unit tests.
    if (!process.env.TEST) process.env.TEST = "unit"
    if (process.env.TEST === "unit") {
      process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"
      process.env.RPC_BASEURL = "http://fakeurl/api"
      process.env.RPC_USERNAME = "fakeusername"
      process.env.RPC_PASSWORD = "fakepassword"
    }
  })

  // Setup the mocks before each test.
  beforeEach(() => {
    // Mock the req and res objects used by Express routes.
    req = mockReq
    res = mockRes

    // Activate nock if it's inactive.
    if (!nock.isActive()) nock.activate()
  })

  afterEach(() => {
    // Clean up HTTP mocks.
    nock.cleanAll() // clear interceptor list.
    nock.restore()
  })

  after(() => {
    // otherwise the panda will run forever
    //process.exit()

    // Restore any pre-existing environment variables.
    process.env.BITCOINCOM_BASEURL = originalEnvVars.BITCOINCOM_BASEURL
    process.env.RPC_BASEURL = originalEnvVars.RPC_BASEURL
    process.env.RPC_USERNAME = originalEnvVars.RPC_USERNAME
    process.env.RPC_PASSWORD = originalEnvVars.RPC_PASSWORD
  })

  describe("#root", () => {
    // root route handler.
    const root = blockchainRoute.testableComponents.root

    it("should respond to GET for base route", async () => {
      const result = root(req, res)

      assert.equal(result.status, "blockchain", "Returns static string")
    })
  })

  /*

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
  */
})
