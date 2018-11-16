/*


*/

"use strict"

const blockRoute = require("../../dist/routes/v2/block")
const chai = require("chai")
const assert = chai.assert
const nock = require("nock") // HTTP mocking

let originalEnvVars // Used during transition from integration to unit tests.

// Mocking data.
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/block-mock")

// Used for debugging.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

describe("#BlockRouter", () => {
  let req, res

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

    // Explicitly reset the parmas and body.
    req.params = {}
    req.body = {}

    // Activate nock if it's inactive.
    if (!nock.isActive()) nock.activate()
  })

  afterEach(() => {
    // Clean up HTTP mocks.
    nock.cleanAll() // clear interceptor list.
    nock.restore()
  })

  after(() => {
    // Restore any pre-existing environment variables.
    process.env.BITCOINCOM_BASEURL = originalEnvVars.BITCOINCOM_BASEURL
    process.env.RPC_BASEURL = originalEnvVars.RPC_BASEURL
    process.env.RPC_USERNAME = originalEnvVars.RPC_USERNAME
    process.env.RPC_PASSWORD = originalEnvVars.RPC_PASSWORD
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

    it("should GET /detailsByHash/:hash", async () => {
      req.params.hash =
        "00000000000000645dec6503d3f5eafb0d2537a7a28f181d721dec7c44154c79"

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/block/${req.params.hash}`)
          .reply(200, mockData.mockBlockDetails)
      }

      const result = await detailsByHash(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAnyKeys(result, [
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
      assert.isArray(result.tx)
    })
  })

  describe("Block Details By Height", () => {
    // block route handler.
    const detailsByHeight = blockRoute.testableComponents.detailsByHeight

    it("should throw an error for an empty height", async () => {
      req.params.height = ""

      const result = await detailsByHeight(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "height must not be empty",
        "Proper error message"
      )
    })

    it("should throw 500 when network issues", async () => {
      // Save the existing RPC URL.
      const savedUrl = process.env.BITCOINCOM_BASEURL
      const savedUrl2 = process.env.RPC_BASEURL

      // Manipulate the URL to cause a 500 network error.
      process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"
      process.env.RPC_BASEURL = "http://fakeurl/api/"

      req.params.height = "abc123"
      const result = await detailsByHeight(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      // Restore the saved URL.
      process.env.BITCOINCOM_BASEURL = savedUrl
      process.env.RPC_BASEURL = savedUrl2

      assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
      assert.include(result.error, "ENOTFOUND", "Error message expected")
    })

    it("should throw an error for invalid height", async () => {
      req.params.height = "abc123"

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/block/${req.params.hash}`)
          .reply(404, { statusText: "Not Found" })
      }

      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(500, { statusText: "Request failed" })
      }

      const result = await detailsByHeight(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
      assert.include(result.error, "Request failed", "Proper error message")
    })

    it("should GET /detailsByHeight/:height", async () => {
      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(200, { result: mockData.mockBlockHash })
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(
            `/block/00000000000000645dec6503d3f5eafb0d2537a7a28f181d721dec7c44154c79`
          )
          .reply(200, mockData.mockBlockDetails)
      }

      req.params.height = 500000

      const result = await detailsByHeight(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAnyKeys(result, [
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
      assert.isArray(result.tx)
    })
  })
})
