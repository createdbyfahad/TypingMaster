// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var TestsSchema = new Schema({
    date: {type: Date, default: Date.now()},
    speed: Number,
    accuracy: Number
})

var UserSchema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    currentLevel: {type: Number, default: 0, required: true},
    trainingData: {type: [TestsSchema], default: []}
});

UserSchema.pre('save', function (next) {
    var user = this;
    // make sure that the passwords match with whats in db
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// a function used for pwd comparision
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);