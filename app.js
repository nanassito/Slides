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

app.get('/', routes.index);
app.post('/user/auth', routes.persona.auth);
app.get('/user/logout', routes.persona.logout);

app.get('/presentation/:presentation_id', routes.presentation.getPresentation);
app.post('/presentation/:presentation_id', verifiedUser, 
												routes.presentation.saveSlide);
app.post('/new/presentation',verifiedUser, routes.presentation.newPresentation);

app.get('/list/presentations', verifiedUser, routes.presentation.getList);
app.get('/list/templates', routes.template.getList);

app.get('/test', function(req, res){res.render('splash')});
app.get('/test/list/presentations', function(req, res){res.render('home', 
	{ presentations: [
		{	id: "presentationID1", 
			title: "Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1Title of the presentation 1",
			templateUrl: "/template/test1.css",
			lastEdit: "Thu Sep 27 2012", 
			firstSlide: "<h1>Title 1</h1><p>test</p>"},
		{	id: "presentationID2", 
			title: "Title of the presentation 2",
			templateUrl: "/template/test2.css",
			lastEdit: "Thu Sep 27 2012", 
			firstSlide: "<h1>Title 2</h1><p>test</p>"},
		{	id: "presentationID3", 
			title: "Title of the presentation 3",
			templateUrl: "/template/test3.css",
			lastEdit: "Thu Sep 27 2012", 
			firstSlide: "<h1>Title 3</h1><p>test</p>"},
]});});
app.get('/test/presentation/:presentationId', function(req, res){
	res.render('edit', {
		title:"Titre de la présentation",
		templateUrl:"/template/test1.css",
		slides:[
			{	slideId:'slide1',
				classes:"first",
				content:"<h1>Titre de la présentation</h1><p>dorian@jaminais.fr</p>"},
			{	slideId:'slide2',
				classes:"",
				content:"<h2>Sommaire</h2><ol><li>Un peu de code</li><li>Une grande image</li><li>Une vidéo ?</li><li>Du texte normal</li><li>2 colonnes</li></ol>"},
			{	slideId:'slide3',
				classes:"code",
				content:"<script src=\"https://gist.github.com/3834416.js?file=test.js\"></script>"},
			{	slideId:'slide4',
				classes:"image",
				content:"<img src=\"http://allsizewallpapers.files.wordpress.com/2012/08/follow-your-curiosity-msl-mars-landing-ipad2_1024x1024.jpg\"/>"},
			{	slideId:'slide5',
				classes:"video",
				content:"<video controls=\"\" src=\"http://videos-cdn.mozilla.net/brand/Mozilla_Firefox_Manifesto_v0.2_640.webm\"></video>"},
			{	slideId:'slide6',
				classes:"",
				content:"<h2>Du texte normal</h2><p>Apps outside of the core media and productivity suite have distinct identities.</p><p>Our aim was to balance sophistication with the approachability skeuomorphic design brings, textures are subtle and forms are stylized. A variety in bright highlight colours bring warmth and soul to each application.</p>"},
			{	slideId:'slide7',
				classes:"",
				content:"<h2>Firefox OS</h2><section class=\"left\"><ul><li>Fast</li><li>Awesome</li><li>Beautiful</li></ul></section><section class=\"right\"><img src=\"http://www.lacofa.es/wp-content/uploads/2012/07/MozillaMobileFirefoxOS.jpg\"/></section>"}
		]
	});
});


app.listen(3000); // FIXME : use nconf 
console.log("Express server listening on port %d in %s mode", 
										app.address().port, app.settings.env);
