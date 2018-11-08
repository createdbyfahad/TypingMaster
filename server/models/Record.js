// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

var mongoose = require('mongoose');

// the schema for keeping records of tests
var RecordSchema = new mongoose.Schema({
  user_id: String,
  date: {type: Date, default: Date.now()},
  speed: Number,
  accuracy: Number
});

module.exports = mongoose.model('Record', RecordSchema);