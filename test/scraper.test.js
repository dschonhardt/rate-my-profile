var sandbox,
	scraper = require('../lib/scraper'),
	flatConfig = {
		foo: '#foo',
		bar: '#bar',
		baz: '#baz'
	},
	nestedConfig = {
		foo: {
			bar: '#bar',
			baz: '#baz'
		}
	},
	objectArrayConfig = {
		foo: [
			{
				bar: '#bar',
				baz: '#baz'
			}, 
			{
				bar: '#bar',
				baz: '#baz'
			}
		]
	};

function createFakeTag(innerText, tagName) {
	return {
		tagName: tagName || 'DIV',
		innerText: innerText,
		src: 'SRC_' + innerText
	};
}

describe('scraper', function () {
	before(function () {
		document = {};
		document.querySelectorAll = function (arg) {
			return [createFakeTag('RESULT_' + arg)];
		};
	});

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('flat config', function () {
		it('should call querySelectorAll on each property value and store the result in the object', function () {
			expect(scraper(flatConfig)).to.eql({
				foo: 'RESULT_#foo',
				bar: 'RESULT_#bar',
				baz: 'RESULT_#baz'
			});
		});
	});

	describe('nested config', function () {
		it('should call querySelectorAll on each nested property value and store the result in the object', function () {
			expect(scraper(nestedConfig)).to.eql({
				foo: {
					bar: 'RESULT_#bar',
					baz: 'RESULT_#baz'
				}
			});
		});
	});

	describe('object array config', function () {
		it('should call querySelectorAll on each property in each object in the array and store all contents', function () {
			expect(scraper(objectArrayConfig)).to.eql({
				foo: [
					{
						bar: 'RESULT_#bar',
						baz: 'RESULT_#baz'
					},
					{
						bar: 'RESULT_#bar',
						baz: 'RESULT_#baz'
					}
				]
			});
		});
	});

	describe('multiple selector results', function () {
		beforeEach(function () {
			sandbox.stub(document, 'querySelectorAll', function (arg) {
				return [createFakeTag('RESULT#1_' + arg), createFakeTag('RESULT#2_' + arg)];
			});
		});

		describe('object array config', function () {
			it('should set values to be arrays of results rather than just flat', function () {
				expect(scraper(objectArrayConfig)).to.eql({
					foo: [
						{
							bar: ['RESULT#1_#bar', 'RESULT#2_#bar'],
							baz: ['RESULT#1_#baz', 'RESULT#2_#baz']
						},
						{
							bar: ['RESULT#1_#bar', 'RESULT#2_#bar'],
							baz: ['RESULT#1_#baz', 'RESULT#2_#baz']
						}
					]
				});
			});
		});
	});

	describe('img tag results', function () {
		beforeEach(function () {
			sandbox.stub(document, 'querySelectorAll', function (arg) {
				return [createFakeTag('RESULT_' + arg, 'IMG')];
			});
		});

		it('should use an image tags src value instead of innerText', function () {
			expect(scraper(flatConfig)).to.eql({
				foo: 'SRC_RESULT_#foo',
				bar: 'SRC_RESULT_#bar',
				baz: 'SRC_RESULT_#baz'
			});
		});
	});
});