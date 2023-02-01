
const __DEV__ = true;
if (__DEV__ === true) {
  // 개발환경
  require('dotenv').config({path: "./common/.env.dev"});
} else {
  // 운영환경
  require('dotenv').config({path: "./common/.env.prod"});
}

const createError = require('http-errors');
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors({
  origin: "*",
  credentials: true,
}));

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userroutes');
const spaceRouter = require('./routes/spaceroutes');
const menuRouter = require('./routes/menuroutes');
const orderRouter = require("./routes/orderroutes");
const apikeyValidator = require("./middleware/apikeyValidator");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(apikeyValidator);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/space', spaceRouter);
app.use('/menu', menuRouter);
app.use('/order', orderRouter);

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
