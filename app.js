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
  , Presentation = require('./models/presentation.js');

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



app.post('/user/auth', routes.persona.auth);
app.get('/user/logout', routes.persona.logout);

app.get('/', function(req, res){res.render('splash')});

app.get('/list/presentations', verifiedUser, function(req, res){
	Presentation.getList(req.session.email, function(presentationList){
		res.render( 'home', { 'presentations' : presentationList } );
	});
});

app.get('/view/:presentationId', function(req, res){
	Presentation.get(req.params.presentationId, function(presentation){
		res.render('presentation', presentation);
	})
})





app.get('/test/presentation/:presentationId', function(req, res){
	res.render('edit', {
		title:"Titre de la présentation",
		templateUrl:"/template/simple.css",
		slides:[
			{	slideId:'slide1',
				classes:"",
				content:"<h1>My Presentation</h1><footer>by John Doe</footer>"},
			{	slideId:'slide2',
				classes:"",
				content:"<p>Some random text: But I've never been to the moon! You can see how I lived before I met you. Also Zoidberg. I could if you hadn't turned on the light and shut off my stereo.</p>"},
			{	slideId:'slide3',
				classes:"",
				content:"<h3>An incremental list</h3><ul class=\"incremental\"><li>Item 1<li>Item 2<li>Item 3</ul><div role=\"note\">Some notes. They are only visible using onstage shell.</div>"},
			{	slideId:'slide4',
				classes:"",
				content:"<blockquote>Who's brave enough to fly into something we all keep calling a death sphere?</blockquote><details><p>In the onstage shell, notes scroll rather than overflow:</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac dui eu est feugiat lacinia sit amet nec leo. Mauris eu ipsum leo. Nulla mi odio, cursus sed sollicitudin non, fringilla id magna. Suspendisse sit amet posuere elit. Maecenas iaculis, turpis a placerat imperdiet, libero lorem feugiat nisi, nec tincidunt diam nibh sit amet massa. Vestibulum quis adipiscing tellus. Maecenas sollicitudin sodales pulvinar. Donec dui ipsum, bibendum facilisis consequat interdum, tempus ut mauris. Aliquam ut dolor nec odio scelerisque bibendum quis in neque. Aliquam dui dui, pulvinar quis fermentum quis, gravida eu augue. Nunc tristique dolor a urna pulvinar bibendum. Curabitur mollis cursus neque, in scelerisque metus porta non. Donec tempor enim in nibh vestibulum et convallis nisi malesuada. Duis ut lectus sed metus venenatis porttitor id pharetra quam. Suspendisse sapien turpis, ornare in molestie et, gravida eget turpis.</p></details>"},
			{	slideId:'slide5',
				classes:"",
				content:"<h2>Part two</h2>"},
			{	slideId:'slide6',
				classes:"",
				content:"<figure><img src=\"http://placekitten.com/g/800/600\"><figcaption>An image</figcaption></figure><div role=\"note\">Kittens are so cute!</div>"},
			{	slideId:'slide7',
				classes:"",
				content:"<figure><video src=\"http://videos-cdn.mozilla.net/brand/Mozilla_Firefox_Manifesto_v0.2_640.webm\" poster=\"http://www.mozilla.org/images/about/poster.jpg\"></video><figcaption>A video</figcaption></figure>"},
			{	slideId:'slide8',
				classes:"",
				content:"<h2>End!</h2>"},
		]
	});
});


app.listen(3000); // FIXME : use nconf 
console.log("Express server listening on port %d in %s mode", 
										app.address().port, app.settings.env);
