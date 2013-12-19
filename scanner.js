var phantom = require('phantom');
phantom.create(function(ph) {
	return ph.createPage(function(page) {
		return page.open("http://www.okcupid.com/profile/syzdom", function(status) {
			return page.evaluate(function() {
				return document.title;
			}, function(result) {
				console.log('Page title is ' + result);
				return ph.exit();
			});
		});
	});
});