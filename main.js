var app = express();
var scanner = require('./lib/scanner');

app.get('/', routes.index);
app.get('/users', user.list);

scanner.open();

var okcupidProfiles = [];


app.get('/:profile/:name', function (req, res) {
	var profile,
		result = _.find(okcupidProfiles, { username: req.params.username });

	if (result) {
		res.send(result);
		return;
	}
	console.log('scanning');
	profile = require('./lib/profiles/' + req.params.profile);

	scanner.scan(profile.url(req.params.name), profile.config())
		.then(function (result) {
			okcupidProfiles.push(result);
			res.send(result);
		})
		.finally(scanner.exit);

});