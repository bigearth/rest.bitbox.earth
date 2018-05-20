let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let basicAuth = require('express-basic-auth');
let helmet = require('helmet');
let RateLimit = require('express-rate-limit');

require('dotenv').config()

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

let app = express();
app.use(helmet());
let cors = require('cors')
app.use(cors())
app.enable('trust proxy');
let limiter = new RateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  // handler: function (req, res, /*next*/) {
  //   if (options.headers) {
  //     res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
  //   }
  //   res.format({
  //     json: function(){
  //       res.status(500).json({ message: 'Rate Limit'});
  //     }
  //   });
  // }
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
app.use(function(req, res, next) {
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
  res.render('error');
});

module.exports = app;
