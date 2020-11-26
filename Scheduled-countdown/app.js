var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');

// ExpressJs App initialize
var app = express();


// Routes
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');


// View Engines Setup i.e. Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'))


// Routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err && err.message ? err.message : 'Something broke!',
    error: err,
    status: err.status || 500
  });
});


module.exports = app;
