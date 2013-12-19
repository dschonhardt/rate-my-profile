module.exports = {
	url: function (username) {
		return "http://www.okcupid.com/profile/" + username;
	},
	config: function () {
		var config = {
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
			photos: '#profile_thumbs img',
			essays: []
		}, 
		i = 1, 
		result, 
		photoImages;

		for(; i < 10; i++) {
			config.essays.push({
				text: '#essay_text_' + i,
				title: '#essay_' + i + ' .essay_title'
			});
		}

		return config;
	}
};