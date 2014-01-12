var requireHijack = require('require-hijack'),
	config = require('../../../config/config')['test'],
	sandbox;

describe('user', function () {
	var user, snapshots;

    afterEach(function (done){
		sandbox.restore();
        mongoose.connection.db.dropDatabase(done);
    });

	beforeEach(function (done) {
		sandbox = sinon.sandbox.create();

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

	describe('getSnapshots(datingSite)', function () {
		it('should return nothing when the id is not defined', function () {
			user._id = undefined;
			return user.getSnapshots('okcupid').then(function (results) {
				expect(results.length).to.equal(0);
			});
		});

		it('should return nothing when the userId is right but the dating site is wrong', function () {
			return user.getSnapshots('someothersite').then(function (results) {
				expect(results.length).to.equal(0);
			});
		});

		it('should return only this users snapshots', function (done) {
			return user.getSnapshots('okcupid').then(function (results) {
				expect(results.length).to.equal(1);
				expect(results[0].datingSiteUsername).to.eql(snapshots[0].datingSiteUsername);
			});
		});
	});

	describe('takeSnapshot(datingSite)', function () {
		before(function () {
			sandbox.stub(mongoose.model('Snapshot').prototype, 'take', function () { return this; });
		});

		it('should call take on the newly constructed snapshot', function () {
			var snapshot = user.takeSnapshot('okcupid');
			expect(snapshot.datingSite).to.equal('okcupid');
			expect(snapshot.userId == user._id).to.be.ok;
			expect(snapshot.take).to.have.been.calledOnce;
		});
	});
});