/******************************************************************************
 *                              API version 0.3                               *
 ******************************************************************************/

var route = "/api/0.3";

var persona = require('../../utils/persona.js')
	, Presentation = require('../../models/presentation.js')
	;

/******************************************************************************
 *                                 Public API                                 *
 ******************************************************************************/

exports.setUp = function(app){
	
	/**
	 * Login a user
	 */
	app.post(route+'/user/auth', persona.auth);


	/**
	 * Logout the user
	 */
	app.get(route+'/user/logout', persona.logout);


	/**
	 * List all presentations form a specific user.
	 */
	app.get(route+'/list/presentations', persona.verifiedUser, function(req, res){
		list_presentations(req.session.email, function(presentationList){
			res.contentType('application/json');
			res.writeHead(200);
			res.write(presentationList);
			res.end();
		});
	});


};


/******************************************************************************
 *                              internal methods                              *
 ******************************************************************************/

exports.methods = {
	/**
 	 * List all presentations form a specific user.
 	 */
	list_presentations : function(user, callback){
		Presentation.getList(user, function(presentationList){
			callback(presentationList);
		});
	},


}