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
						url: 'http://'+nconf.get('audience')+'/presentation/'+elmt._id
					};
			}));
		}
	});
}