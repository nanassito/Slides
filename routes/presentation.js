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
 *	- req.params.user : email adress of the user that own the presentation
 *	- req.params.title : title of the presentation
 */
exports.getPresentation = function (req, resp) {
	console.error("Not implemented.");
};


/*
 * Return the list of all the presentations belongings to the user.
 * returned object = {
 *	[{
 *		title : title of the presentation,
 *		preview : image of the first slide
 *	},…]
 * }
 */
exports.getList = function (req, resp) {
	console.warn("This function is a work in progress.");
	
	Presentation.find({}, function(err, docs){
		console.log(docs);
	});
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
 *	- req.params.slide : slide identifier
 */
exports.saveSlide = function (req, resp) {
	console.error("Not implemented.");
	// When the modified slide is the first one, we need to change the page
	// title in Presentation.start and in Presentation.title
};
