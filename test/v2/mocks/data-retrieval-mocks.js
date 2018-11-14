/*
  This library contains mocking data for running unit tests.
*/

"use strict"

const mockConsensusHash = {
  block: 1267863,
  blockhash: "000000000001e7e30c34eaf044ffd0e5bf28eeeaad5fc6b2a6de5cb70befa54c",
  consensushash:
    "476bff1d01a66420a53b65bf72ac46056c91ea32d64a46440306f4a9f1695668"
}

const mockInfo = {
  wormholeversion_int: 10000000,
  wormholeversion: "0.1.0",
  bitcoincoreversion: "0.17.2",
  block: 1267875,
  blocktime: 1542218842,
  blocktransactions: 0,
  totaltransactions: 4355,
  alerts: []
}

module.exports = {
  mockConsensusHash,
  mockInfo
}
