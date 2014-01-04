
var mongoose = require('mongoose'),
	Q = require('q'),
	_ = require('lodash'),
	Snapshot = mongoose.model('Snapshot');

// Snapshot controller

var base = '/snapshot';
var SnapshotController = {
	read: function (id) {
		return Snapshot.findById(id).exec();
	},

	create: function (body) {
		return Snapshot.create(body);
	},

	delete: function (id) {
		return Snapshot.findByIdAndRemove(id).exec();
	},

	bind: function (app) {
		// Read
		app.get(base + '/:id', function (req, res) {
			SnapshotController.read(req.params.id).then(function (user) {
				if (user) res.send(user);
				else res.send(404);
			});
		});

		// Create
		app.post(base, function (req, res) {
			SnapshotController.create(req.body).then(function (result) {
				res.send(result);
			}, function (err) {
				res.send(err);
			});
		});

		// Delete
		app.delete(base + '/:id', function (req, res) {
			SnapshotController.delete(req.params.id).then(function () {
				res.send({});
			});
		});
	}
};

exports = module.exports = SnapshotController;