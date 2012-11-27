var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	, Slide = require('./slide')
	, logger = require('../utils/logger.js')
	;

var db = mongoose.db
	, Schema = mongoose.Schema
	;

var presentationSchema = exports.schema = new Schema({
	title: String,
	author: String,
	creationDate: Date,
	slides: [Slide.schema],
	template: String
});

var Presentation = exports.model = db.model('Presentation', presentationSchema);



/**
 * List all presentation for a given user
 */
var list = exports.list = function(user, callback){
	logger.trace("model call : models/presentation/list");
	Presentation.find({'author': user}, "title _id slides", function(err, docs){
		if (err){
			console.error("presentation.list got an error fetching datas.");
			throw err;

		}else{
			callback( docs.map(function(elmt, idx, array){
				return {
					id: elmt._id,
					title: elmt.title,
					url: 'http://'+nconf.get('audience')+'/view/'+elmt._id,
					previewUrl: 'http://'+nconf.get('audience')+'/preview/'+elmt._id+'/'
																														 +elmt.slides[0]._id
					};
			}));
		}
	});
}
var getList = exports.getList = function(user, callback){
	logger.trace("model call : models/presentation/getList");
	logger.warn("deprecated call : models/presentation/getList");
	list(user, callback);
}


/**
 * Get a specific presentation given its Id
 */
var get = exports.get = function(presentationId, callback){
	logger.trace("model call : models/presentation/get");
	Presentation.findById(presentationId, function(err, presentation){
		if (err){
			console.error("presentation.get got an error fetching the presentation.");
			throw err;

		}else if(!presentation){
			throw "presentation.get could not find the presentation."+presentationId;

		}else{
			callback( presentation );
		}
	});
}


/**
 * Create a new presentation given its author, title and template
 */
var create = exports.create = function(title, template, author, callback){
	logger.trace("model call : models/presentation/create");

	var presentation = new Presentation({
			'title': title,
			'author': author,
			'creationDate': new Date,
			'template': template,
			'slides': []
		});

	presentation.save(function(err, presentation){
		if (err){
			logger.error('Something went wrong while saving a new presentation');
			throw err;
		
		}else if(!presentation){
			var e = "Can't find the recently created presentation";
			logger.error(e);
			throw e;
		
		}else{
			// Add a default slide to the presentation
			Slide.create(
				presentation, 
				0, 
				{content:"<h1>"+title+"</h1><footer>"+author+"</footer>"}, 
				function(slide){
					// Presentation created, slide added, we send it back
					callback(presentation);
				}
			);
		}
	});
}