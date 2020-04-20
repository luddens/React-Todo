const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
var uniqid = require("uniqid");
 
const UserSchema = mongoose.Schema({
	memberID: {
		type: String,
		index: true
	},
	username: {
		type: String,
		index: false
	},
	registerDate: {
		type: Number,
		index: false
	},
	lastLoginDate: {
		type: Number,
		index: false
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	refreshToken: {
		type: String
    },
    accessToken: {
        type: String
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(err, isMatch);
	});
};

module.exports.registerUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.memberID = uniqid();
			newUser.registerDate = new Date().getTime();
			newUser.save();
			callback(null, newUser);
		});
	});
};

module.exports.getUserByEmail = function(email, callback){
	// console.log(validator.isEmail(email));
	User.findOne({email: email}, callback);
};

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
};

export default {};