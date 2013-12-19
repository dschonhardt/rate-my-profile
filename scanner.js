var phantom = require('phantom');

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
			page.evaluate(function() {
				// function evaluator (data) {

				// }

				var data = {
					basics: {
						username: 'basic_info_sn',
						age: 'ajax_age',
						gender: 'ajax_gender',
						orientation: 'ajax_orientation',
						status: 'ajax_status',
						city: '',
						state: ''
					},
					details: {
						ethnicities: 'ajax_ethnicities',
						height: 'ajax_height',
						bodytype: 'ajax_bodytype',
						diet: 'ajax_diet',
						smoking: 'ajax_smoking',
						drinking: 'ajax_drinking',
						drugs: 'ajax_drugs',
						religion: 'ajax_religion',
						sign: 'ajax_sign',
						education: 'ajax_education',
						job: 'ajax_job',
						income: 'ajax_income',
						children: 'ajax_children',
						pets: 'ajax_pets',
						languages: 'ajax_languages'
					},
					photos: [],
					essays: []
				}, i = 1;

				for(; i < 10; i++) {
					data.essays.push('essay_text_' + i);
				}

				// evaluate(data);
				
				return data;
			}, function(result) {
				console.log('userdata' + JSON.stringify(result));
				ph.exit();
			});
		});
	});
});