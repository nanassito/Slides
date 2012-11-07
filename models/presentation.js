var nconf = require('nconf')
	, mongoose = require('mongoose')
	, Slide = require('./slide');

var db = mongoose.connect(nconf.get("mongoUrl"))
	, Schema = mongoose.Schema;

var presentationSchema = new Schema({
	title: String,
	author: String,
	creationDate: Date,
	slides: [Slide.schema],
	template: String
});

var Presentation = db.model('Presentation', presentationSchema);

exports.schema = presentationSchema;

exports.getList = function(user){
	Presentation.find({'author': user}, "title _id", function(err, docs){
		if (err){
			console.error("presentation.getList got an error fetching datas.");
			throw err;

		}else{
			var data = docs.maps(function(elmt, idx, array){
				return {
					id: elmt._id,
					title: elmt.title,
					url: nconf.get('audience')+'/presentation/'+elmt._id
				}
			});
		}
	});
}