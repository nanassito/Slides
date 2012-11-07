var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	, Slide = require('./slide')
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

exports.getList = function(user, callback){
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

exports.get = function(presentationId, callback){
	Presentation.findById(presentationId, function(err, presentation){
		if (err){
			console.error("presentation.get got an error fetching the presentation.");
			throw err;

		}else{
			callback( presentation );
		}
	});
}