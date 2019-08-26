// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User.js");

require('../helpers.js');


// the register handler, it recives a name, username, and password
router.post('/register', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass name, username and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        // if there is an error then the user migh be duplicated
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});


router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          // console.log("name", user.name);
          res.json({success: true, token: 'JWT ' + token, name: user.name});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});



// route used to check if jwt recieved is authentic
router.post('/isLoggedIn', passport.authenticate('jwt', { session: false}), function(req, res) {
  // user has correct jwt
  // return user name
  res.json({name: req.user.name});
});



module.exports = router;
