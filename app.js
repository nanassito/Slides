// Testing only
function updateRevNumber(){
	var fs = require('fs'),
		info = JSON.parse(fs.readFileSync("package.json").toString());
	
	version = info.version.split('.', 3);
	info.version = version[0]+'.'+version[1]+'.'+(new Date()).toJSON();

	console.log("Using version "+info.version);
	
	fs.writeFileSync("package.json", JSON.stringify(info, undefined, 4));
}


// Configuration
var nconf = require('nconf');

nconf.overrides({
	basedir : __dirname
});

// nconf gives priority to arguments, then environment variables
// then the config file and then the defaults.
nconf.argv().env().file({ file:'./config.json' });

nconf.defaults({
	'audience' : "http://localhost:3000",
	'secret' : "A very secret key",
	'mongoUrl' : "mongodb://localhost/Slides"
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
	app.use('/template', express.static(nconf.get('basedir') +'/templates'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	updateRevNumber();
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes
var verifiedUser = routes.persona.verifiedUser;

app.get('/', routes.index);
app.post('/user/auth', routes.persona.auth);
app.get('/user/logout', routes.persona.logout);

app.get('/presentation/:presentation_id', routes.presentation.getPresentation);
app.post('/presentation/:presentation_id', verifiedUser, 
												routes.presentation.saveSlide);
app.post('/new/presentation',verifiedUser, routes.presentation.newPresentation);

app.get('/list/presentations', verifiedUser, routes.presentation.getList);
app.get('/list/templates', routes.template.getList);

app.get('/test/:schema', routes.presentation.test);

app.listen(3000); // FIXME : use nconf 
console.log("Express server listening on port %d in %s mode", 
										app.address().port, app.settings.env);
