var sandbox;

scanner = require('../../../lib/sites/okcupid');

describe('okcupid', function () {
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	// TODO

});