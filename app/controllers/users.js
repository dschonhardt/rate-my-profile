
var mongoose = require('mongoose'),
	Q = require('q'),
	User = mongoose.model('User');

// User controller

var UserController = {
	read: function (id) {
		return User.findById(id, 'username name email').exec(function (err, res) {
			return res;
		});
	},

	create: function (body) {
		var user = new User(body);
		return Q.nfcall(user.save.bind(user));
	}
};

exports = module.exports = {
	bind: function (app) {
		app.get('/user/:id', function (req, res) {
			UserController.read(req.params.id).then(function (user) {
				if (user) res.send(user);
				else res.send(404);
			});
		});

		// GET - /loribellz/okcupid
		app.get('/user/:username/:datingSite', function (req, res) {
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

		app.post('/user', function (req, res) {
			UserController.create(req.body).then(function (result) {
				res.send(result);
			}, function (err) {
				res.send(err);
			});
		});
	}
};