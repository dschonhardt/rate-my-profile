/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	_ = require('lodash'),
	sites = require('./sites');

/**
 * User Schema
 */

var UserSchema = new Schema({
	name: { type: String, default: '' },
	email: { type: String, default: '' },
	username: { type: String, default: '' },
	hashed_password: { type: String, default: '' },
	salt: { type: String, default: '' },
	authToken: { type: String, default: '' },
	snapshots: [{ site: String, date: Date, profile: {} }]
});

/**
 * Virtuals
 */

UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password
		this.salt = this.makeSalt()
		this.hashed_password = this.encryptPassword(password)
	})
	.get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
	return value && value.length;
};

UserSchema.path('name').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
	var User = mongoose.model('User');

	// Check only when it is a new user or when email field is modified
	if (this.isNew || this.isModified('email')) {
		User.find({ email: email }).exec(function (err, users) {
			fn(!err && users.length === 0)
		});
	} 
	else {
		fn(true);
	}
}, 'Email already exists');

UserSchema.path('username').validate(function (username) {
	return username.length >= 3
}, 'Username must be at least three characters');

UserSchema.path('hashed_password').validate(function (hashed_password) {
	return hashed_password.length
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
	if (!this.isNew) {
		return next();
	}

	if (!validatePresenceOf(this.password))
		next(new Error('Invalid password'));
	else
		next();
});

/**
 * Methods
 */

UserSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},

	encryptPassword: function (password) {
		if (!password) {
			return '';
		}
		var encrypred;
		try {
			encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
			return encrypred;
		} catch (err) {
			return '';
		}
	},

	getDatingProfile: function (datingSiteName) {
		var site = sites[datingSiteName];
		return site.getProfile(this.username); // Should load this dating site username from user's profile
	}
}

mongoose.model('User', UserSchema);