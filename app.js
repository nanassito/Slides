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
 
var express = require('express')
  , routes = {};

var app = module.exports = express.createServer();

// Configuration

var theme = nconf.get('theme');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(nconf.get('basedir') +'/client'));
    app.use("/", // compile to /*.html
    		express.static(nconf.get('basedir') +'/client/html')); 
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

//app.get('/', );
//app.get('/new/article', routes.article.form_new);
//app.post('/new/article', routes.article.save);
//app.get('/article/:title', routes.article.view);

app.get('/test', function(req, res){
	res.send('hello world');
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
