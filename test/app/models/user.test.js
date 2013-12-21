var requireHijack = require('require-hijack'),
	sites = require('../../../app/models/sites'),
	fakeSites = sinon.stub(sites),
	User,
	sandbox;

requireHijack.replace('../../../app/models/sites').with(fakeSites);

User = require('../../../app/models/user');

describe('user', function () {
	var user;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		user = new User('name');
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('new User(username)', function () {
		it('should create a new user with the username set to the passed username', function () {
			// assert
			expect(user.username).to.equal('name');
		});
	});

	describe('getDatingProfile', function () {
		it('should call <site>.getProfile(username)', function () {
			// arrange
			var datingProfile = {},
				datingSiteName = 'okcupid';

			sandbox.stub(fakeSites[datingSiteName])
			fakeSites[datingSiteName].getProfile.withArgs(user.username).returns(Q(datingProfile));
			
			// act
			return user.getDatingProfile(datingSiteName).then(function (result) {
				expect(result).to.equal(datingProfile);
				expect(fakeSites[datingSiteName].getProfile.calledOnce).to.be.ok;
			});
		});
	});
});