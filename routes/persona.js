var https = require('https'),
    qs = require('qs');


/*
 *	The login function.
 */
exports.auth = function (audience) {
	return function(req, resp){
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
					resp.redirect('/');
		    	} else {
					console.error(verified.reason);
					resp.writeHead(403);
				}
				resp.write(data);
				resp.end();
			});
		};
    
		var assertion = req.body.assertion;

		var body = qs.stringify({
			assertion: assertion,
			audience: audience
		});
		console.info('verifying with browserid');
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
		request.end();
	};
};


/*
 *	The logout function.
 */
exports.logout = function (req, resp) {
	console.info("Signing out "+ req.session.email);
	req.session.destroy();
	resp.redirect('/');
};
