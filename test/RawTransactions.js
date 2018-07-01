let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let rawTransactionsRoute = require('../routes/rawtransactions');

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

  describe("#GetRawTransaction", () => {
    it("should GET /getRawTransaction/:txid", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
          url: "/getRawTransaction/0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      rawTransactionsRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000');
        done();
      });
    });
  });

  describe("#SendRawTransaction", () => {
    it("should POST /sendRawTransaction/:hex single tx hex", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
          url: "/sendRawTransaction/01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      rawTransactionsRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = mockResponse._getData();
        assert.equal(actualResponseBody, 'transaction already in block chain');
        done();
      });
    });

    it("should POST /sendRawTransaction/:hex array", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: '/sendRawTransaction/["0200000001cbfff7cb0a69c2740548d784c4a611456a4699ebd685a924b02d1c75b4f8d8f0000000006a47304402201a3577d3dbb385feb73ba0a34688b9878e65e10c03f8f37f4d02ed578d087b7b02207b269e53b0d7a93e881778a8769373dd26477651a7a978cfe45d84e96ca2185c4121031eb1c9c8ac2a65fb9939895dfb03b6b053dc8135011c2ddde85f6ce6e2764678ffffffff026b1a0000000000001976a9144bdc84d51cda8a66212fbb7f2efa38265c1b077588ac6b1a0000000000001976a914ca766fbabd09e5236bceffed47c2b761284aade688ac00000000", "020000000176854447f9bed3101f1630e79a1d1016799e2ee2cc46aae6d8fd899188a1604e000000006a47304402207d0427204b7b850c000e345da323567a3a6d1dd95f63059376213994e9e5feba02200d9fe81b24175f339fd018c0e0e8c77f457f1e17afa03049399d217870a6194c4121031eb1c9c8ac2a65fb9939895dfb03b6b053dc8135011c2ddde85f6ce6e2764678ffffffff02671a0000000000001976a9144bdc84d51cda8a66212fbb7f2efa38265c1b077588ac671a0000000000001976a914ca766fbabd09e5236bceffed47c2b761284aade688ac00000000"]'
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      rawTransactionsRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData())[0];
        assert.equal(actualResponseBody, 'transaction already in block chain');
        done();
      });
    });
  });
});
