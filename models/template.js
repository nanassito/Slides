// Configuration
var nconf = require('nconf')
	, fs = require('fs')
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
						previewUrl : 'http://'+nconf.get('audience')+'/preview/'+elmt,
					};
					return data;
				});
			callback(data);
		}
	});
};


/**
 * Return a fake presentation containing one slide with only a title.
 * The goal is to show off the template
 */
var get = exports.get = function (template, callback){
	logger.trace("internal call : models/template/get");
	callback({
		_id : "",
		title : "Title",
		author: "author",
		creationDate: new Date(),
		slides : [{content:"<h1>"+ template +"</h1><footer>by @author</footer>"}],
		template: template
	})
}