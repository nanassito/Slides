// Configuration
var nconf = require('nconf');

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
 *	[
 *		{
 *			title : title of the presentation,
 *			preview : image of the first slide
 *		},…
 *	]
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
};
