// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi
require('dotenv').config()
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var record = require('./routes/record');
var auth = require('./routes/auth');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'build')));

//main two api endpoints
app.use('/api/record', record);
app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err) // prints the error when there is one
  res.locals.message = err.message;
  // res.locals.error = err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
  // res.render('error');
});

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// db information

console.log(process.env.MONGODB_USER)
mongoose.connect('mongodb://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PASS+'@'+process.env.MONGODB_HOST+':'+process.env.MONGODB_PORT+'/'+process.env.MONGODB_DB, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

module.exports = app;