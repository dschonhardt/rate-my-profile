exports = module.exports = function (app) {
	[
		'./user',
		'./snapshot'
	].forEach(function (model) {
		require(model);
	});
};