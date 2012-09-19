// task management to make sure we are ready to go
var tasks = [],
	processes = [],
	childProcess = require("child_process");

function startApp(){
	var app = childProcess.spawn("node", ['app.js']);
	app.stderr.on("data", function(data){
		console.err(data);
	});
	app.stdout.on("data", function(data){
		console.log(data);
	});
	app.on("exit", function(code){
		processes.forEach(function(process){
			process.kill();
		});
	});
	removeTask("start database");
}

function removeTask(description){
	tasks.splice(tasks.indexOf(description), 1);
	if (!tasks.length) startApp();
}

var fs = require('fs');

// start the database
function startDb(){
	tasks.push("start database");
	var mongod = childProcess.spawn("mongod", ['-f', 'data/mongo.conf']);
	mongod.stderr.on("data", function(data){
		console.err(data);
	});
	mongod.on("exit", function(code){
		console.log("--> Database turned off ("+code+")");
	});
	processes.push(mongod);
	removeTask("start database");
}

// update revision number
function updateVersion(){

}

// recompile the styles
function compileStyles(){
	task.push("recompile styles");
	var less = require('less');
	var content = fs.readFileSync("client/less/Slides.less").toString();
	var lessParser = new(less.Parser)({
		paths:["./client/less"],
		filename: "Slides.css"
	});
	lessParser.parse(content, function(err, tree){
		if (err) console.error(err);
		fs.writeFileSync("client/css/Slides.css", tree.toCSS());
		removeTask("recompile styles");
	});
}

function main(){
	startDb();
	updateVersion();
	compileStyles();
}
main();
