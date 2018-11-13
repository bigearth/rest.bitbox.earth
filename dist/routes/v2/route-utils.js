/*
  A private library of utility functions used by several different routes.
*/
"use strict";
var axios = require("axios");
var BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
var BITBOX = new BITBOXCli();
module.exports = {
    validateNetwork: validateNetwork,
    setEnvVars: setEnvVars // Allows RPC variables to be set dynamically based on changing env vars.
};
// Returns true if user-provided cash address matches the correct network,
// mainnet or testnet. If NETWORK env var is not defined, it returns false.
// This prevent a common user-error issue that is easy to make: passing a
// testnet address into rest.bitcoin.com or passing a mainnet address into
// trest.bitcoin.com.
function validateNetwork(addr) {
    try {
        var network = process.env.NETWORK;
        // Return false if NETWORK is not defined.
        if (!network || network === "") {
            console.log("Warning: NETWORK environment variable is not defined!");
            return false;
        }
        // Convert the user-provided address to a cashaddress, for easy detection
        // of the intended network.
        var cashAddr = BITBOX.Address.toCashAddress(addr);
        // Return true if the network and address both match testnet
        var addrIsTest = BITBOX.Address.isTestnetAddress(cashAddr);
        if (network === "testnet" && addrIsTest)
            return true;
        // Return true if the network and address both match mainnet
        var addrIsMain = BITBOX.Address.isMainnetAddress(cashAddr);
        if (network === "mainnet" && addrIsMain)
            return true;
        return false;
    }
    catch (err) {
        logger.error("Error in validateNetwork()");
        return false;
    }
}
// Dynamically set these based on env vars. Allows unit testing.
function setEnvVars() {
    var BitboxHTTP = axios.create({
        baseURL: process.env.RPC_BASEURL
    });
    var username = process.env.RPC_USERNAME;
    var password = process.env.RPC_PASSWORD;
    var requestConfig = {
        method: "post",
        auth: {
            username: username,
            password: password
        },
        data: {
            jsonrpc: "1.0"
        }
    };
    return { BitboxHTTP: BitboxHTTP, username: username, password: password, requestConfig: requestConfig };
}
