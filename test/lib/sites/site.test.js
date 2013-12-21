var sandbox;

scanner = require('../../../lib/sites/site');

describe('site', function () {
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	// TODO

});