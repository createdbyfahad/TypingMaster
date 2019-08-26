// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi


var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Record = require('../models/Record.js');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require("../models/User.js");
require('../config/passport')(passport);

require('../helpers.js');

// returns the user's all records
router.get('/all', passport.authenticate('jwt', { session: false}), function(req, res) {
  // if (token) {
    // if there is no user id, then there is a problem
    if(!req.user._id ){
      // some information is missing
      return res.status(401).send({success: false, msg: 'Some information is missing.'});
    }

    var user_id = req.user._id;
    Record.find({user_id: user_id}, function (err, records) {
      if (err) return next(err);
      res.json(records);
    });
});

router.post('/add', passport.authenticate('jwt', { session: false}), function(req, res) {
    if(!req.user._id || !req.body.accuracy || !req.body.speed){
      // some information is missing
      return res.status(401).send({success: false, msg: 'Some information is missing.'});
    }

    // prepare the data for database addition
    dataObj = {
      user_id: req.user._id,
      date: new Date(),
      accuracy: req.body.accuracy,
      speed: req.body.speed
    }
    // console.log(dataObj)

    Record.create(dataObj, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
});

router.post('/trainingData', passport.authenticate('jwt', { session: false}), function(req, res) {
  // user has correct jwt
  // return training data from user
  console.log("trainingData is requested");
  res.json({currentLevel: req.user.currentLevel, trainingData: req.user.trainingData});
});

router.post('/trainingData/add', passport.authenticate('jwt', { session: false}), function(req, res) {
  // user has correct jwt
  // return training data from user
  console.log("trainingData is requested");
  // console.log(req.body)
  if(!req.body.currentLevel || !req.body.accuracy || !req.body.speed){
    // some information is missing
    return res.status(401).send({success: false, msg: 'Some information is missing.'});
  }

  dataObj = {
      date: new Date(),
      accuracy: req.body.accuracy,
      speed: req.body.speed
    }
    // add it to schema and update user
    req.user.trainingData.push(dataObj)
    req.user.currentLevel = req.body.currentLevel
    console.log(req.user)
    
    User.updateOne({_id: req.user._id}, req.user, function (err, post) {
      if (err) return next(err);
      // console.log(post)
      if(post && post.ok){
        // success
      res.json(post);
      }
    });
});

router.post('/trainingData/reset', passport.authenticate('jwt', { session: false}), function(req, res) {
  // return training data from user
  // add it to schema and update user
  req.user.trainingData = []
  req.user.currentLevel = 0
  
  User.updateOne({_id: req.user._id}, req.user, function (err, post) {
    if (err) return next(err);
    // console.log(post)
    if(post && post.ok){
      // success
    res.json(post);
    }
  });
});



module.exports = router;
