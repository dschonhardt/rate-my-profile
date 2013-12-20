var phantom = require('phantom'),
	scraper = require('./scraper'),
	q = require('q');

var ph;

module.exports = {
	ph: null,

	open: function () {
		var dfd = q.defer(),
			self = this;

		phantom.create(function(ph) {
			self.ph = ph;
			dfd.resolve(ph);
		});

		return dfd.promise;
	},

	scan: function (url, data) {
		var scanning = q.defer(),
			self = this;

		
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