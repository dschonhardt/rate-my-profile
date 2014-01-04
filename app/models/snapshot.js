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
	userId: { type: String, default: '', required: true },
	datingSiteUsername: { type: String, default: '', required: true },
	datingSite: { type: String, default: '', required: true },
	date: { type: Date, default: Date.now },
	data: {}
});

/**
 * Virtuals
 */


/**
 * Validations
 */

SnapshotSchema.path('userId').validate(function (id, done) {
	User.findById(id).exec(function (err, res) {
		done(!!res);
	});
}, 'userId not found, missing or invalid');

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
