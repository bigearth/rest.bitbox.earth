"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var basicAuth = require("express-basic-auth");
var helmet = require("helmet");
var debug = require("debug")("rest-cloud:server");
var http = require("http");
var cors = require("cors");
var BitcoinCashZMQDecoder = require("bitcoincash-zmq-decoder");
var zmq = require("zeromq");
var sock = zmq.socket("sub");
var swStats = require("swagger-stats");
var apiSpec = require("./public/bitcoin-com-rest-v1.json");
// v1
var indexV1 = require("./routes/v1/index");
var healthCheckV1 = require("./routes/v1/health-check");
var addressV1 = require("./routes/v1/address");
var blockV1 = require("./routes/v1/block");
var blockchainV1 = require("./routes/v1/blockchain");
var controlV1 = require("./routes/v1/control");
var generatingV1 = require("./routes/v1/generating");
var miningV1 = require("./routes/v1/mining");
var networkV1 = require("./routes/v1/network");
var rawtransactionsV1 = require("./routes/v1/rawtransactions");
var transactionV1 = require("./routes/v1/transaction");
var utilV1 = require("./routes/v1/util");
var dataRetrievalV1 = require("./routes/v1/dataRetrieval");
var payloadCreationV1 = require("./routes/v1/payloadCreation");
var slpV1 = require("./routes/v1/slp");
// v2
var indexV2 = require("./routes/v2/index");
var healthCheckV2 = require("./routes/v2/health-check");
var addressV2 = require("./routes/v2/address");
var blockV2 = require("./routes/v2/block");
var blockchainV2 = require("./routes/v2/blockchain");
var controlV2 = require("./routes/v2/control");
var generatingV2 = require("./routes/v2/generating");
var miningV2 = require("./routes/v2/mining");
var networkV2 = require("./routes/v2/network");
var rawtransactionsV2 = require("./routes/v2/rawtransactions");
var transactionV2 = require("./routes/v2/transaction");
var utilV2 = require("./routes/v2/util");
var dataRetrievalV2 = require("./routes/v2/dataRetrieval");
var payloadCreationV2 = require("./routes/v2/payloadCreation");
require("dotenv").config();
var app = express();
app.use(swStats.getMiddleware({ swaggerSpec: apiSpec }));
app.use(helmet());
app.use(cors());
app.enable("trust proxy");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use("/public", express.static(__dirname + "/public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Make io accessible to our router
app.use(function (req, res, next) {
    req.io = io;
    next();
});
var v1prefix = "v1";
var v2prefix = "v2";
app.use("/", indexV1);
app.use("/" + v1prefix + "/" + "health-check", healthCheckV1);
app.use("/" + v1prefix + "/" + "address", addressV1);
app.use("/" + v1prefix + "/" + "blockchain", blockchainV1);
app.use("/" + v1prefix + "/" + "block", blockV1);
app.use("/" + v1prefix + "/" + "control", controlV1);
app.use("/" + v1prefix + "/" + "generating", generatingV1);
app.use("/" + v1prefix + "/" + "mining", miningV1);
app.use("/" + v1prefix + "/" + "network", networkV1);
app.use("/" + v1prefix + "/" + "rawtransactions", rawtransactionsV1);
app.use("/" + v1prefix + "/" + "transaction", transactionV1);
app.use("/" + v1prefix + "/" + "util", utilV1);
app.use("/" + v1prefix + "/" + "dataRetrieval", dataRetrievalV1);
app.use("/" + v1prefix + "/" + "payloadCreation", payloadCreationV1);
app.use("/" + v1prefix + "/" + "slp", slpV1);
app.use("/", indexV2);
app.use("/" + v2prefix + "/" + "health-check", healthCheckV2);
app.use("/" + v2prefix + "/" + "address", addressV2.router);
app.use("/" + v2prefix + "/" + "blockchain", blockchainV2.router);
app.use("/" + v2prefix + "/" + "block", blockV2.router);
app.use("/" + v2prefix + "/" + "control", controlV2.router);
app.use("/" + v2prefix + "/" + "generating", generatingV2);
app.use("/" + v2prefix + "/" + "mining", miningV2);
app.use("/" + v2prefix + "/" + "network", networkV2);
app.use("/" + v2prefix + "/" + "rawtransactions", rawtransactionsV2.router);
app.use("/" + v2prefix + "/" + "transaction", transactionV2);
app.use("/" + v2prefix + "/" + "util", utilV2);
app.use("/" + v2prefix + "/" + "dataRetrieval", dataRetrievalV2.router);
app.use("/" + v2prefix + "/" + "payloadCreation", payloadCreationV2);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = {
        message: "Not Found",
        status: 404
    };
    next(err);
});
// error handler
app.use(function (err, req, res) {
    var status = err.status || 500;
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({
        status: 500,
        message: err.message
    });
});
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
var io = require("socket.io").listen(server);
io.on("connection", function (socket) {
    console.log("Socket Connected");
    socket.on("disconnect", function () {
        console.log("Socket Disconnected");
    });
});
var bitcoincashZmqDecoder = new BitcoinCashZMQDecoder(process.env.NETWORK);
sock.connect("tcp://" + process.env.ZEROMQ_URL + ":" + process.env.ZEROMQ_PORT);
sock.subscribe("raw");
sock.on("message", function (topic, message) {
    var decoded = topic.toString("ascii");
    if (decoded === "rawtx") {
        var txd = bitcoincashZmqDecoder.decodeTransaction(message);
        io.emit("transactions", JSON.stringify(txd, null, 2));
    }
    else if (decoded === "rawblock") {
        var blck = bitcoincashZmqDecoder.decodeBlock(message);
        io.emit("blocks", JSON.stringify(blck, null, 2));
    }
});
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
// Set the time before a timeout error is generated. This impacts testing and
// the handling of timeout errors. Is 10 seconds too agressive?
server.setTimeout(10000);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen")
        throw error;
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
