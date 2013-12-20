var requireHijack = require('require-hijack'),
	fakePhantom = sinon.stub(require('phantom')),
	scanner,
	sandbox;

requireHijack.replace('phantom').with(fakePhantom);

scanner = require('../lib/scanner'),

describe('scanner', function () {
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('open()', function () {
		it('should call create with a function', function () {
			// act
			scanner.open();

			// assert
			expect(fakePhantom.create.calledOnce).to.be.ok;
			expect(fakePhantom.create.getCall(0).args[0]).to.be.a('function');
		});
		it('should resolve promise with the created page', function () {
			// arrange
			var ph = {};

			fakePhantom.create.callsArgWith(0, ph);

			// act
			return scanner.open().then(function (res) {
				// assert
				expect(res).to.equal(ph);
				expect(scanner.ph).to.equal(ph);
			});
		});
	});

	describe('scan(url, data)', function () {
		it('should call open if ph does not exist', function () {
			// arrange
			var url = 'http://www.google.com',
				data = {},
				result = {};

			scanner.ph = null;
			sandbox.stub(scanner, 'open', function () {
				sandbox.stub(scanner, 'scan').returns(Q(result));
				return Q(true);
			});

			// act
			return scanner.scan(url, data).then(function (profileData) {
				// assert
				expect(profileData).to.equal(result);
				expect(scanner.open.calledOnce).to.be.ok;
				expect(scanner.scan.calledOnce).to.be.ok;
				expect(scanner.scan.calledWithExactly(url, data)).to.be.ok;
			});
		});

		it('should open the page at the given URL and evaluate the scraper on it returning the result', function () {
			// arrange
			var url = 'http://www.google.com',
				data = {},
				scrapedData = {},
				page = sandbox.stub({ open: function () { }, evaluate: function () { }, close: function () { } });

			scanner.ph = sandbox.stub({ createPage: function () { } });
			scanner.ph.createPage.callsArgWith(0, page);	
			page.open.callsArg(1);
			page.evaluate.callsArgWith(1, scrapedData);

			// act
			return scanner.scan(url, data).then(function (result) {
				// assert
				expect(result).to.equal(scrapedData);
				expect(page.open.calledOnce).to.be.ok;
				expect(page.close.calledOnce).to.be.ok;
				expect(page.evaluate.getCall(0).args[2]).to.equal(data);
			});
		});

	});

	describe('exit()', function () {
		it('should exit the phantom process', function () {
			// arrange
			fakePhantom.exit = sandbox.spy();

			// act
			scanner.exit();

			// assert
			expect(fakePhantom.exit.calledOnce).to.be.ok;
		});
	});
});