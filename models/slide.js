var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	;

var db = mongoose.db
	, Schema = mongoose.Schema
	;

var slideSchema = exports.schema = new Schema({
	lastEdit: Date,
	content: String,
	classes: String
});

var Slide = exports.model = db.model('Slide', slideSchema);