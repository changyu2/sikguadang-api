global.config = require('./config.js');
global.responseCode = require('./utils/responseCode');
global.apiConst = require('./utils/apiConst');
global.util = require('util');

const Logger = require('./utils/logger');
global.log = new Logger('./logs/error.log');

const express = require('express');
const path = require('path');
const winston = require('winston');
const morgan = require('morgan');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// routers
const usersRouter = require('./routes/sikguadang/api/usersRouter');
const orderRouter = require('./routes/sikguadang/api/orderRouter');
const paymentsRouter = require('./routes/sikguadang/api/paymentsRouter');
const webhookRouter = require('./routes/sikguadang/api/webhookRouter');

process.on('uncaughtException', function(err) {
  log.warning('uncaughtException ===');
  log.warning(err.stack);
});
process.on('exit', function(code) {
  log.error('About to exit with code: %s', code);
});
process.on('warning', function(warning) {
  log.warning(warning.name);
  log.warning(warning.message);
  log.warning(warning.stack);
});
log.info('env : ' + process.env.NODE_ENV);
log.info('log level : ' + config.log.level);

// express

const app = express();

app.use(morgan(config.log.accessLogFormat, { stream: Logger.stream }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// mongodb
// CONNECT TO MONGODB SERVER

const db = mongoose.connection;

db.on('error', function(data) {
  log.error(data);
});
db.once('open', function() {
  // CONNECTED TO MONGODB SERVER
  log.info('Connected to mongod server');
});
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongodb.url, {
  // useMongoClient: true,
  useNewUrlParser: true
});

// Router
app.use('/v1/users', usersRouter);
app.use('/v1/order', orderRouter);
app.use('/v1/payments', paymentsRouter);
app.use('/v1/webhook', webhookRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
