var nconf = require('nconf')
	, mongoose = require('mongoose');

var db = mongoose.connect(nconf.get("mongoUrl"))
	, Schema = mongoose.Schema;

var slideSchema = new Schema({
	lastEdit: Date,
	content: String,
	classes: String
});

var Slide = db.model('Slide', slideSchema);

exports.schema = slideSchema;