var https = require('https'),
	nconf = require('nconf'),
	fs = require('fs');

var index_page = fs.readFileSync( nconf.get('basedir')+'/client/html/index.html' ).utf8Slice();

/*
 * home page.
 */
exports.index = function(req, resp){
	resp.send(index_page);
};

exports.persona = require("./persona.js");
exports.presentation = require("./presentation.js");
exports.template = require("./template.js");
