var mongoose = require('mongoose'),
	User = mongoose.model('User');
/*
User.find(function (err, users) {
	if (err) // TODO handle err
		console.error(err);

	if (!users || !users.length) {
		console.log('no users, bootstrapping');

		var newbie = new User({
			name: 'loribellz',
			username: 'loribellz',
			password: 'password',
			email: 'email@email.com'
		});

		newbie.save(function (err) {
			console.error(err);
		});
	}
	else {
		users.forEach(function (user) {
			debugger;
			user.getSnapshots('okcupid').then(function (results) {
				debugger;
				console.log(results);
				if (!results || !results.length) {
					user.takeSnapshot('okcupid').then(function (snapshot) {
						debugger;
						console.log(snapshot);
					});
				}
			});
		});
	}
});
*/