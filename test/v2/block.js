"use strict"

//const chai = require("chai");
//const assert = require("assert")
//const httpMocks = require("node-mocks-http")
const blockRoute = require("../../dist/routes/v2/block")

const chai = require("chai")
const assert = chai.assert
//const addressRoute = require("../../dist/routes/v2/address")
const nock = require("nock") // HTTP mocking

let originalUrl // Used during transition from integration to unit tests.

// Mocking data.
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/block-mock")

// Used for debugging.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

function beforeTests() {
  originalUrl = process.env.BITCOINCOM_BASEURL

  // Set default environment variables for unit tests.
  if (!process.env.TEST) process.env.TEST = "unit"
  if (process.env.TEST === "unit")
    process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"

  console.log(`Testing type is: ${process.env.TEST}`)
}
beforeTests()

describe("#BlockRouter", () => {
  let req, res

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

  //before(() => {})

  after(() => {
    // Restore the original environment variables.
    process.env.BITCOINCOM_BASEURL = originalUrl
  })

  describe("#root", () => {
    // root route handler.
    const root = blockRoute.testableComponents.root

    it("should respond to GET for base route", async () => {
      const result = root(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.equal(result.status, "block", "Returns static string")
    })
  })
  /*
  describe("#BlockDetails", () => {
    it("should GET /details/:id height", done => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/details/549608"
      })
      const mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      })
      blockRoute(mockRequest, mockResponse)
      mockResponse.on("end", () => {
        const actualResponseBody = Object.keys(
          JSON.parse(mockResponse._getData())
        )

        assert.deepEqual(actualResponseBody, [
          "hash",
          "size",
          "height",
          "version",
          "merkleroot",
          "tx",
          "time",
          "nonce",
          "bits",
          "difficulty",
          "chainwork",
          "confirmations",
          "previousblockhash",
          "nextblockhash",
          "reward",
          "isMainChain",
          "poolInfo"
        ])
        done()
      })
    })

    it("should GET /details/:id hash", done => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        url:
          "/details/00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc"
      })
      const mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      })
      blockRoute(mockRequest, mockResponse)

      mockResponse.on("end", () => {
        const actualResponseBody = Object.keys(
          JSON.parse(mockResponse._getData())
        )
        assert.deepEqual(actualResponseBody, [
          "hash",
          "size",
          "height",
          "version",
          "merkleroot",
          "tx",
          "time",
          "nonce",
          "bits",
          "difficulty",
          "chainwork",
          "confirmations",
          "previousblockhash",
          "nextblockhash",
          "reward",
          "isMainChain",
          "poolInfo"
        ])
        done()
      })
    })
  })
  */
})
