var requireHijack = require('require-hijack'),
	fakePhantom = sinon.stub(require('phantom')),
	scanner;

requireHijack.replace('phantom').with(fakePhantom);

scanner = require('../lib/scanner'),

describe('scanner', function () {
	describe('open()', function () {
		before(function () {
			scanner.open();
		});
		it('should call create with a function', function () {
			fakePhantom.create.should.have.been.calledOnce;
			expect(fakePhantom.create.getCall(0).args[0]).to.be.a('function');
		});
	});
});