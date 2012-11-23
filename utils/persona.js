// Configuration
var nconf = require('nconf')
	, logger = require('./logger')
	, https = require('https')
	, qs = require('qs');


/*
 * The login function.
 * We need the following parameter to exists :
 *	- req.body.assertion : Persona assertion
 */
exports.auth = function(assertion, callback){
	logger.trace("internal call : utils/persona/auth");

	// Prepare the JSON to be sent to BrowserID.
	var body = qs.stringify({
		assertion: assertion,
		audience: nconf.get("audience")
	});

	// Options of the https request
	var options = {
		host: 'browserid.org',
		path: '/verify',
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'content-length': body.length
	  }
	}

	// Create the request
	var request = https.request(options, function (res){
		var data = '';
		res.setEncoding('utf-8');

		res.on('data', function (chunk){
			data += chunk;
		});

		res.on('end', function () {
			callback(JSON.parse(data));
		});
	});

	// Send the https request to browserID.
	request.write(body);
	logger.debug("request sent to browserID.");
	request.end();
};


/*
 *	The logout function.
 */
exports.logout = function (req, callback) {
	logger.trace("internal call : utils/persona/logout");
	req.session.destroy();
	if (callback) callback();
};


/*
 *	Prevent anonymous access to an other function
 */
exports.verifiedUser = function (req, resp, next) {
	logger.trace("internal call : utils/persona/verifiedUser");
	if (!req.session.email){
		resp.send(403);
	}else{
		next();
	}
};
