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
var list = exports.list = function(user, callback){
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
var getList = exports.getList = function(user, callback){
	logger.trace("internal call : models/presentation/getList");
	logger.warn("deprecated call : models/presentation/getList");
	list(user, callback);
}

/**
 * Get a specific presentation given its Id
 */
var get = exports.get = function(presentationId, callback){
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
var create = exports.create = function(data, callback){
	logger.trace("internal call : models/presentation/create");

}