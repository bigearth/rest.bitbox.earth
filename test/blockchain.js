let chai = require('chai');
let assert = require('assert');
let httpMocks = require("node-mocks-http");
let blockchainRoute = require('../routes/blockchain');

describe("#BlockchainRouter", () => {
  describe("#root", () => {
    it("should return 'blockchain' for GET /", () => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/"
      });
      let mockResponse = httpMocks.createResponse();
      blockchainRoute(mockRequest, mockResponse);
      let actualResponseBody = mockResponse._getData();
      let expectedResponseBody = {
        status: 'blockchain'
      };
      assert.deepEqual(JSON.parse(actualResponseBody), expectedResponseBody);
    });
  });

  describe("#BlockchainGetBestBlockHash", () => {
    it("should GET /getBestBlockHash ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBestBlockHash"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody.length, 64);
        done();
      });
    });
  });

  describe("#BlockchainGetBlock", () => {
    it("should GET /getblock/:id", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getblock/00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'hash', 'confirmations', 'size', 'height', 'version', 'versionHex', 'merkleroot', 'tx', 'time', 'mediantime', 'nonce', 'bits', 'difficulty', 'chainwork', 'previousblockhash', 'nextblockhash' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetBlockchainInfo", () => {
    it("should GET /getBlockchainInfo ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockchainInfo"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'chain', 'blocks', 'headers', 'bestblockhash', 'difficulty', 'mediantime', 'verificationprogress', 'chainwork', 'pruned', 'softforks', 'bip9_softforks' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetBlockCount", () => {
    it("should GET /getBlockCount ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockCount"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = parseInt(mockResponse._getData());
        assert.equal(typeof actualResponseBody, "number");
        done();
      });
    });
  });

  describe("#BlockchainGetBlockHash", () => {
    it("should GET /getBlockHash/:height ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockhash/532646"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        assert.equal(actualResponseBody, "00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc");
        done();
      });
    });
  });

  describe("#BlockchainGetBlockHeader", () => {
    it("should GET /getBlockHeader/:hash ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getBlockHeader/00000000000000000182bf5782f3d43b1a8fceccb50253eb61e58cba7b240edc"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        // console.log(actualResponseBody);
        assert.deepEqual(actualResponseBody, [ 'hash', 'confirmations', 'height', 'version', 'versionHex', 'merkleroot', 'time', 'mediantime', 'nonce', 'bits', 'difficulty', 'chainwork', 'previousblockhash', 'nextblockhash' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetChainTips", () => {
    it("should GET /getChainTips ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getChainTips"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData())[0]);
        // console.log(actualResponseBody);
        assert.deepEqual(actualResponseBody, [ 'height', 'hash', 'branchlen', 'status' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetDifficulty", () => {
    it("should GET /getDifficulty ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getDifficulty"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = parseFloat(mockResponse._getData());
        assert.equal(typeof actualResponseBody, "number");
        done();
      });
    });
  });

  describe("#BlockchainGetMempoolAncestors", () => {
    it("should GET /getMempoolAncestors/:txid ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMempoolAncestors/53735a4ddb828825d6e3f52d045f4c151b2b3d51d631bc581e62f31184b151d6"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: create a tx send it to mempool. Then spend the utxo in another tx and call that enpoind w/ the 2nd txid.
        assert.equal(actualResponseBody, "\"Transaction not in mempool\"");
        done();
      });
    });
  });

  describe("#BlockchainGetMempoolDescendants", () => {
    it("should GET /getMempoolDescendants/:txid ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMempoolDescendants/53735a4ddb828825d6e3f52d045f4c151b2b3d51d631bc581e62f31184b151d6"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: create a tx send it to mempool. Then spend the utxo in another tx and call that enpoind w/ the 2nd txid.
        assert.equal(actualResponseBody, "\"Transaction not in mempool\"");
        done();
      });
    });
  });

  describe("#BlockchainGetMempoolEntry", () => {
    it("should GET /getMempoolEntry/:txid ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMempoolEntry/53735a4ddb828825d6e3f52d045f4c151b2b3d51d631bc581e62f31184b151d6"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: create a tx send it to mempool. Then spend the utxo in another tx and call that enpoind w/ the 2nd txid.
        assert.equal(actualResponseBody, "\"Transaction not in mempool\"");
        done();
      });
    });
  });

  describe("#BlockchainGetMempoolInfo", () => {
    it("should GET /getMempoolInfo ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getMempoolInfo"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'size', 'bytes', 'usage', 'maxmempool', 'mempoolminfee' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetRawMempool", () => {
    it("should GET /getRawMempool ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getRawMempool"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: Only checks to see if mempool is greater than 1. Perhaps a more accurate test later?
        assert(actualResponseBody.length > 1 );
        done();
      });
    });
  });

  describe("#BlockchainGetTxOut", () => {
    it("should GET /getTxOut/:txid/:n ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getTxOut/53735a4ddb828825d6e3f52d045f4c151b2b3d51d631bc581e62f31184b151d6/1"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = Object.keys(JSON.parse(mockResponse._getData()));
        assert.deepEqual(actualResponseBody, [ 'bestblock', 'confirmations', 'value', 'scriptPubKey', 'coinbase' ]);
        done();
      });
    });
  });

  describe("#BlockchainGetTxOutProof", () => {
    it("should GET /getTxOutProof/:txid ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/getTxOutProof/53735a4ddb828825d6e3f52d045f4c151b2b3d51d631bc581e62f31184b151d6"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // TODO: just comparing it with a string it gets back and not actual data. See line below
        assert.equal(actualResponseBody, "\"JSON value is not an array as expected\"");
        done();
      });
    });
  });

  describe("#BlockchainPruneBlockchain", () => {
    it("should POST /pruneBlockchain/:height ", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/pruneBlockchain/530384"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // console.log(actualResponseBody)
        // TODO: just comparing it with a string it gets back and not actual data. See line below
        assert.equal(actualResponseBody, "\"Cannot prune blocks because node is not in prune mode.\"" );
        done();
      });
    });
  });

  describe("#BlockchainVerifyChain", () => {
    it("should GET /verifyChain", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/verifyChain"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // console.log(actualResponseBody)
        // TODO: just comparing it with a string it gets back and not actual data. See line below
        assert.equal(actualResponseBody, true);
        done();
      });
    });
  });

  describe("#BlockchainVerifyTxOutProof", () => {
    it("should GET /verifyTxOutProof/:proof", (done) => {
      let mockRequest = httpMocks.createRequest({
        method: "GET",
        url: "/verifyTxOutProof/6C6C6C6C6C6C6C"
      });
      let mockResponse = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      blockchainRoute(mockRequest, mockResponse);

      mockResponse.on('end', () => {
        let actualResponseBody = JSON.parse(mockResponse._getData());
        // console.log(actualResponseBody)
        // TODO: Not a proper input given. Needs a real hexidecimal string.
        assert.equal(actualResponseBody, "\"CDataStream::read(): end of data: iostream error\"");
        done();
      });
    });
  });
});
