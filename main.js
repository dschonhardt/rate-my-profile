var scanner = require('./lib/scanner')
scanner.open()
	.then(function () {
		return scanner.scan('syzdom');
	})
	.then(function (result) {
		console.log(result);
	})
	.finally(scanner.exit);