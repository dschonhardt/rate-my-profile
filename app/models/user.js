/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	_ = require('lodash'),
	Q = require('q'),
	sites = require('../../lib/sites');

/**
 * User Schema
 */

var UserSchema = new Schema({
	name: { type: String, default: '', required: true },
	email: { type: String, default: '', required: true },
	username: { type: String, default: '', required: true },
	hashed_password: { type: String, default: '', required: true },
	salt: { type: String, default: '' },
	authToken: { type: String, default: '' }
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

	getSnapshots: function (datingSite) {
		var Snapshot = mongoose.model('Snapshot');
		return Q.nfcall(Snapshot.find.bind(Snapshot), { 
			datingSite: datingSite,
			userId: this._id
		});
	},

	takeSnapshot: function (datingSite) {
		var Snapshot = mongoose.model('Snapshot'),
			snapshot = new Snapshot({ 
				datingSite: datingSite,
				userId: this._id
			});

		return snapshot.take();
	}
};

mongoose.model('User', UserSchema);


require('./user.bootstrap');
