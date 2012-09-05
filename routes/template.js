// Configuration
var nconf = require('nconf');


/*
 * Return the list of all available templates.
 * returned object = {
 *	[
 *		{
 *			url : url of the template,
 *			preview : image of the template
 *		},…
 *	]
 * }
 */
exports.getList = function (req, resp) {
	console.error("Not implemented.");
};


/*
 * Return a template as an html file.
 * We need the req.params.name of the template.
 */
exports.getTemplate = function (req, resp) {
	console.error("Not implemented.");
};
