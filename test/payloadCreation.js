"use strict";
const chai = require("chai");
const assert = require("assert");
const httpMocks = require("node-mocks-http");
const payloadCreation = require("../routes/payloadCreation");

describe("#payloadCreationRouter", () => {
  describe("#root", () => {
    it("should return 'payloadCreation' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      payloadCreation(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: "payloadCreation"
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#burnBCH", () => {
    it("should GET /burnBCH", done => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/burnBCH"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        console.log(mockResponse._getData());
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "00000044");
        done();
      });
    });
  });

  describe("#changeIssuer", () => {
    it("should POST /changeIssuer/:propertyId", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/changeIssuer/3"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "0000004600000003");
        done();
      });
    });
  });

  describe("#closeCrowdSale", () => {
    it("should POST /closeCrowdSale/:propertyId", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/closeCrowdSale/70"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "0000003500000046");
        done();
      });
    });
  });

  describe("#grant", () => {
    it("should POST /grant/:propertyId/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/grant/3/7000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "00000037000000030000000000001b5800");
        done();
      });
    });
  });

  describe("#crowdsale", () => {
    it("should POST /crowdsale/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data/:propertyIdDesired/:tokensPerUnit/:deadline/:earlyBonus/:undefine/:totalNumber", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url:
          "/crowdsale/1/1/0/Companies/Bitcoin-Mining/Quantum-Miner/www.example.com/Quantum -Miner-Tokens/1/100/1483228800/30/0/192978657"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(
          actualResponseBody,
          "0000003301000100000000436f6d70616e69657300426974636f696e2d4d696e696e67005175616e74756d2d4d696e6572007777772e6578616d706c652e636f6d005175616e74756d202d4d696e65722d546f6b656e73000000000100000002540be40000000000586846801e0000000000730634ca"
        );
        done();
      });
    });
  });

  describe("#fixed", () => {
    it("should POST /fixed/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url:
          "/fixed/1/1/0/Companies/Bitcoin-Mining/Quantum-Miner/www.example.com/Quantum-Miner-Tokens/1000000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(
          actualResponseBody,
          "0000003201000100000000436f6d70616e69657300426974636f696e2d4d696e696e67005175616e74756d2d4d696e6572007777772e6578616d706c652e636f6d005175616e74756d2d4d696e65722d546f6b656e73000000000000989680"
        );
        done();
      });
    });
  });

  describe("#managed", () => {
    it("should POST /managed/:ecosystem/:propertyPrecision/:previousId/:category/:subcategory/:name/:url/:data", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url:
          "/managed/1/1/0/Companies/Bitcoin-Mining/Quantum-Miner/www.example.com/Quantum-Miner-Tokens"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(
          actualResponseBody,
          "0000003601000100000000436f6d70616e69657300426974636f696e2d4d696e696e67005175616e74756d2d4d696e6572007777772e6578616d706c652e636f6d005175616e74756d2d4d696e65722d546f6b656e7300"
        );
        done();
      });
    });
  });

  describe("#participateCrowdSale", () => {
    it("should POST /participateCrowdSale/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/participateCrowdSale/100.0"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "000000010000000100000002540be400");
        done();
      });
    });
  });

  describe("#revoke", () => {
    it("should POST /revoke/:propertyId/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/revoke/3/100"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "0000003800000003000000000000006400");
        done();
      });
    });
  });

  describe("#sendAll", () => {
    it("should POST /sendAll/:ecosystem", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/sendAll/2"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "0000000402");
        done();
      });
    });
  });

  describe("#simpleSend", () => {
    it("should POST /simpleSend/:propertyId/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/simpleSend/1/100.0"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "000000000000000100000002540be400");
        done();
      });
    });
  });

  describe("#STO", () => {
    it("should POST /STO/:propertyId/:amount", done => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/STO/3/5000"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require("events").EventEmitter
      });
      payloadCreation(mockRequest, mockResponse);

      mockResponse.on("end", () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(
          actualResponseBody,
          "0000000300000003000000000000138800000003"
        );
        done();
      });
    });
  });
});
