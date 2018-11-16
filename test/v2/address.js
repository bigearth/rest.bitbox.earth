/*
  TESTS FOR THE ADDRESS.JS LIBRARY

  This test file uses the environment variable TEST to switch between unit
  and integration tests. By default, TEST is set to 'unit'. Set this variable
  to 'integration' to run the tests against BCH mainnet.

  To-Do:
  -/details/:address
  --Verify to/from query options work correctly.
  -/unconfirmed/:address
  --Should initiate a transfer of BCH to verify unconfirmed TX.
  ---This would be more of an e2e test.
*/

"use strict"

const chai = require("chai")
const assert = chai.assert
const addressRoute = require("../../dist/routes/v2/address")
const nock = require("nock") // HTTP mocking

let originalUrl // Used during transition from integration to unit tests.

// Mocking data.
const { mockReq, mockRes } = require("./mocks/express-mocks")
const mockData = require("./mocks/address-mock")

// Used for debugging.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

describe("#AddressRouter", () => {
  let req, res

  before(() => {
    originalUrl = process.env.BITCOINCOM_BASEURL

    // Set default environment variables for unit tests.
    if (!process.env.TEST) process.env.TEST = "unit"
    if (process.env.TEST === "unit")
      process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"

    console.log(`Testing type is: ${process.env.TEST}`)
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
    process.env.BITCOINCOM_BASEURL = originalUrl
  })

  describe("#root", () => {
    // root route handler.
    const root = addressRoute.testableComponents.root

    it("should respond to GET for base route", async () => {
      const result = root(req, res)

      assert.equal(result.status, "address", "Returns static string")
    })
  })

  describe("#AddressDetails", () => {
    // details route handler.
    const details = addressRoute.testableComponents.details

    it("should throw an error for an empty body", async () => {
      req.body = {}

      const result = await details(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should error on non-array single address", async () => {
      req.body = {
        address: `qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`
      }

      const result = await details(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should throw an error for an invalid address", async () => {
      req.body = {
        addresses: [`02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
      }

      const result = await details(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "Invalid BCH address",
        "Proper error message"
      )
    })

    it("should detect a network mismatch", async () => {
      req.body = {
        addresses: [`bitcoincash:qqqvv56zepke5k0xeaehlmjtmkv9ly2uzgkxpajdx3`]
      }

      const result = await details(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(result.error, "Invalid network", "Proper error message")
    })

    it("should throw 500 when network issues", async () => {
      const savedUrl = process.env.BITCOINCOM_BASEURL

      try {
        req.body = {
          addresses: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
        }

        // Switch the Insight URL to something that will error out.
        process.env.BITCOINCOM_BASEURL = "http://fakeurl/api/"

        const result = await details(req, res)

        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl

        assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
        assert.include(result.error, "ENOTFOUND", "Error message expected")
      } catch (err) {
        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl
      }
    })

    it("should get details for a single address", async () => {
      req.body = {
        addresses: [`bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz`)
          .reply(200, mockData.mockAddressDetails)
      }

      // Call the details API.
      const result = await details(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      // Assert that required fields exist in the returned object.
      assert.equal(result.length, 1, "Array with one entry")
      assert.exists(result[0].addrStr)
      assert.exists(result[0].balance)
      assert.exists(result[0].balanceSat)
      assert.exists(result[0].totalReceived)
      assert.exists(result[0].totalReceivedSat)
      assert.exists(result[0].totalSent)
      assert.exists(result[0].totalSentSat)
      assert.exists(result[0].unconfirmedBalance)
      assert.exists(result[0].unconfirmedBalanceSat)
      assert.exists(result[0].unconfirmedTxApperances)
      assert.exists(result[0].txApperances)
      assert.isArray(result[0].transactions)
      assert.exists(result[0].legacyAddress)
      assert.exists(result[0].cashAddress)
    })

    it("should get details for multiple addresses", async () => {
      req.body = {
        addresses: [
          `bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`,
          `bchtest:qzknfggae0av6yvxk77gmyq7syc67yux6sk80haqyr`
        ]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz`)
          .reply(200, mockData.mockAddressDetails)

        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mwJnEzXzKkveF2q5Af9jxi9j1zrtWAnPU8`)
          .reply(200, mockData.mockAddressDetails)
      }

      // Call the details API.
      const result = await details(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.isArray(result)
      assert.equal(result.length, 2, "2 outputs for 2 inputs")
    })
  })

  describe("#AddressUtxo", () => {
    // utxo route handler.
    const utxo = addressRoute.testableComponents.utxo

    it("should throw an error for an empty body", async () => {
      req.body = {}

      const result = await utxo(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should error on non-array single address", async () => {
      req.body = {
        address: `qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`
      }

      const result = await utxo(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should throw an error for an invalid address", async () => {
      req.body = {
        addresses: [`02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
      }

      const result = await utxo(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "Invalid BCH address",
        "Proper error message"
      )
    })

    it("should detect a network mismatch", async () => {
      req.body = {
        addresses: [`bitcoincash:qqqvv56zepke5k0xeaehlmjtmkv9ly2uzgkxpajdx3`]
      }

      const result = await utxo(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(result.error, "Invalid network", "Proper error message")
    })

    it("should throw 500 when network issues", async () => {
      const savedUrl = process.env.BITCOINCOM_BASEURL

      try {
        req.body = {
          addresses: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
        }

        // Switch the Insight URL to something that will error out.
        process.env.BITCOINCOM_BASEURL = "http://fakeurl/api"

        const result = await utxo(req, res)

        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl

        assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
        assert.include(result.error, "ENOTFOUND", "Error message expected")
      } catch (err) {
        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl
      }
    })

    it("should get utxos for a single address", async () => {
      req.body = {
        addresses: [`bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz/utxo`)
          .reply(200, mockData.mockUtxoDetails)
      }

      // Call the details API.
      const result = await utxo(req, res)

      // Assert that required fields exist in the returned object.
      const firstResult = result[0][0]

      assert.isArray(result[0], "result should be an array")

      // Validate data structure.
      assert.exists(firstResult.address)
      assert.exists(firstResult.txid)
      assert.exists(firstResult.vout)
      assert.exists(firstResult.scriptPubKey)
      assert.exists(firstResult.amount)
      assert.exists(firstResult.satoshis)
      assert.exists(firstResult.height)
      assert.exists(firstResult.confirmations)
    })

    it("should get utxos for mulitple addresses", async () => {
      req.body = {
        addresses: [
          `bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`,
          `bchtest:qzknfggae0av6yvxk77gmyq7syc67yux6sk80haqyr`
        ]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz/utxo`)
          .reply(200, mockData.mockUtxoDetails)

        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mwJnEzXzKkveF2q5Af9jxi9j1zrtWAnPU8/utxo`)
          .reply(200, mockData.mockUtxoDetails)
      }

      // Call the details API.
      const result = await utxo(req, res)

      assert.isArray(result)
      assert.equal(result.length, 2, "2 outputs for 2 inputs")
    })
  })

  describe("#AddressUnconfirmed", () => {
    // unconfirmed route handler.
    const unconfirmed = addressRoute.testableComponents.unconfirmed

    it("should throw an error for an empty body", async () => {
      req.body = {}

      const result = await unconfirmed(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should error on non-array single address", async () => {
      req.body = {
        address: `bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`
      }

      const result = await unconfirmed(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should throw an error for an invalid address", async () => {
      req.body = {
        addresses: [`02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
      }

      const result = await unconfirmed(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "Invalid BCH address",
        "Proper error message"
      )
    })

    it("should detect a network mismatch", async () => {
      req.body = {
        addresses: [`bitcoincash:qqqvv56zepke5k0xeaehlmjtmkv9ly2uzgkxpajdx3`]
      }

      const result = await unconfirmed(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(result.error, "Invalid network", "Proper error message")
    })

    it("should throw 500 when network issues", async () => {
      const savedUrl = process.env.BITCOINCOM_BASEURL

      try {
        req.body = {
          addresses: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
        }

        // Switch the Insight URL to something that will error out.
        process.env.BITCOINCOM_BASEURL = "http://fakeurl/api"

        const result = await unconfirmed(req, res)

        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl

        assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
        assert.include(result.error, "ENOTFOUND", "Error message expected")
      } catch (err) {
        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl
      }
    })

    it("should get unconfirmed data for a single address", async () => {
      req.body = {
        addresses: [`bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz/utxo`)
          .reply(200, mockData.mockUtxoDetails)
      }

      // Call the details API.
      const result = await unconfirmed(req, res)
      //console.log(`result: ${util.inspect(result)}`)

      assert.isArray(result, "result should be an array")

      // Dev note: Unconfirmed TXs are hard to test in an integration test because
      // the nature of an unconfirmed transation is transient. It quickly becomes
      // confirmed and thus should not show up.
    })

    it("should get unconfirmed data for an array of addresses", async () => {
      req.body = {
        addresses: [
          `bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`,
          `bchtest:qzknfggae0av6yvxk77gmyq7syc67yux6sk80haqyr`
        ]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mgps7qxk2Z5ma4mXsviznnet8wx4VvMPFz/utxo`)
          .reply(200, mockData.mockUtxoDetails)

        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(`/addr/mwJnEzXzKkveF2q5Af9jxi9j1zrtWAnPU8/utxo`)
          .reply(200, mockData.mockUtxoDetails)
      }

      // Call the details API.
      const result = await unconfirmed(req, res)

      assert.isArray(result)
    })
  })

  describe("#AddressTransactions", () => {
    // unconfirmed route handler.
    const transactions = addressRoute.testableComponents.transactions

    it("should throw an error for an empty body", async () => {
      req.body = {}

      const result = await transactions(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should error on non-array single address", async () => {
      req.body = {
        address: `qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`
      }

      const result = await transactions(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "addresses needs to be an array",
        "Proper error message"
      )
    })

    it("should throw an error for an invalid address", async () => {
      req.body = {
        addresses: [`02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
      }

      const result = await transactions(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(
        result.error,
        "Invalid BCH address",
        "Proper error message"
      )
    })

    it("should detect a network mismatch", async () => {
      req.body = {
        addresses: [`bitcoincash:qqqvv56zepke5k0xeaehlmjtmkv9ly2uzgkxpajdx3`]
      }

      const result = await transactions(req, res)

      assert.equal(res.statusCode, 400, "HTTP status code 400 expected.")
      assert.include(result.error, "Invalid network", "Proper error message")
    })

    it("should throw 500 when network issues", async () => {
      const savedUrl = process.env.BITCOINCOM_BASEURL

      try {
        req.body = {
          addresses: [`qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`]
        }

        // Switch the Insight URL to something that will error out.
        process.env.BITCOINCOM_BASEURL = "http://fakeurl/api"

        const result = await transactions(req, res)

        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl

        assert.equal(res.statusCode, 500, "HTTP status code 500 expected.")
        assert.include(result.error, "ENOTFOUND", "Error message expected")
      } catch (err) {
        // Restore the saved URL.
        process.env.BITCOINCOM_BASEURL = savedUrl
      }
    })

    it("should get transactions for a single address", async () => {
      req.body = {
        addresses: [`bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(
            `/txs/?address=bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`
          )
          .reply(200, mockData.mockTransactions)
      }

      // Call the details API.
      const result = await transactions(req, res)

      assert.isArray(result, "result should be an array")

      assert.exists(result[0].pagesTotal)
      assert.exists(result[0].txs)
      assert.isArray(result[0].txs)
      assert.exists(result[0].legacyAddress)
      assert.exists(result[0].cashAddress)
    })

    it("should get transactions for an array of addresses", async () => {
      req.body = {
        addresses: [
          `bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`,
          `bchtest:qzknfggae0av6yvxk77gmyq7syc67yux6sk80haqyr`
        ]
      }

      // Mock the Insight URL for unit tests.
      if (process.env.TEST === "unit") {
        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(
            `/txs/?address=bchtest:qq89kjkeqz9mngp8kl3dpmu43y2wztdjqu500gn4c4`
          )
          .reply(200, mockData.mockTransactions)

        nock(`${process.env.BITCOINCOM_BASEURL}`)
          .get(
            `/txs/?address=bchtest:qzknfggae0av6yvxk77gmyq7syc67yux6sk80haqyr`
          )
          .reply(200, mockData.mockTransactions)
      }

      // Call the details API.
      const result = await transactions(req, res)

      assert.isArray(result, "result should be an array")

      assert.equal(result.length, 2, "Array should have 2 elements")
    })
  })
})
