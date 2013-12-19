var phantom = require('phantom');

var profileData = {
	username: 'loribellz',
	age: '',
	gender: '',
	sexualOrientation: '',
	relationshipStatus: '',
	city:: '',
	state:: '',
	photos: [],
	tabs: [{
		sectionName: '',
		sectionContents: ''
	}]
};

phantom.create(function(ph) {
	return ph.createPage(function(page) {
		return page.open("http://www.okcupid.com/profile/" + profileData.username, function(status) {
			return page.evaluate(function() {
				return document.title;
			}, function(result) {
				console.log('Page title is ' + result);
				return ph.exit();
			});
		});
	});
});