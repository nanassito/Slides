// Configuration
var nconf = require('nconf'),
	fs = require('fs');


/*
 * Return the list of all available templates.
 * returned object = [
 *	url of the template,…
 * ]
 */
exports.getList = function (req, resp) {
	fs.readdir(nconf.get('basedir')+"/templates", function(err, files){
		if (err){
			console.error(err);
			resp.writeHead(500);
			resp.send();
		}else{
			console.log(files);
			var i = files.length;
			while (i--){
				if (files[i].substr(-4, 4) != ".css"){
					files.splice(i, 1);
				}
			}
			resp.send(files);
		}
	});
};
