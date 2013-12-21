var _ = require('lodash'),
	scanner = require('../scanner'),
	Q = require('q');

var profiles = [];

exports = module.exports = {
	getProfile: function (username) {
		return Q(this._getProfileLocal(username) || this._getProfileRemote(username));
	},

	_getProfileLocal: function (username) {
		return _.find(profiles, { username: username });
	},

	_getProfileRemote: function (username) {
		return scanner.scan(this.url(username), this.config())
			.then(function (profileData) {
				profiles.push(profileData);
				return profileData;
			});
	}
}