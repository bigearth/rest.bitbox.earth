let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let rawTransactionsRoute = require('../routes/rawTransactions');

describe("#RawTransactionsRouter", () => {
  describe("#root", () => {
    it("should return 'rawtransactions' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      rawTransactionsRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'rawtransactions'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#DecodeRawTransaction", () => {
    it("should GET /decodeRawTransaction/:hex", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
          url: "/decodeRawTransaction/0200000001d0ba1330194111747e0b1784ab62126871c87acad3b6dc3a339b261ad974e940010000006b483045022100a284b4ac5ed55ac0e2baa02b6bdabbf06f98d2bf6b3fdcea1aea50f55766afd002206181c8e60f738116ba6e16177f3d408e8da2c463c69b27c2531fab84b63a63b24121022d426ef365d6480b127b4980afa4b9415cad5e6f0a9e11b1536d3523597197f3ffffffff02011d0000000000001976a91479d3297d1823149f4ec61df31d19f2fad5390c0288ac0000000000000000116a0f23424348466f7245766572796f6e6500000000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      rawTransactionsRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'txid', 'hash', 'size', 'version', 'locktime', 'vin', 'vout' ]);
        done();
      });
    });
  });

  describe("#DecodeScript", () => {
    it("should GET /decodeScript/:script", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
          url: "/decodeScript/4830450221009a51e00ec3524a7389592bc27bea4af5104a59510f5f0cfafa64bbd5c164ca2e02206c2a8bbb47eabdeed52f17d7df668d521600286406930426e3a9415fe10ed592012102e6e1423f7abde8b70bca3e78a7d030e5efabd3eb35c19302542b5fe7879c1a16"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      rawTransactionsRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'asm', 'type', 'p2sh' ]);
        done();
      });
    });
  });
});
