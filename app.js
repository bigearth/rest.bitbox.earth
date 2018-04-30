let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let basicAuth = require('express-basic-auth')

require('dotenv').config()

let index = require('./routes/index');
let healthCheck = require('./routes/health-check');
let healthCheck = require('./routes/blockchain');
let healthCheck = require('./routes/control');
let healthCheck = require('./routes/generating');
let healthCheck = require('./routes/mining');
let healthCheck = require('./routes/network');
let healthCheck = require('./routes/rawtransaction');
let healthCheck = require('./routes/util');

let app = express();
let cors = require('cors')
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
// app.use('/' + prefix + '/' + 'users', users);
// app.use('/clones', clones);

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
