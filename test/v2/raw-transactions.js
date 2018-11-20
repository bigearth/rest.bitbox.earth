/*
  TESTS FOR THE RAWTRANSACTIONS.TS LIBRARY

  This test file uses the environment variable TEST to switch between unit
  and integration tests. By default, TEST is set to 'unit'. Set this variable
  to 'integration' to run the tests against BCH mainnet.

*/

"use strict"

const chai = require("chai")
const assert = chai.assert
const rawtransactions = require("../../dist/routes/v2/rawtransactions")
const nock = require("nock") // HTTP mocking

let originalEnvVars // Used during transition from integration to unit tests.

// Mocking data.
//delete require.cache[require.resolve("./mocks/express-mocks")] // Fixes bug
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/raw-transactions-mocks")

// Used for debugging.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

describe("#Raw-Transactions", () => {
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

  describe("#root", async () => {
    // root route handler.
    const root = rawtransactions.testableComponents.root

    it("should respond to GET for base route", async () => {
      const result = root(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.equal(result.status, "rawtransactions", "Returns static string")
    })
  })

  describe("decodeRawTransaction()", () => {
    // block route handler.
    const decodeRawTransaction =
      rawtransactions.testableComponents.decodeRawTransaction

    it("should throw error if hex is missing", async () => {
      const result = await decodeRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "hex can not be empty")
    })

    it("should throw 500 when network issues", async () => {
      // Save the existing RPC URL.
      const savedUrl2 = process.env.RPC_BASEURL

      // Manipulate the URL to cause a 500 network error.
      process.env.RPC_BASEURL = "http://fakeurl/api/"

      req.params.hex =
        "0200000001b9b598d7d6d72fc486b2b3a3c03c79b5bade6ec9a77ced850515ab5e64edcc21010000006b483045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd4139041210360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413dffffffff0210270000000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac786e9800000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac00000000"

      const result = await decodeRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      // Restore the saved URL.
      process.env.RPC_BASEURL = savedUrl2

      assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
      assert.include(result.error, "ENOTFOUND", "Error message expected")
    })

    it("should GET /decodeRawTransaction", async () => {
      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(200, { result: mockData.mockDecodeRawTransaction })
      }

      req.params.hex =
        "0200000001b9b598d7d6d72fc486b2b3a3c03c79b5bade6ec9a77ced850515ab5e64edcc21010000006b483045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd4139041210360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413dffffffff0210270000000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac786e9800000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac00000000"

      const result = await decodeRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAnyKeys(result, [
        "txid",
        "hash",
        "size",
        "version",
        "locktime",
        "vin",
        "vout"
      ])
      assert.isArray(result.vin)
      assert.isArray(result.vout)
    })
  })

  describe("decodeScript()", () => {
    // block route handler.
    const decodeScript = rawtransactions.testableComponents.decodeScript

    it("should throw error if hex is missing", async () => {
      const result = await decodeScript(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "hex can not be empty")
    })

    it("should throw 500 when network issues", async () => {
      // Save the existing RPC URL.
      const savedUrl2 = process.env.RPC_BASEURL

      // Manipulate the URL to cause a 500 network error.
      process.env.RPC_BASEURL = "http://fakeurl/api/"

      req.params.hex =
        "0200000001b9b598d7d6d72fc486b2b3a3c03c79b5bade6ec9a77ced850515ab5e64edcc21010000006b483045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd4139041210360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413dffffffff0210270000000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac786e9800000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac00000000"

      const result = await decodeScript(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      // Restore the saved URL.
      process.env.RPC_BASEURL = savedUrl2

      assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
      assert.include(result.error, "ENOTFOUND", "Error message expected")
    })

    it("should GET /decodeScript", async () => {
      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(200, { result: mockData.mockDecodeScript })
      }

      req.params.hex =
        "0200000001b9b598d7d6d72fc486b2b3a3c03c79b5bade6ec9a77ced850515ab5e64edcc21010000006b483045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd4139041210360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413dffffffff0210270000000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac786e9800000000001976a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac00000000"

      const result = await decodeScript(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["asm", "type", "p2sh"])
    })
  })

  describe("getRawTransaction()", () => {
    // block route handler.
    const getRawTransaction =
      rawtransactions.testableComponents.getRawTransaction

    it("should throw 400 error if txids array is missing", async () => {
      const result = await getRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "txids must be an array")
    })

    it("should throw 400 error if txids is too large", async () => {
      const testArray = []
      for (var i = 0; i < 25; i++) testArray.push("")

      req.body.txids = testArray

      const result = await getRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "Array too large. Max 20 txids")
    })

    it("should throw 400 error if txid is empty", async () => {
      req.body.txids = [""]

      const result = await getRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "Encountered empty TXID")
    })

    it("should throw 500 error if txid is invalid", async () => {
      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(500, { result: "Error: Request failed with status code 500" })
      }

      req.body.txids = ["abc123"]

      const result = await getRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.hasAllKeys(result, ["error"])
      assert.include(result.error, "Request failed with status code 500")
    })

    it("should get non-verbose transaction data", async () => {
      // Mock the RPC call for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.RPC_BASEURL}`)
          .post(``)
          .reply(500, { result: "Error: Request failed with status code 500" })
      }

      req.body.txids = [
        "bd320377db7026a3dd5c7ec444596c0ee18fc25c4f34ee944adc03e432ce1971"
      ]

      const result = await getRawTransaction(req, res)
      //console.log(`result: ${util.inspect(result)}`)
    })
  })
})
