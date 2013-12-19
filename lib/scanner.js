var phantom = require('phantom'),
	scraper = require('./scraper'),
	q = require('q');

var ph;

module.exports = {
	phantomPage: null,

	open: function () {
		var dfd = q.defer(),
			self = this;

		phantom.create(function(ph) {
			ph.createPage(function(page) {
				dfd.resolve(page);
				self.phantomPage = page;
			});
		});

		return dfd.promise;
	},
	scan: function (username) {
		var scanning = q.defer(),
			self = this;

		this.phantomPage.open("http://www.okcupid.com/profile/" + username, function () {
			return self.phantomPage.evaluate(scraper, function (result) {
				scanning.resolve(result);
			});
		});

		return scanning.promise;
	},

	exit: function () {
		phantom.exit();
	}
}