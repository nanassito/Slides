/******************************************************************************
 *                              API version 0.3                               *
 ******************************************************************************/

var route = "/api/0.3";

var persona = require('../../utils/persona.js')
	, Presentation = require('../../models/presentation.js')
	. nconf = require('nconf')
	;


/******************************************************************************
 *                              internal methods                              *
 ******************************************************************************/

/**
 * Return the presentation with only the selected slide.
 */
function preview(presentationId, slideId, callback){
	console.log("internal call : api/0.3/preview");
	Presentation.get(presentationId, function(presentation){
		callback({
			'_id' : presentation._id,
			'title': presentation.title,
			'author': presentation.author,
			'creationDate': presentation.creationDate,
			'url': 'http://'+nconf.get('audience')+'/view/'+presentation._id,
			'template': presentation.template,
			'slides': presentation.slides.filter(function(elmt, idx, array){
				return elmt._id == slideId;
			})
		});
	});
};
exports.preview = preview;


/******************************************************************************
 *                                 Public API                                 *
 ******************************************************************************/

exports.setUp = function(app){
	
	/**
	 * Login a user
	 */
	app.post(
		route+'/user/auth', 
		function(req, res, next){
			console.info(route+'/user/auth');
			next();
		}, 
		persona.auth
	);


	/**
	 * Logout the user
	 */
	app.get(
		route+'/user/logout', 
		function(req, res, next){
			console.info(route+'/user/logout');
			next();
		},
		persona.logout
	);


	/**
	 * List all presentations form a specific user.
	 * /
	app.get(route+'/list/presentations', persona.verifiedUser, function(req, res){
		console.info(route+'/list/presentations');
		Presentation.getList(req.session.email, function(presentationList){
			res.contentType('application/json');
			res.writeHead(200);
			res.write(presentationList);
			res.end();
		});
	});//*/


	/**
	 * return a presentation
	 * /
	app.get(route+'/view/:presentationId', function(req, res){
		console.info(route+'/view/:presentationId');
		Presentation.get(req.params.presentationId, function(presentation){
			res.contentType('application/json');
			res.writeHead(200);
			res.write(presentation);
			res.end();
		});
	});//*/


	/**
	 * Serve a preview to the presentation with a defined slide.
	 * /
	app.get(route+'/preview/:presentationId/:slideId', function(req, res){
		console.info(route+'/preview/:presentationId/:slideId');
		preview(req.params.presentationId, req.params.slideId, function(preview){
			res.contentType('application/json');
			res.writeHead(200);
			res.write(preview);
			res.end();
		});
	});//*/


};
