
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// User controller

exports = module.exports = function register (app) {
	app.get('/users', function (req, res) {
		res.send('This will be from the controller defined above.');
	});

	// GET - /loribellz/okcupid
	app.get('/:username/:datingSite', function (req, res) {
		var user = new User();
		user.username = req.params.username;
		
		user.getDatingProfile(req.params.datingSite).then(function (profile) {
			res.send(profile);
		});
	});
};