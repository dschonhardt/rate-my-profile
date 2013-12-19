var phantom = require('phantom'),
	scraper = require('./scraper'),
	q = require('q');

var phantomPage, ph;

module.exports = {
	open: function () {
		var dfd = q.defer();

		phantom.create(function(ph) {
			ph.createPage(function(page) {
				dfd.resolve(page);
				phantomPage = page;
			});
		});

		return dfd.promise;
	},
	scan: function (username) {
		var scanning = q.defer();

		phantomPage.open("http://www.okcupid.com/profile/" + username, function () {
			return phantomPage.evaluate(scraper, function (result) {
				scanning.resolve(result);
			});
		});

		return scanning.promise;
	},
	exit: function () {
		phantom.exit();
	}
}