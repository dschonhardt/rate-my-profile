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


				function evaluator (data) {
					var processString = function (string) {
						var element = document.querySelectorAll(string)[0];
						if (element)
							return element.innerText;
						else
							return 'Not Found';
					};
					var processArray = function(arr) {
						return arr.map(process);
					};

					var process = function (value) {
						if (Array.isArray(value)) {
							return processArray(value);
						}
						else if (typeof value === 'object') {
							return processGroup(value);
						}
						if (value) {
							return processString(value);
						}
						return null;
					}

					var processGroup = function(data) {
						var result = {};
						Object.keys(data).forEach(function (key) {
							var value = data[key];
							result[key] = process(value);
						});
						return result;
					};

					var result;

					result = processGroup(data); 
					return result;
				}
				var data = {
					basics: {
						username: '#basic_info_sn',
						age: '#ajax_age',
						gender: '#ajax_gender',
						orientation: '#ajax_orientation',
						status: '#ajax_status',
						city: '',
						state: ''
					},
					details: {
						ethnicities: '#ajax_ethnicities',
						height: '#ajax_height',
						bodytype: '#ajax_bodytype',
						diet: '#ajax_diet',
						smoking: '#ajax_smoking',
						drinking: '#ajax_drinking',
						drugs: '#ajax_drugs',
						religion: '#ajax_religion',
						sign: '#ajax_sign',
						education: '#ajax_education',
						job: '#ajax_job',
						income: '#ajax_income',
						children: '#ajax_children',
						pets: '#ajax_pets',
						languages: '#ajax_languages'
					},
					photos: [],
					essays: []
				}, i = 1;

				for(; i < 10; i++) {
					data.essays.push({
						text: '#essay_text_' + i,
						title: '#essay_' + i + ' .essay_title'
					});
				}

				var result = evaluator(data);

				var photoImages = document.querySelectorAll('#profile_thumbs img');
				result.numberOfPhotos = photoImages.length;
				for(i = 0; i < photoImages.length; i++) {
					result.photos.push(photoImages[i].src)
				}

				return result;
			}, function(result) {
				console.log('userdata' + JSON.stringify(result));
				ph.exit();
			});
		});
	});
});