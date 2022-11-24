const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userroutes');
const spaceRouter = require('./routes/spaceroutes');
const uuidapikey = require("uuid-apikey");
const encrypto = require("./common/encrypto");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  // TODO: pos user 분기처리
  const key = {
    apiKey: 'JQ6RRVC-0FA4TVX-P4N57FR-CVM5T4R',
    uuid: '95cd8c6d-03d4-4d6f-b12a-53bf66e85d13'
  }

  const apikey = await encrypto.decrypt(req.headers.apikey);

  if (!uuidapikey.isAPIKey(apikey) || !uuidapikey.check(apikey, key.uuid)) {
    return res.status(409).json({res_code: "8888", message: "사용자 인증에 실패했습니다."})
  }else {
    next()
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/space', spaceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
