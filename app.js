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

var express = require('express')
  , routes = require('./routes')
  , jade = require('jade')
  , fs = require('fs')
  , Presentation = require('./models/presentation.js')
  ;

var app = module.exports = express.createServer();


app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: nconf.get("secret")}));
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('view options', { layout: false });
	app.set('views', nconf.get('basedir') + '/views');
	app.use(express.static(nconf.get('basedir') +'/client'));
	app.use('/template', express.static(nconf.get('basedir') +'/templates'));
	app.use('/static', express.static(nconf.get('basedir') +'/static'));
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

//app.get('/presentation/:presentation_id', routes.presentation.getPresentation);
//app.post('/presentation/:presentation_id', verifiedUser, 
//												routes.presentation.saveSlide);
//app.post('/new/presentation',verifiedUser, routes.presentation.newPresentation);
//
//app.get('/list/presentations', verifiedUser, routes.presentation.getList);
//app.get('/list/templates', routes.template.getList);


/**
 * Login a user
 */
app.post('/user/auth', routes.persona.auth);

/**
 * Logout the user
 */
app.get('/user/logout', routes.persona.logout);




/******************************************************************************
 *                                 Public API                                 * 
 ******************************************************************************/

/**
 * setup API 0.3
 */
var API0_3 = require("./routes/api/0.3.js");
API0_3.setUp(app);


/******************************************************************************
 *                              Rendering calls                               * 
 ******************************************************************************/

/**
 * Serve the main screen where the user log in.
 */
app.get('/', function(req, res){
	console.info('/');
	res.render('splash')
});


/**
 * Serve the page displaying the list of all user's presentations.
 */
app.get('/list/presentations', verifiedUser, function(req, res){
	console.info('/list/presentations');
	Presentation.getList(req.session.email, function(presentationList){
		res.render( 'home', { 'presentations' : presentationList } );
	});
});


/**
 * Serve the presentation for everyone to see
 */
app.get('/view/:presentationId', function(req, res){
	console.info('/view/:presentationId');
	Presentation.get(req.params.presentationId, function(presentation){
		res.render('presentation', presentation);
	});
});


/**
 * Serve a preview to the presentation with a defined slide.
 */
app.get('/preview/:presentationId/:slideId', function(req, res){
	console.info('/preview/:presentationId/:slideId');
	API0_3.preview(req.params.presentationId,req.params.slideId,function(preview){
		res.render('presentation', preview);
	});
});


/**
 * Serve the edit mode of a presentation
 */
app.get('/edit/:presentationId', verifiedUser, function(req, res){
	console.info('/edit/:presentationId');
	Presentation.get(req.params.presentationId, function(presentation){
		res.render('edit', {
			'_id' : presentation._id,
			'title': presentation.title,
			'author': presentation.author,
			'creationDate': presentation.creationDate,
			'url': 'http://'+nconf.get('audience')+'/view/'+presentation._id,
			'template': presentation.template,
			'slides': presentation.slides.map(function(elmt, idx, array){
				elmt.url = 'http://'+nconf.get('audience')+'/preview/'+presentation._id+
																																	 '/'+elmt._id;
				return elmt;
			})
		});
	});
});



/******************************************************************************
 *                              Start the server                              * 
 ******************************************************************************/

app.listen(3000); // FIXME : use nconf 
console.log("Express server listening on port %d in %s mode", 
										app.address().port, app.settings.env);
