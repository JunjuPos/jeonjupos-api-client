const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userroutes');
const spaceRouter = require('./routes/spaceroutes');
const menuRouter = require('./routes/menuroutes');
const uuidapikey = require("uuid-apikey");
const encrypto = require("./common/encrypto");
const cors = require("cors");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: '*',
  credential: 'true'
}));

app.use(async (req, res, next) => {
  // apikey
  const key = {
    apiKey: 'JQ6RRVC-0FA4TVX-P4N57FR-CVM5T4R',
    uuid: '95cd8c6d-03d4-4d6f-b12a-53bf66e85d13'
  }

  try{
    // headers에 apikey 유효성 체크
    let apikey = req.headers.apikey;
    if (apikey === undefined || apikey.length === 0) {
      return res.status(409).json({res_code: "8889", message: "headers에 apikey가 비어있습니다."});
    }

    // aes256으로 암호화된 값을 복호화
    apikey = await encrypto.decrypt(req.headers.apikey);

    // apikey와 일치여부 체크
    if (!uuidapikey.isAPIKey(apikey) || !uuidapikey.check(apikey, key.uuid)) {
      return res.status(409).json({res_code: "8888", message: "apikey가 위변조 되었습니다."});
    }else {
      next();
    }
  } catch (err) {
    // headers에 apikey값이 없는경우, 요청값이 위변조된 경우
    return res.status(409).json({res_code: "8887", message: err});
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/space', spaceRouter);
app.use('/menu', menuRouter);

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
