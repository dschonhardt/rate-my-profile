/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash'),
	Q = require('q'),
	scanner = require('../../lib/scanner');

/**
 * Snapshot Schema
 */

var SnapshotSchema = new Schema({
	username: { type: String, default: '' },
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

	// TODO: Fetch the data
	next();
});

/**
 * Methods
 */

SnapshotSchema.methods = {
	take: function () {
		var schema = require('../../lib/sites/' + this.datingSite);
		
		return scanner.scan(schema.url(this.username), schema.config()).then(function (data) {
			this.data = data;
			this.save();
			
			return this;
		}.bind(this));
	}
};

mongoose.model('Snapshot', SnapshotSchema);
