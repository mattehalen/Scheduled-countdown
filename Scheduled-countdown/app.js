var createError = require('http-errors');
//---------- socket io
var express = require('express');
var app = express();
var path = require('path');
//---------- socket io ernd
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const showNumbers = require('./public/scheduledTimes.json');

//--------------------------------------------------
// //---------- socket io
// const APP_PORT = 3001
//
// const server = app.listen(APP_PORT, () => {
//   console.log(`App running on port ${APP_PORT}`)
//
// const io = require('socket.io').listen(server)
//
// app.get('/', (req, res) => {
//   res.render('index')
// })
//
// io.on('connection', (socket) => {
//   console.log('a user connected')
// })
// //--------------------------------------------------
//----------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/users', usersRouter);


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
