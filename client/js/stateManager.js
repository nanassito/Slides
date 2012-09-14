/*
 * The view manager handle the context switching between all views.
 *
 * List of the states available
 *	- splash : the user is not logged in
 *	- main : The user is logged in but is not working on a specific presentation
 *	- overview : The user has opened a presentation but is in overview mode
 *	- edit : The user is editing a specific slide
 */

/**
 * Change active state according to the hash
 */
function changeState(){
	var hash = window.location.hash + "/";
	var state = hash.substr(1, hash.indexOf('/')-1)
	
	if (state == "splash"){
		document.body.setAttribute("data-state", state);
		
	}else if (state == "main"){
		openMain();
		document.body.setAttribute("data-state", state);
		
	}else {
		console.error("Unknown state : %s", state);
	}
}


/**
 * changing state and entering the main state
 * We fecth all presentation available for the user and display them
 */
function openMain(){
	changeTitle("Open a presentation");
	
	// fetch the list of presentations from the server.
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				// Here we have the list.
				var list = JSON.parse(httpRequest.responseText);
				createGrid(list, newIframe);
			}else if (httpRequest.status === 403) {
				// user is not logged in
				document.location.hash = "#splash";
			}else if (httpRequest.status === 500) {
				console.error("Something went wrong on the server.");
			}else {
				console.error("Got strange response : %s", httpRequest.status);
			}
		}
	}
	
	httpRequest.open("GET", "/list/presentations");
	httpRequest.send();
}


/**
 * Change the window title
 */
function changeTitle(newTitle){
	document.querySelector("#app-header>h1").textContent=newTitle;
}


/**
 * Display all the presentation contained in list
 */
function createGrid(list, displayFunction){
	var defaultSlide = "<h1>Title of the presentation</h1>";
	defaultSlide += "<p class='author'>author@email.com</p>";

	var container = document.getElementById("app-grid");
	container.innerHTML = "";
	
	for (var i=0, elmt; elmt = list[i]; i++){
		elmt.content = elmt.firstSlide || defaultSlide;
		displayFunction(container, elmt);
	}

//iframe.src = "data:text/html;charset=utf-8," + escape("<body><h1>Test</h1></body>");
}


/**
 * Append an iframe element to node and fill it with content and stylesheet
 */
function newIframe(node, elmt){
	var iframe = document.createElement("iframe");
	node.appendChild(iframe);
	
	var data = "";
	data += "<link 	rel='stylesheet'";
	data += "		href='"+elmt.template+"'";
	data += "		type='text/css'";
	data += "		media='screen'/>";
	data += "<section data-slide='unknown'>";
	data += 		elmt.content;
	data += "</section>";
	
	iframe.src = "data:text/html;charset=utf-8,"+escape(data);
	
	iframe.addEventListener("click", function(){
		window.location.hash = "#edit/"+elmt._id;
	});
}


/**
 * DOM has been loaded, bind all the events.
 */
document.addEventListener("DOMContentLoaded", function () {
	window.addEventListener("hashchange", changeState);
});
