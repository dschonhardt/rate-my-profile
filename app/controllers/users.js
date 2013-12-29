
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// User controller

exports = module.exports = function register (app) {
	app.get('/users', function (req, res) {
		res.send('This will be from the controller defined above.');
	});

	// GET - /loribellz/okcupid
	app.get('/:username/:datingSite', function (req, res) {
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
};