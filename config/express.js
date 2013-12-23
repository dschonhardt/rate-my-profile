/**
 * Module dependencies.
 */

var express = require('express'),
	mongoStore = require('connect-mongo')(express);

module.exports = function (app, config, passport) {

	app.set('showStackError', true);

	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}))

	app.use(express.favicon());
	app.use(express.static(config.root + '/public'));

	// don't use logger for test env
	if (process.env.NODE_ENV !== 'test') {
		app.use(express.logger('dev'));
	}

	// set views path, template engine and default layout
	app.set('views', config.root + '/app/views');
	app.engine('jshtml', require('jshtml-express'));
	app.set('view engine', 'jshtml');

	app.configure(function () {
		// cookieParser should be above session
		app.use(express.cookieParser());

		// bodyParser should be above methodOverride
		app.use(express.bodyParser());
		app.use(express.methodOverride());

		// express/mongo session storage
		app.use(express.session({
			secret: 'ratemyprofile',
			store: new mongoStore({
				url: config.db,
				collection : 'sessions'
			})
		}));

		// use passport session
		app.use(passport.initialize());
		app.use(passport.session());

		// adds CSRF support
		if (process.env.NODE_ENV !== 'test') {
			app.use(express.csrf());

			// This could be moved to view-helpers :-)
			app.use(function(req, res, next){
				res.locals.csrf_token = req.csrfToken();
				next();
			});
		}

		// routes should be at the last
		app.use(app.router)

		// assume "not found" in the error msgs
		// is a 404. this is somewhat silly, but
		// valid, you can do whatever you like, set
		// properties, use instanceof etc.
		app.use(function(err, req, res, next){
			// treat as 404
			if (err.message
				&& (~err.message.indexOf('not found')
				|| (~err.message.indexOf('Cast to ObjectId failed')))) {
				return next();
			}

			// log it
			// send emails if you want
			console.error(err.stack);

			// error page
			res.status(500).render('500', { error: err.stack });
		});

		// assume 404 since no middleware responded
		app.use(function(req, res, next){
			res.status(404).render('404', {
				url: req.originalUrl,
				error: 'Not found'
			});
		});
	});

	// development env config
	app.configure('development', function () {
		app.locals.pretty = true;
	});
};