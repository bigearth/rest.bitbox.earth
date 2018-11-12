/*
  BLOCKED. See GitHub Issue #104:
  https://github.com/Bitcoin-com/rest.bitcoin.com/issues/104

*/

"use strict"

const blockRoute = require("../../dist/routes/v2/block")
const chai = require("chai")
const assert = chai.assert
const nock = require("nock") // HTTP mocking

let originalUrl // Used during transition from integration to unit tests.

// Mocking data.
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/block-mock")

// Used for debugging.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

describe("#BlockRouter", () => {
  let req, res

  before(() => {
    originalUrl = process.env.BITCOINCOM_BASEURL

    // Set default environment variables for unit tests.
    if (!process.env.TEST) process.env.TEST = "unit"
    if (process.env.TEST === "unit")
      process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"
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
    // Restore the original environment variables.
    process.env.BITCOINCOM_BASEURL = originalUrl
  })

  describe("#root", () => {
    // root route handler.
    const root = blockRoute.testableComponents.root

    it("should respond to GET for base route", async () => {
      const result = root(req, res)

      assert.equal(result.status, "block", "Returns static string")
    })
  })

  describe("Block Details By Hash", () => {
    const detailsByHash = blockRoute.testableComponents.detailsByHash

    it("should throw an error for an empty hash", async () => {
      req.params.hash = ""

      const result = await detailsByHash(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "hash must not be empty",
        "Proper error message"
      )
    })

    it("should throw 500 when network issues", async () => {
      // Save the existing RPC URL.
      const savedUrl = process.env.BITCOINCOM_BASEURL

      // Manipulate the URL to cause a 500 network error.
      process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"

      req.params.hash = "abc123"
      const result = await detailsByHash(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      // Restore the saved URL.
      process.env.BITCOINCOM_BASEURL = savedUrl

      assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
      assert.include(result.error, "ENOTFOUND", "Error message expected")
    })

    it("should throw an error for invalid hash", async () => {
      req.params.hash = "abc123"

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/block/${req.params.hash}`)
          .reply(404, { statusText: "Not Found" })
      }

      const result = await detailsByHash(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.equal(res.statusCode, 404, "HTTP status code 404 expected.")
      assert.include(result.error, "Not Found", "Proper error message")
    })
  })

  /*
  describe("#BlockDetails", () => {
    // block route handler.
    const detailsByHash = blockRoute.testableComponents.detailsByHash

    it("should GET /details/:id height", async () => {
      req.params.hash = 500000

      const result = await detailsByHash(req, res)
      console.log(`result: ${util.inspect(result)}`)


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
  */

  /*
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
