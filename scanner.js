var phantom = require('phantom'),
	parser = require('./lib/parser');

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

phantom.create(function(ph) {
	return ph.createPage(function(page) {
		return page.open("http://www.okcupid.com/profile/" + profileData.username, function(status) {
			return page.evaluate(parser, function (result) {
				console.log('here');
				console.log(result);
				ph.exit();
			});
		});
	});
});