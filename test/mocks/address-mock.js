/*
*/

"use strict"

const mockAddressDetails = {
  addrStr: "1Fg4r9iDrEkCcDmHTy2T79EusNfhyQpu7W",
  balance: 0.00126419,
  balanceSat: 126419,
  totalReceived: 0.02175868,
  totalReceivedSat: 2175868,
  totalSent: 0.02049449,
  totalSentSat: 2049449,
  unconfirmedBalance: 0,
  unconfirmedBalanceSat: 0,
  unconfirmedTxApperances: 0,
  txApperances: 3,
  transactions: [
    "2dc053f55a666a3d2a08b1c680b704d62a55506d14ad884add87edcc56b9277d",
    "544c15ce35c0f2e808d28f29d6587f1ec9276233e29856b7f2938cf0daef0026",
    "81039b1d7b855b133f359f9dc65f776bd105650153a941675fedc504228ddbd3"
  ],
  legacyAddress: "1Fg4r9iDrEkCcDmHTy2T79EusNfhyQpu7W",
  cashAddress: "bitcoincash:qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c"
}

const mockUtxoDetails = [
  {
    address: "1Fg4r9iDrEkCcDmHTy2T79EusNfhyQpu7W",
    txid: "15f6a584080b04911121fbaca7bfcf3dd64ef2bfa5a01daf31e05a296c3e5e9e",
    vout: 286,
    scriptPubKey: "76a914a0f531f4ff810a415580c12e54a7072946bb927e88ac",
    amount: 0.00001,
    satoshis: 1000,
    height: 546083,
    confirmations: 3490
  },
  {
    address: "1Fg4r9iDrEkCcDmHTy2T79EusNfhyQpu7W",
    txid: "15f6a584080b04911121fbaca7bfcf3dd64ef2bfa5a01daf31e05a296c3e5e9e",
    vout: 287,
    scriptPubKey: "76a914a0f531f4ff810a415580c12e54a7072946bb927e88ac",
    amount: 0.00001,
    satoshis: 1000,
    height: 546083,
    confirmations: 3490
  },
  {
    address: "1Fg4r9iDrEkCcDmHTy2T79EusNfhyQpu7W",
    txid: "15f6a584080b04911121fbaca7bfcf3dd64ef2bfa5a01daf31e05a296c3e5e9e",
    vout: 288,
    scriptPubKey: "76a914a0f531f4ff810a415580c12e54a7072946bb927e88ac",
    amount: 0.00001,
    satoshis: 1000,
    height: 546083,
    confirmations: 3490
  }
]

module.exports = {
  mockAddressDetails,
  mockUtxoDetails
}
