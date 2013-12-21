var phantom = require('phantom'),
	scraper = require('./scraper'),
	Q = require('q');

module.exports = {
	ph: null,

	open: function () {
		var dfd = Q.defer(),
			self = this;

		phantom.create(function(ph) {
			self.ph = ph;
			dfd.resolve(ph);
		});

		return dfd.promise;
	},

	scan: function (url, data) {
		var scanning = Q.defer(),
			self = this;

		if (!this.ph) {
			return this.open().then(function () {
				return self.scan(url, data);
			});
		}

		this.ph.createPage(function(page) {
			page.open(url, function () {
				return page.evaluate(scraper, function (result) {
					scanning.resolve(result);
					page.close();
				}, data);
			});
		});

		return scanning.promise;
	},

	exit: function () {
		phantom.exit();
	}
}