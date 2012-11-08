var black		= '\033[30m'
	, red			= '\033[31m'
	, green		= '\033[32m'
	, yellow	= '\033[33m'
	, blue		= '\033[34m'
	, magenta	= '\033[35m'
	, cyan		= '\033[36m'
	, white		= '\033[37m'

	, reset 	= '\033[0m'
;
//Black 0;30 – 
//Dark Gray 1;30 – 
//Blue 0;34 – 
//Light Blue 1;34 – 
//Green 0;32 – 
//Light Green 1;32 – 
//Cyan 0;36 – 
//Light Cyan 1;36 – 
//Red 0;31 – 
//Light Red 1;31 – 
//Purple 0;35 – 
//Light Purple 1;35 – 
//Brown 0;33 – 
//Yellow 1;33 – 
//Light Gray 0;37 – 
//White 1;37

exports.debug = function(text){
	console.log(				"DEBUG   : "+text+reset);
},

exports.log = function(text){
	console.log(				"LOG     : "+text+reset);
},

exports.info = function(text){
	console.log(				"INFO    : "+text+reset);
},

exports.warn = function(text){
	console.log(yellow+	"WARNING : "+text+reset);
},

exports.error = function(text){
	console.log(red+		"ERROR   : "+text+reset);
},

exports.trace = function(text){
	console.log(magenta+"TRACE   : "+text+reset);
},

exports.url = function(text){
	console.log(blue+		"URL     : "+text+reset);
}