// task management to make sure we are ready to go
var task = [];

function removeTask(description, callback){
	task.splice(task.indexOf(description), 1);
	if (!task.length) callback();
}

var fs = require('fs');

// start the database
function startDb(callback){

}

// update revision number
function updateVersion(callback){

}

// recompile the styles
function compileStyles(callback){
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
		removeTask("recompile styles", callback);
	});
}

exports.createEnv = function(callback){
	startDb(callback);
	updateVersion(callback);
	compileStyles(callback);
}
