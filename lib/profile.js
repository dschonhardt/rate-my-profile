var Q = require('q'),
	_ = require('lodash'),
	scanner = require('./scanner'),
	okcupidProfiles = [];

scanner.open();

module.exports = function (site, username) {
	return {
		get: function () {
			var dfd = Q.defer();
			var result = _.find(okcupidProfiles, { username: username });
			if (result) {
				dfd.resolve(result);
				return dfd.promise;
			}
			else {
				return this._scan();
			}
		},

		store: function (profile) {
			okcupidProfiles.push(profile);
			return profile;
		},

		_scan: function () {
			var scanning = scanner.scan(site.url(username), site.config())
				.then(this.store);
			
			scanning.finally(scanner.exit);

			return scanning;
		}
	};
};