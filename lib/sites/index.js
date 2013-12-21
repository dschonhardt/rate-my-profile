var _ = require('lodash'),
	siteAPI = require('./site');

var providers = {
	okcupid: require('./okcupid')
};

// Mix in the common Site API
Object.keys(providers).forEach(function (key) {
	providers[key] = _.extend(providers[key], siteAPI);
});

exports = module.exports = providers;