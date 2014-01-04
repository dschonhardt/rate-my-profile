
var mongoose = require('mongoose'),
	Q = require('q'),
	_ = require('lodash'),
	User = mongoose.model('User');

// User controller

var base = '/user';
var safeFields = '_id username name email';
var UserController = {
	read: function (id) {
		return User.findById(id, safeFields).exec(function (err, res) {
			return res;
		});
	},

	create: function (body) {
		return User.create(body).then(function (user) {
			return _.pick(user, safeFields.split(' '));
		});
	},

	update: function (id, body) {
		return User.findByIdAndUpdate(id, body, { select: safeFields }).exec(function (err, res) {
			return res;
		});
	},

	delete: function (id) {
		return User.findByIdAndRemove(id, { select: safeFields }).exec();
	},

	bind: function (app) {
		// Read
		app.get(base + '/:id', function (req, res) {
			UserController.read(req.params.id).then(function (user) {
				if (user) res.send(user);
				else res.send(404);
			});
		});

		// Create
		app.post(base, function (req, res) {
			UserController.create(req.body).then(function (result) {
				res.send(result);
			}, function (err) {
				res.send(err);
			});
		});

		// Update
		app.put(base + '/:id', function (req, res) {
			UserController.update(req.params.id, req.body).then(function (res) {
				res.send(res);
			});
		});

		// Delete
		app.delete(base + '/:id', function (req, res) {
			UserController.delete(req.params.id).then(function () {
				res.send({});
			});
		});

		app.get(base + '/:username/:datingSite', function (req, res) {
			var user = new User({ username: req.params.username });
			
			user.getSnapshots(req.params.datingSite).then(function (profiles) {
				if (!profiles || !profiles.length) {
					user.takeSnapshot(req.params.datingSite).then(function (snapshot) {
						res.send([snapshot]);
					});
				}
				else {
					res.send(profiles);
				}
			});
		});
	}
};

exports = module.exports = UserController;