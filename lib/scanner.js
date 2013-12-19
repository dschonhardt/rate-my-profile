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
	scan: function (url, data) {
		var scanning = q.defer(),
			self = this;

		this.phantomPage.open(url, function () {
			return self.phantomPage.evaluate(scraper, function (result) {
				scanning.resolve(result);
			}, data);
		});

		return scanning.promise;
	},

	exit: function () {
		phantom.exit();
	}
}