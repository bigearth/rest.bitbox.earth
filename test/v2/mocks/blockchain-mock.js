/*
  This library contains mocking data for running unit tests on the address route.
*/

"use strict"

const mockBlockHash =
  "00000000000000645dec6503d3f5eafb0d2537a7a28f181d721dec7c44154c79"

const mockBlockchainInfo = {
  chain: "test",
  blocks: 1267694,
  headers: 1267694,
  bestblockhash:
    "000000000000013eaf80d1e157e32804c36a58ad0bb26ca59833880c80298780",
  difficulty: 4105763.969035785,
  mediantime: 1542131305,
  verificationprogress: 0.9999968911571566,
  chainwork: "00000000000000000000000000000000000000000000003f0443b0b5f02ce255",
  pruned: false,
  softforks: [
    { id: "bip34", version: 2, reject: { status: true } },
    { id: "bip66", version: 3, reject: { status: true } },
    { id: "bip65", version: 4, reject: { status: true } }
  ],
  bip9_softforks: {
    csv: {
      status: "active",
      startTime: 1456790400,
      timeout: 1493596800,
      since: 770112
    }
  }
}

module.exports = {
  mockBlockHash,
  mockBlockchainInfo
}
