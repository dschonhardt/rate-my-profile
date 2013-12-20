var _ = require('lodash'),
	scanner = require('./lib/scanner'),
	okcupidProfiles = [];

module.exports = function (app) {
	scanner.open();

	app.get('/:profile/:username', function (req, res) {
		var profile,
			result = _.find(okcupidProfiles, { username: req.params.username });

		if (result) {
			res.send(result);
			return;
		}

		profile = require('./lib/profiles/' + req.params.profile);

		scanner.scan(profile.url(req.params.username), profile.config())
			.then(function (result) {
				okcupidProfiles.push(result);
				res.send(result);
			})
			.finally(scanner.exit);

	});
};