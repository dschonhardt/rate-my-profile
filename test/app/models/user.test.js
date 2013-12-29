var requireHijack = require('require-hijack'),
	config = require('../../../config/config')['test'],
	sandbox;

describe('user', function () {
	var user, snapshots;

	before(function() {
		snapshots = [
			{ datingSite: 'okcupid', username: 'loribellz' },
			{ datingSite: 'okcupid', username: 'loribellz2' }
		];
		snapshots.forEach(function (snapshot) {
			var foo = new (mongoose.model('Snapshot'))(snapshot);
			foo.save();
		});
	});

	after(function (done) {
        mongoose.connection.db.dropDatabase(done);
	});

    afterEach(function (){
		sandbox.restore();
    });

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		user = new (mongoose.model('User'))({
			username: 'loribellz'
		});
	});

	describe('getSnapshots(datingSite)', function () {
		it('should return nothing when the username is not defined', function () {
			user.username = '';
			return user.getSnapshots('okcupid').then(function (results) {
				expect(results.length).to.equal(0);
			});
		});

		it('should return nothing when the username is right but the dating site is wrong', function () {
			return user.getSnapshots('someothersite').then(function (results) {
				expect(results.length).to.equal(0);
			});
		});

		it('should return only this users snapshots', function (done) {
			return user.getSnapshots('okcupid').then(function (results) {
				expect(results.length).to.equal(1);
				expect(results[0].username).to.eql(snapshots[0].username);
			});
		});
	});

	describe('takeSnapshot(datingSite', function () {
		before(function () {
			sandbox.stub(mongoose.model('Snapshot').prototype, 'take', function () { return this; });
		});

		it('should call take on the newly constructed snapshot', function () {
			var snapshot = user.takeSnapshot('okcupid');
			expect(snapshot.datingSite).to.equal('okcupid');
			expect(snapshot.username).to.equal(user.username);
			expect(snapshot.take).to.have.been.calledOnce;
		});
	});
});