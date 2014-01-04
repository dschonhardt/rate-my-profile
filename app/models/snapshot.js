/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash'),
	Q = require('q'),
	scanner = require('../../lib/scanner'),
	User = mongoose.model('User');

/**
 * Snapshot Schema
 */

var SnapshotSchema = new Schema({
	userId: { type: String, default: '' },
	datingSiteUsername: { type: String, default: '' },
	datingSite: { type: String, default: '' },
	date: { type: Date, default: Date.now },
	data: {}
});

/**
 * Virtuals
 */


/**
 * Validations
 */

 SnapshotSchema.path('userId').validate(function (id) {
	return id.length;
}, 'userId not found, missing or invalid');

SnapshotSchema.path('userId').validate(function (id, done) {
	User.findById(id).exec(function (err, res) {
		done(!!res);
	});
}, 'userId not found, missing or invalid');

SnapshotSchema.path('datingSiteUsername').validate(function (name) {
	return name.length;
}, 'Dating site username cannot be blank');

SnapshotSchema.path('datingSite').validate(function (datingSite) {
	return datingSite.length;
}, 'Must specify dating site');

SnapshotSchema.path('datingSite').validate(function (name) {
	try {
		return !!require.resolve('../../lib/sites/' + name);
	}
	catch (ex) {
		return false;
	}
}, 'Dating site is not supported or invalid');

/**
 * Pre-save hook
 */

SnapshotSchema.pre('save', function(next) {
	if (this.data) {
		return next();
	}

	var schema = require('../../lib/sites/' + this.datingSite);

	scanner.scan(schema.url(this.datingSiteUsername), schema.config()).then(function (data) {
		this.data = data;
	
		next();
	}.bind(this));
});

/**
 * Methods
 */

mongoose.model('Snapshot', SnapshotSchema);
