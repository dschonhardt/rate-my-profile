var Q = require('q'),
	_ = require('lodash'),
	scanner = require('../scanner'),
	profiles = [];

module.exports = {
	getProfile: function (username) {
		var result = _.find(profiles, { username: username });

		if (!result) {
			return scanner.scan(this.url(username), this.config())
				.then(function (profileData) {
					console.log('profiledata');
					console.log(profileData);
					profiles.push(profileData);
					return profileData;
				});
		}

		return Q(result);
	},
	url: function (username) {
		return "http://www.okcupid.com/profile/" + username;
	},
	config: function () {
		var config = {
			username: '#basic_info_sn',
			basics: {
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