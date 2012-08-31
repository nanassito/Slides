// Configuration
var nconf = require('nconf'),
	mongoose = require('mongoose');


// Schema definition
var db = mongoose.connect('mongodb://localhost/Slides'),
	Schema = mongoose.Schema;

var Slide = new Schema({
	lastEdit: Date,
	content: String
});

var Presentation = new Schema({
	title: String,
	author: String,
	creationDate: Date,
	start: String,
	slides: [Slide],
	end: String
});


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
	console.error("Not implemented.");
};


/*
 * Create a new presentation
 */
exports.newPresentation = function (req, resp) {
	console.error("Not implemented.");
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
