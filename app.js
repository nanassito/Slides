/**
 * Initialize the application configuration
 */

var nconf = require('nconf');

// absolute config, this will never change
nconf.overrides({
    basedir : __dirname
});

// nconf gives priority to arguments, then environment variables
// then the config file and then the defaults.
nconf.argv().env().file({ file:'./config.json' });
nconf.defaults({});


/**
 * Module dependencies.
 */
 
var express = require('express'),
	sessions = require('client-sessions');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

// session support using signed cookies, also no caching of api requests
app.use(function (req, res, next) {
	if (/^\/api/.test(req.url)) {
		res.setHeader('Cache-Control', 'no-cache, max-age=0');

		return sessions({
			cookieName: 'Slides',
			secret: process.env['COOKIE_SECRET'] || 'define a real secret, please',
			cookie: {
				path: '/api',
				httpOnly: true
			}
		})(req, res, next);
	} else {
		return next();
	}
});


// static folders, should always be the last thing we configure.
app.use(express.static(nconf.get('basedir') +'/client'));
app.use("/", // compile to /*.html
		express.static(nconf.get('basedir') +'/client/html')); 

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
