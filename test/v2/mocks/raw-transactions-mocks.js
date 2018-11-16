/*
  This library contains mocking data for running unit tests.
*/

"use strict"

const mockDecodeRawTransaction = {
  txid: "a332237d82a2543af1b0e1ae3c8cea1610c290ebcaf084a7e9894a61de0be988",
  hash: "a332237d82a2543af1b0e1ae3c8cea1610c290ebcaf084a7e9894a61de0be988",
  size: 226,
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "21cced645eab150585ed7ca7c96edebab5793cc0a3b3b286c42fd7d6d798b5b9",
      vout: 1,
      scriptSig: {
        asm:
          "3045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd41390[ALL|FORKID] 0360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413d",
        hex:
          "483045022100a7b1b08956abb8d6f322aa709d8583c8ea492ba0585f1a6f4f9983520af74a5a0220411aee4a9a54effab617b0508c504c31681b15f9b187179b4874257badd4139041210360cfc66fdacb650bc4c83b4e351805181ee696b7d5ab4667c57b2786f51c413d"
      },
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0.0001,
      n: 0,
      scriptPubKey: {
        asm:
          "OP_DUP OP_HASH160 eb4b180def88e3f5625b2d8ae2c098ff7d85f664 OP_EQUALVERIFY OP_CHECKSIG",
        hex: "76a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac",
        reqSigs: 1,
        type: "pubkeyhash",
        addresses: [Array]
      }
    },
    {
      value: 0.09989752,
      n: 1,
      scriptPubKey: {
        asm:
          "OP_DUP OP_HASH160 eb4b180def88e3f5625b2d8ae2c098ff7d85f664 OP_EQUALVERIFY OP_CHECKSIG",
        hex: "76a914eb4b180def88e3f5625b2d8ae2c098ff7d85f66488ac",
        reqSigs: 1,
        type: "pubkeyhash",
        addresses: [Array]
      }
    }
  ]
}

module.exports = {
  mockDecodeRawTransaction
}
