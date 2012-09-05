// Configuration
var nconf = require('nconf'),
	mongoose = require('mongoose'),
	jade = require('jade'),
	fs = require('fs');


// Schema definition
var db = mongoose.connect('mongodb://localhost/Slides'),
	Schema = mongoose.Schema;

var slideSchema = new Schema({
	lastEdit: Date,
	content: String,
	classes: String
});

var presentationSchema = new Schema({
	title: String,
	author: String,
	creationDate: Date,
	slides: [slideSchema],
	template: String
});

var Slide = db.model('Slide', slideSchema),
	Presentation = db.model('Presentation', presentationSchema);

// caching the presentation template to use in jade.
// Call this to render a presentation
var render = jade.compile(
					fs.readFileSync('templates/presentation.html').utf8Slice());

// caching the new slide template to use in jade.
// Call this to render a new Slide
var renderNewSlide = jade.compile(
					fs.readFileSync('templates/new slide.html').utf8Slice());




/*
 * Return a presentation as an html file.
 * We need the following parameter to exists :
 *	- req.params.user_id : email adress of the user that own the presentation
 *	- req.params.title_id : title of the presentation
 */
exports.getPresentation = function (req, resp) {
	Presentation.findOne({'_id':req.params.presentation_id}, 
							function(err, presentation){
		if (err){
			console.error(err);
			resp.writeHead(500);
		}else if(!presentation){
			console.error("Presentation %s does not exists",
													req.params.presentation_id);
			resp.writeHead(404);
		}else{
			resp.contentType('text/html');
			resp.writeHead(200);
			resp.write(render(presentation));
		}
		resp.end();
	});
};


/*
 * Return the list of all the presentations belongings to the user.
 * We need the following parameter to exists :
 *	- req.session.email : email of the logged in user.
 * returned object = {
 *	[{
 *		_id : id of the presentation,
 *		title : title of the presentation,
 *		preview : html page with only the first slide included
 *	},…]
 * }
 */
exports.getList = function (req, resp) {
	if (!req.session.email){
		// Only a logged in user can list his presentations
		resp.writeHead(403);
		resp.end();
	}else{
		
		Presentation.find({'author': req.session.email}, "title slides template, _id", function(err, docs){
			var data = [];
		
			if (err){
				console.error(err);
				resp.writeHead(500);
			}else{
				for (var i=0, doc; doc = docs[i]; i++){
					data[i] = {
						'id' : doc._id,
						'title' : doc.title,
						'template' : doc.template,
						'firstSlide' : doc.slides[0].content
					};
				}
				resp.contentType('application/json');
				resp.writeHead(200);
			}
	
			resp.write(JSON.stringify(data));
			resp.end();
		});
	}
};


/*
 * Create a new presentation
 * We need the following parameter to exists :
 *	- req.body.title : title of the new presentation
 *	- req.body.template : url of the template to use.
 */
exports.newPresentation = function (req, resp) {
	if (!req.session.email){
		// Only a logged in user can create presentation
		resp.writeHead(403);
		resp.end();
	}else if(!req.body.title || !req.body.template){
		resp.writeHead(400);
		resp.end();
	}else{

		var presentation = new Presentation({
			'title': req.body.title,
			'author': req.session.email,
			'creationDate': new Date,
			'template': req.body.template
		});
		
		presentation.slides[0] = new Slide({
			'lastEdit': new Date,
			'classes':"First",
			'content': renderNewSlide({
				'title': req.body.title,
				'author': req.session.email
			})
		});
		
		// save the new slide, if it worked, save and return the presentation.
		presentation.slides[0].save(function(err){
			if(err){
				console.error("Creation of a new slide failed.");
				resp.writeHead(500);
				resp.end();
			}else{
				console.log("New Slide created");
				// now save, render and return the presentation
				
				presentation.save(function(err){
					if(err){
						console.error("Creation of a new presentation failed.");
						resp.writeHead(500);
					}else{
						console.log("New presentation created : %s",
															presentation.title);
						resp.contentType('text/html');
						resp.writeHead(200);
						console.log(presentation.slides); // debug
						resp.write(render(presentation));
					}
					resp.end();
				});
			}
		});
	}
};


/*
 * Save a slide of an existing presentation
 * We need the following parameter to exists :
 *	- req.params.user : email adress of the user that own the presentation
 *	- req.params.title : title of the presentation being edited
 */
exports.saveSlide = function (req, resp) {
	console.error("Not implemented.");
	// When the modified slide is the first one, we need to change the page
	// title in Presentation.start and in Presentation.title
};
