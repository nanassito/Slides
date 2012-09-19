/**
 * Manage all necessary operation in a test configuration
 */
var childProcess = require("child_process");

var state = -1,
	launchers = [
		updateRevNumber,
		startDb,
		compileStyles,
		startApp,
		function(){} // end the chain
	],
	processes = [];

/**
 * Go on to the next step in the chain
 */
function next(){
	state++;
	launchers[state]();
}

/**
 * start the mongo database server.
 */
function updateRevNumber(){
	var fs = require('fs'),
		info = JSON.parse(fs.readFileSync("package.json").toString());
	
	version = info.version.split('.', 3);
	info.version = version[0]+'.'+version[1]+'.'+(new Date()).toJSON();
	
	fs.writeFileSync("package.json", JSON.stringify(info, undefined, 4));
	next();
}

/**
 * start the mongo database server.
 */
function startDb(){
	var mongod = childProcess.spawn("mongod", ['-f', 'data/mongo.conf']);
	mongod.stderr.on("data", function(data){ console.error(data.toString()); });
	mongod.on("exit", function(code, signal){
		console.error("Database turned off ("+code+")");
		processes.splice(processes.indexOf(mongod), 1);
		if (signal!='SIGTERM') killAll();
	});
	processes.push(mongod);
	next();
}

/**
 * start the mongo database server.
 */
function compileStyles(){
	var less = require('less'),
		fs = require('fs');
	var content = fs.readFileSync("client/less/Slides.less").toString();
	var lessParser = new(less.Parser)({
		paths:["./client/less"],
		filename: "Slides.css"
	});
	lessParser.parse(content, function(err, tree){
		if (err) console.error(err);
		fs.writeFileSync("client/css/Slides.css", tree.toCSS());
		next();
	});
}

/**
 * start the mongo database server.
 */
function startApp(){
	var slidez = childProcess.spawn("node", ["app.js"]);
	slidez.stderr.on("data", function(data){ console.error(data.toString()); });
	slidez.stdout.on("data", function(data){ console.log(data.toString()); });
	slidez.on("exit", function(code, signal){
		console.error("Exiting SlideZ ("+code+")");
		processes.splice(processes.indexOf(slidez), 1);
		if (signal!='SIGTERM') killAll();
	});
	processes.push(slidez);
	next();
}

/**
 * start the mongo database server.
 */
function killAll(){
	processes.forEach(function(process){
		process.kill(signal='SIGTERM');
	});
}


/**
 * When the app is closed
 */
process.on("exit", function(code, signal){
	console.log("Exiting main process");
	processes.splice(processes.indexOf(process), 1);
	if (signal!='SIGTERM') killAll();
});

// start the program
processes.push(process);
next();
