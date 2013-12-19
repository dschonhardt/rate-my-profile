var phantom = require('phantom'),
	scraper = require('./scraper'),
	q = require('q');

var profileData = {
	username: 'loribellz',
	age: '',
	gender: '',
	sexualOrientation: '',
	relationshipStatus: '',
	city: '',
	state: '',
	photos: [],
	tabs: [{
		sectionName: '',
		sectionContents: ''
	}]
};

var phantomPage, phantom;

module.exports = {
	open: function () {
		var dfd = q.defer();

		phantom.create(function(ph) {
			phantom = ph;
			phantom.createPage(function(page) {
				dfd.resolve(page);
				phantomPage = page;
			});
		});

		return dfd.promise;
	},
	exit: function () {
		phantom.exit();
	},
	scan: function (username) {
		var scanning = q.defer();

		phantomPage.open("http://www.okcupid.com/profile/" + profileData.username, function () {
			return phantomPage.evaluate(scraper, function (result) {
				scanning.resolve(result);
			});
		});

		return scanning.promise;
	}
}