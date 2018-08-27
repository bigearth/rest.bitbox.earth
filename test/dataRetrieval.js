let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let dataRetrieval = require('../routes/dataRetrieval');

describe("#dataRetrievalRouter", () => {
  describe("#root", () => {
    it("should return 'dataRetrieval' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      dataRetrieval(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'dataRetrieval'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#balancesForAddress", () => {
    it("should GET /balancesForAddress/:address", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/balancesForAddress/bchtest:qpz7eljx2cs683r7c34nl8k6clchqewaagncvdxa2f"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData())[1];
        assert.deepEqual(actualResponseBody, {
          "propertyid": 127,
          "balance": "90.0",
          "reserved": "0.0"
        });
        done();
      });
    });
  });

  describe("#balancesForId", () => {
    it("should GET /balancesForId/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/balancesForId/127"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData())[0];
        assert.deepEqual(actualResponseBody, {
          address: 'bchtest:qp6luqzaddprw2rdw2y0e2gq9ywf4juj4sa2xx0ljv',
          balance: '10.0',
          reserved: '0.0'
        });
        done();
      });
    });
  });

  describe("#balanceAddressAndPropertyId", () => {
    it("should GET /balance/:address/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/balance/bchtest:qp6luqzaddprw2rdw2y0e2gq9ywf4juj4sa2xx0ljv/127"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.deepEqual(actualResponseBody, { balance: '10.0', reserved: '0.0' });
        done();
      });
    });
  });

  describe("#balancesHash", () => {
    it("should GET /balancesHash/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/balancesHash/127"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'block', 'blockhash', 'propertyid', 'balanceshash' ]);
        done();
      });
    });
  });

  describe("#crowdSale", () => {
    it("should GET /crowdSale/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/crowdSale/127"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'propertyid', 'name', 'active', 'issuer', 'propertyiddesired', 'precision', 'tokensperunit', 'earlybonus', 'starttime', 'deadline', 'amountraised', 'tokensissued', 'addedissuertokens' ]);
        done();
      });
    });
  });

  describe("#currentConsensusHash", () => {
    it("should GET /currentConsensusHash", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/currentConsensusHash"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'block', 'blockhash', 'consensushash' ]);
        done();
      });
    });
  });

  describe("#grants", () => {
    it("should GET /grants/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/grants/3"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'propertyid', 'name', 'issuer', 'creationtxid', 'totaltokens', 'issuances' ]);
        done();
      });
    });
  });

  describe("#info", () => {
    it("should GET /info", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/info"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'wormholeversion_int', 'wormholeversion', 'bitcoincoreversion', 'block', 'blocktime', 'blocktransactions', 'totaltrades', 'totaltransactions', 'alerts' ]);
        done();
      });
    });
  });

  describe("#payload", () => {
    it("should GET /payload/:txid", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/payload/ac2df919be43fa793ff4955019195481878e0f0cab39834ad911124fdacfc603"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'payload', 'payloadsize'  ]);
        done();
      });
    });
  });

  describe("#property", () => {
    it("should GET /property/:propertyId", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/property/127"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'propertyid', 'name', 'category', 'subcategory', 'data', 'url', 'precision', 'issuer', 'creationtxid', 'fixedissuance', 'managedissuance', 'totaltokens' ]);
        done();
      });
    });
  });

  describe("#seedBlocks", () => {
    it("should GET /seedBlocks/:startBlock/:endBlock", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/seedBlocks/290000/300000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ ]);
        done();
      });
    });
  });

  describe("#STO", () => {
    it("should GET /STO/:txid", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/STO/ac2df919be43fa793ff4955019195481878e0f0cab39834ad911124fdacfc603/*"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'txid', 'fee', 'sendingaddress', 'ismine', 'version', 'type_int', 'type', 'propertyid', 'precision', 'ecosystem', 'category', 'subcategory', 'propertyname', 'data', 'url', 'amount', 'valid', 'blockhash', 'blocktime', 'positioninblock', 'block', 'confirmations' ]);
        done();
      });
    });
  });

  describe("#transaction", () => {
    it("should GET /transaction/:txid", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/transaction/ac2df919be43fa793ff4955019195481878e0f0cab39834ad911124fdacfc603"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'txid', 'fee', 'sendingaddress', 'ismine', 'version', 'type_int', 'type', 'propertyid', 'precision', 'ecosystem', 'category', 'subcategory', 'propertyname', 'data', 'url', 'amount', 'valid', 'blockhash', 'blocktime', 'positioninblock', 'block', 'confirmations' ]);
        done();
      });
    });
  });

  describe("#blockTransactions", () => {
    it("should GET /blockTransactions/:index", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/blockTransactions/279007"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ ]);
        done();
      });
    });
  });

  describe("#pendingTransactions", () => {
    it("should GET /pendingTransactions", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/pendingTransactions"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ ]);
        done();
      });
    });
  });

  describe("#properties", () => {
    it("should GET /properties", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/properties"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      dataRetrieval(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        assert.deepEqual(actualResponseBody, [ 'propertyid', 'name', 'category', 'subcategory', 'data', 'url', 'precision' ]);
        done();
      });
    });
  });
});
