var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	;

var db = mongoose.db
	, Schema = mongoose.Schema
	;

var slideSchema = new Schema({
	lastEdit: Date,
	content: String,
	classes: String
});

var Slide = db.model('Slide', slideSchema);

exports.schema = slideSchema;