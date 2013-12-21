exports = module.exports = function (app) {
	[
		'users'
	].forEach(function (controller) {
		require('./' + controller)(app);
	});
}