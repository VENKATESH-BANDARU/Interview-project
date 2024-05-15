const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

const indexRouter = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use('/api/v1', indexRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
