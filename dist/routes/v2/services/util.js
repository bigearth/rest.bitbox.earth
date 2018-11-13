/*
  This library provides common utility functions used by the routes.
*/
"use strict";
var axios = require("axios");
module.exports = {
    setEnvVars: setEnvVars // Allows RPC variables to be set dynamically based on changing env vars.
};
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
