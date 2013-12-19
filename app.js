
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('lodash');

var scanner = require('./lib/scanner');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jshtml');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
