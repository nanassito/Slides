var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	, Slide = require('./slide')
	, logger = require('../utils/logger.js')
	;

var db = mongoose.db
	, Schema = mongoose.Schema
	;

var presentationSchema = new Schema({
	title: String,
	author: String,
	creationDate: Date,
	slides: [Slide.schema],
	template: String
});

var Presentation = db.model('Presentation', presentationSchema);

exports.model = Presentation;

exports.schema = presentationSchema;

/**
 * List all presentation for a given user
 */
exports.getList = function(user, callback){
	logger.trace("internal call : models/presentation/getList");
	Presentation.find({'author': user}, "title _id", function(err, docs){
		if (err){
			console.error("presentation.getList got an error fetching datas.");
			throw err;

		}else{
			callback( docs.map(function(elmt, idx, array){
				return {
					id: elmt._id,
					title: elmt.title,
					url: 'http://'+nconf.get('audience')+'/view/'+elmt._id
					};
			}));
		}
	});
}

/**
 * Get a specific presentation given its Id
 */
exports.get = function(presentationId, callback){
	logger.trace("internal call : models/presentation/get");
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
exports.new = function(data, callback){
	logger.trace("internal call : models/presentation/new");

}