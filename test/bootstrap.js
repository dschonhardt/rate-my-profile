before(function (done) {
	mongoose.model('User').remove({}, function () {
		var users = [
			{
				username: 'loribellz',
				name: 'name',
				email: 'email342@email.com',
				password: 'foo'
			},
			{
				username: 'sallysue',
				name: 'name',
				email: 'emaisafl@email.com',
				password: 'foo'
			}
		];

		(mongoose.model('User')).create(users[0], users[1]).then(function (user1, user2) {
			user = user1;

			snapshots = [
				{ datingSite: 'okcupid', datingSiteUsername: 'loribellz', userId: user1.get('_id') },
				{ datingSite: 'okcupid', datingSiteUsername: 'loribellz2', userId: user2.get('_id') }
			];

			var promises = snapshots.map(function (snapshot) {
				var dfd = Q.defer();
				var foo = new (mongoose.model('Snapshot'))(snapshot);

				foo.save(function () {
					dfd.resolve();
				});
				return dfd.promise;
			});

			Q.all(promises).then(function () {
				done();
			});
		}, done);
	});
});

after(function (done) {
    mongoose.connection.db.dropDatabase(done);
});