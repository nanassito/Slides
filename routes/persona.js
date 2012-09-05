// Configuration
var nconf = require('nconf'),
	https = require('https'),
    qs = require('qs');


/*
 * The login function.
 * We need the following parameter to exists :
 *	- req.body.assertion : Persona assertion
 */
exports.auth = function(req, resp){

	/**
	 * Receive the response from browserid.org to tell whether 
	 * the assertion is a valid one or a fake.
	 */
	function onVerifyResp(bidRes) {
		var data = "";
		bidRes.setEncoding('utf8');
		
		bidRes.on('data', function (chunk) {
			data += chunk;
		});
		
		bidRes.on('end', function () {
			var verified = JSON.parse(data);
			resp.contentType('application/json');
			if (verified.status == 'okay') {
				req.session.email = verified.email;
				console.info(req.session.email + " is now signed in");
	    	} else {
				console.error(verified.reason);
				resp.writeHead(403);
			}
			resp.write(data);  // data is the JSON from browserid
			resp.end();
		});
	};

	// Retrieve the assertion and prepare a JSON to be sent to browserid.org
	var assertion = req.body.assertion;
	var body = qs.stringify({
		assertion: assertion,
		audience: nconf.get("audience")
	});
	// Prepare the https request and then it to browserid.org. The response will
	// be handled by onVerifyResp
	var request = https.request({
		host: 'browserid.org',
		path: '/verify',
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'content-length': body.length
	  	}
	}, onVerifyResp);
	request.write(body);
	console.log("Sending the assertion to browserid.org");
	request.end();
};


/*
 *	The logout function.
 */
exports.logout = function (req, resp) {
	console.info("Signing out "+ req.session.email);
	req.session.destroy();
	// TODO : Verify that destroying the session does not prevent from logging 
	// in again
	resp.writeHead(200);
	resp.end();
};
