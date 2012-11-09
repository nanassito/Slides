// Configuration
var nconf = require('nconf')
	, fs = require('fs')
	, jade = require('jade')
	, logger = require('../utils/logger.js')
	;


/**
 * Return the list of all available templates.
 * returned object = [
 *	url of the template,…
 * ]
 */
var list = exports.list = function (callback) {
	logger.trace("internal call : models/template/list");
	fs.readdir(nconf.get('basedir')+"/templates", function(err, files){
		if (err){
			logger.error("Something went wrong when listing the templates.");
			throw err;
		}else{
			var data = files
				.filter(function(elmt, idx, array){
					return elmt.substr(-4, 4) == ".css"
				})
				.map(function(elmt, idx, array){
					var data = {
						name : elmt,
						previewUrl : generatePreviewUrl(elmt)
					};
					return data;
				});
			callback(data);
		}
	});
};

function generatePreviewUrl(template){
	logger.trace("internal call : models/template/generatePreviewUrl");
	var render = jade.compile(
												fs.readFileSync('views/presentation.jade').utf8Slice());
	var data = render({
		_id : "",
		title : "",
		author: "",
		creationDate: new Date(),
		slides : [{content:"<h1>"+ template +"</h1>"}],
		template: template
	});
	return "data:text/html;charset=utf-8,"+escape(data);
}