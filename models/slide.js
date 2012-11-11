var nconf = require('nconf')
	, mongoose = require('../utils/db.js')
	, logger = require('../utils/logger.js')
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


/******************************************************************************
 *                              internal methods                              *
 ******************************************************************************/

/**
 * Make sure a slide modificaiton gets commited to the database.
 */
function persitPresentation(presentation, callback){
	logger.trace("internal call : models/slide/persitPresentation");
	presentation.markModified("slides");
	presentation.save(function (err, presentation){
		if (err){
			console.error(err);
			resp.send(500);
		}
		callback(presentation);
	});
};


/******************************************************************************
 *                               public methods                               *
 ******************************************************************************/

/**
 * Get a specific presentation given its Id
 */
var get = exports.get = function(slideId, callback){
	logger.trace("model call : models/slide/get");
	Slide.findById(slideId, function(err, slide){
		if (err){
			console.error("slide.get got an error fetching the slide.");
			throw err;

		}else if(!slide){
			throw "slide.get could not find the slide."+slideId;

		}else{
			callback( slide );
		}
	});
};


/**
 * Create a new presentation given its author, title and template
 * position is 0-based
 */
var create = exports.create = function(presentation, position, data, callback){
	logger.trace("model call : models/slide/create");

	if (!presentation || typeof(position) === "undefined"){
		logger.error("missing parameters.")
		return;
	}

	var content = data.content || "<h2>New slide</h2>";
	var classes = data.classes || "";

	var slide = new Slide({
			'lastEdit': new Date,
			'content': content,
			'classes': classes
		});

	presentation.slides.splice(position, 0, slide);

	persitPresentation(presentation, function(presentation){
		callback(slide);
	});
};


/**
 * Update a slide
 */
var update = exports.update = function(slide, newData, callback){
	logger.trace("model call : models/slide/update");

	slide.lastEdit = new Date();
	if (newData.content){
		slide.content = newData.content;
	};
	if (newData.classes){
		slide.classes = newData.classes;
	};

	persitPresentation(slide.parent(), function(presentation){
		callback(slide);
	});
};