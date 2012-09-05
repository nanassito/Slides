// Configuration
var nconf = require('nconf');

nconf.overrides({
	basedir : __dirname
});

// nconf gives priority to arguments, then environment variables
// then the config file and then the defaults.
nconf.argv().env().file({ file:'./config.json' });

nconf.defaults({
	audience : "http://localhost:3000",
	secret : "A very secret key"
});


/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();


app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: nconf.get("secret")}));
	app.use(app.router);
	app.use(express.static(nconf.get('basedir') +'/client'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.post('/user/auth', routes.persona.auth);
app.get('/user/logout', routes.persona.logout);

app.get('/presentation/:presentation_id', routes.presentation.getPresentation);
app.post('/presentation/:title', routes.presentation.saveSlide);
app.post('/new/presentation', routes.presentation.newPresentation);
app.get('/list/presentations', routes.presentation.getList);

app.get('/list/templates', routes.template.getList);
app.get('/template/:name', routes.template.getTemplate);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
