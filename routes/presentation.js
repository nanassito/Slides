// Configuration
var nconf = require('nconf'),
	mongoose = require('mongoose');


// Schema definition
var db = mongoose.connect('mongodb://localhost/Slides'),
	Schema = mongoose.Schema;

var slideSchema = new Schema({
	lastEdit: Date,
	content: String
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


/*
 * Return a presentation as an html file.
 * We need the following parameter to exists :
 *	- req.params.user_id : email adress of the user that own the presentation
 *	- req.params.title_id : title of the presentation
 */
exports.getPresentation = function (req, resp) {
	Presentation.findOne({'_id':req.params.presentation_id}, 
							function(err, doc){
		if (err){
			console.error(err);
			resp.writeHead(500);
		}else{
			var presentation = "";
			presentation = doc.title;
			//TODO : render the full page before sending
			resp.contentType('text/html');
			resp.writeHead(200);
			resp.write(presentation);
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
						'preview' : "" // FIXME : render and add the preview.
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
	}else{

		var presentation = new Presentation;
		presentation.title = req.body.title;
		presentation.author = req.session.email;
		presentation.creationDate = new Date;
		presentation.template = req.body.template;
	
		presentation.save(function(err){
			if(err){
				console.error("Creation of the new presentation failed.");
				resp.writeHead(500);
			}else{
				console.log("New presentation created.");
				// TODO : render and return the new presentation
				resp.writeHead(200);
			}
		});
	
		resp.end();
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
