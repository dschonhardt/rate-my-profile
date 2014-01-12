var requireHijack = require('require-hijack'),
	config = require('../../../config/config')['test'],
	sandbox;

describe('user', function () {
	var user, snapshots, username = 'loribellz';

    afterEach(function (){
		sandbox.restore();
    });

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	describe('getSnapshots(datingSite)', function () {
		before(function (done) {
			mongoose.model('User').findOne({ username: username }, function (err, res) {
				user = res;
				done();
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
				expect(results[0].datingSiteUsername).to.eql(username);
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