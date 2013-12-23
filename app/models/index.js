exports = module.exports = function (app) {
	[
		'./user'
	].forEach(function (model) {
		require(model);
	});
}