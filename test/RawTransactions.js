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
  //
  //   it("should POST /sendRawTransaction/:hex array", (done) => {
  //     let hex1 = '020000000148735fcdac94c51459f7d8f787cf363c618125bc0f9092092ed2ebccd0f5557e0000000069463043021f4e3dd1fadb3e8fabdbd94b125d7e97932f72bb08118407e49cf505e7f5f63b022062eee3c5d94b4bc6b68ab0018876e9661b257f1e8487173876faccf7d3a2220541210313299e9ec7a9e62789094b850ab6f71df7c39af7c03568027c24d0bc9eda930dffffffff017b140000000000001976a914e11ed7fd6416d8f5c58a1cb3e1b0005c3cab092f88ac00000000';
  //     let hex2 = '0200000001a1b5849a5026642d5e28abdb4e98aa483adc20daab44c39e2f41acf72aa8c845000000006b483045022100994ab28c7df64852057c3ab965148ef2b5456233c12774087e88a62bbc27d4230220504d1096ac52915d32d2356ba5ae82f202543b88c24b4643800919e85da333984121039c48c06ce551810a2eeedf516c77995a922ca65c4e9e9a0a07288a6fae149eb2ffffffff013b1e0000000000001976a9140377597dd75d41398259c36d05a5a68ba0af782d88ac00000000';
  //     let arr = [hex1, hex2];
  //     let mockRequest = httpMocks.createRequest({
  //       method: "POST",
  //       url: '/sendRawTransaction/' + arr
  //     });
  //     let mockResponse = httpMocks.createResponse({
  //       eventEmitter: require('events').EventEmitter
  //     });
  //     rawTransactionsRoute(mockRequest, mockResponse);
  //
  //     mockResponse.on('end', () => {
  //       let actualResponseBody = mockResponse._getData();
  //       assert.equal(actualResponseBody, 'transaction already in block chain');
  //       done();
  //     });
  //   });
// });
});
