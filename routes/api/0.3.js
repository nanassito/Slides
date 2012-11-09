/******************************************************************************
 *                              API version 0.3                               *
 ******************************************************************************/

var route = "/api/0.3";

var persona = require('../../utils/persona.js')
	, Presentation = require('../../models/presentation.js')
	, nconf = require('nconf')
	, logger = require('../../utils/logger.js')
	;


/******************************************************************************
 *                              internal methods                              *
 ******************************************************************************/

/**
 * Return the presentation with only the selected slide.
 */
var preview = exports.preview = function (presentationId, slideId, callback){
	logger.trace("internal call : api/0.3/preview");
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
			logger.url('POST '+route+'/user/auth');
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
			logger.url('GET '+route+'/user/logout');
			next();
		},
		persona.logout
	);


	/**
	 * List all presentations form a specific user.
	 */
	app.get(route+'/list/presentations', persona.verifiedUser, function(req, res){
		logger.url('GET '+route+'/list/presentations');
		Presentation.getList(req.session.email, function(presentationList){
			res.contentType('application/json');
			res.writeHead(200);
			res.write(presentationList);
			res.end();
		});
	});//*/


	/**
	 * return a presentation
	 */
	app.get(route+'/view/:presentationId', function(req, res){
		logger.url('GET '+route+'/view/:presentationId');
		Presentation.get(req.params.presentationId, function(presentation){
			logger.debug('callback called with '+presentation);
			res.contentType('application/json');
			res.writeHead(200);
			res.write(JSON.stringify(presentation));
			res.end();
		});
	});//*/


	/**
	 * Serve a preview to the presentation with a defined slide.
	 */
	app.get(route+'/preview/:presentationId/:slideId', function(req, res){
		logger.url('GET '+route+'/preview/:presentationId/:slideId');
		preview(req.params.presentationId, req.params.slideId, function(preview){
			logger.debug('callback called with '+preview);
			res.contentType('application/json');
			res.writeHead(200);
			res.write(JSON.stringify(preview));
			res.end();
		});
	});//*/


	/**
	 * Create a new presentation
	 */
	app.put(route+'/presentation', persona.verifiedUser, function(req, res){
		logger.url('PUT '+route+'/presentation');

		if (!req.body.title || !req.body.template){
			logger.error("missing parameters.")
			res.writeHead(400);
			res.send("To create a presentation we need a title and a template");
			return;
		}

		Presentation.create(req.body.title, req.body.template, req.session.email, 
			function(presentation){
				logger.debug('callback called with '+presentation);
				res.contentType('application/json');
				res.writeHead(200);
				res.write(JSON.stringify(presentation));
				res.end();
			}
		);
	});


};
