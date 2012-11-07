var nconf = require('nconf')
	, mongoose = require('mongoose');

var db = mongoose.createConnection(nconf.get("mongoUrl"))
	, Schema = mongoose.Schema;

exports.db = db;
exports.Schema = Schema;