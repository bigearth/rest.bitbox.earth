let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let basicAuth = require('express-basic-auth');
let helmet = require('helmet');
let RateLimit = require('express-rate-limit');
let axios = require('axios');
var debug = require('debug')('rest-cloud:server');
var http = require('http');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let swStats = require('swagger-stats');
let apiSpec = require('./public/bitbox-rest-v1.json');

require('dotenv').config()

let app = express();
let io = require('socket.io').listen(app.listen(3001));

let index = require('./routes/index');
let healthCheck = require('./routes/health-check');
let address = require('./routes/address');

let block = require('./routes/block');
let blockchain = require('./routes/blockchain');
let control = require('./routes/control');
let generating = require('./routes/generating');
let mining = require('./routes/mining');
let network = require('./routes/network');
let rawtransactions = require('./routes/rawtransactions');
let transaction = require('./routes/transaction');
let util = require('./routes/util');

app.use(swStats.getMiddleware({swaggerSpec:apiSpec}));

app.use(helmet());
let cors = require('cors')
app.use(cors())
app.enable('trust proxy');
let limiter = new RateLimit({
  windowMs: 60000, // 1 minute
  max: 60, // limit each IP to 20 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  handler: function (req, res, /*next*/) {
    res.format({
      json: function(){
        res.status(500).json({ error: 'Too many requests. Limits are 60 requests per minute.'});
      }
    });
  }
});
app.use('/v1/', limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use("/public", express.static(__dirname + "/public"));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
// let username = process.env.USERNAME;
// let password = process.env.PASSWORD;
//
// app.use(basicAuth(
//   {
//     users: { username: password }
//   }
// ));

// Make io accessible to our router
app.use(function(req,res,next){
  req.io = io;
  next();
});

let prefix = 'v1';
app.use('/', index);
app.use('/' + prefix + '/' + 'health-check', healthCheck);
app.use('/' + prefix + '/' + 'address', address);
app.use('/' + prefix + '/' + 'blockchain', blockchain);
app.use('/' + prefix + '/' + 'block', block);
app.use('/' + prefix + '/' + 'control', control);
app.use('/' + prefix + '/' + 'generating', generating);
app.use('/' + prefix + '/' + 'mining', mining);
app.use('/' + prefix + '/' + 'network', network);
app.use('/' + prefix + '/' + 'rawtransactions', rawtransactions);
app.use('/' + prefix + '/' + 'transaction', transaction);
app.use('/' + prefix + '/' + 'util', util);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: 500,
    message: err.message
  });
});
// var io = require('socket.io')(http);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// io.sockets.on('connection', function (socket) {
//   console.log('client connect');
//   socket.on('echo', function (data) {
//   io.sockets.emit('message', data);
//  });
// });

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('transaction', function(txid){

    axios.get(`${process.env.BITCOINCOM_BASEURL}tx/${txid}`)
    .then((response) => {
      console.log(`${process.env.BITCOINCOM_BASEURL}tx/${txid}`);
      let parsed = response.data;
      if(parsed && parsed.vin) {
        parsed.vin.forEach((vin) => {
          if(!vin.coinbase) {
            let address = vin.addr;
            vin.legacyAddress = BITBOX.Address.toLegacyAddress(address);
            vin.cashAddress = BITBOX.Address.toCashAddress(address);
            vin.value = vin.valueSat;
            delete vin.addr;
            delete vin.valueSat;
            delete vin.doubleSpentTxID;
          }
        });
      }
      io.emit('transaction', parsed);
    })
    .catch((error) => {
      res.send(error.response.data.error.message);
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
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
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//
// module.exports = app;
