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
			var ph = sandbox.stub({ createPage: function () { } }),
				page = {};

			fakePhantom.create.callsArgWith(0, ph);
			ph.createPage.callsArgWith(0, page);

			// act
			return scanner.open().then(function (res) {
				// assert
				expect(res).to.equal(page);
			});
		});
	});

	describe('scan(url, data)', function () {
		it('should open the page at the given URL and evaluate the scraper on it returning the result', function () {
			// arrange
			var url = 'http://www.google.com',
				data = {},
				scrapedData = {};

			scanner.phantomPage = sandbox.stub({ open: function () { }, evaluate: function () { }});
			scanner.phantomPage.open.callsArg(1);
			scanner.phantomPage.evaluate.callsArgWith(1, scrapedData);

			// act
			return scanner.scan(url, data).then(function (result) {
				// assert
				expect(result).to.equal(scrapedData);
				expect(scanner.phantomPage.open.calledOnce).to.be.ok;
				expect(scanner.phantomPage.evaluate.getCall(0).args[2]).to.equal(data);
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