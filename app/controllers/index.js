exports = module.exports = function (app) {
	[
		'./users',
		'./snapshots'
	].forEach(function (controller) {
		require(controller).bind(app);
	});
}