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
		openSplash();
		document.body.setAttribute("data-state", state);
		
	}else if (state == "main"){
		openHeader();
		openMain();
		document.body.setAttribute("data-state", state);
		
	}else if (state == "overview"){
		openHeader();
		openOverview();
		document.body.setAttribute("data-state", state);
		
	}else if (state == "edit"){
		openHeader();
		openEdit();
		document.body.setAttribute("data-state", state);
		
	}else {
		console.error("Unknown state : %s", state);
	}
}


/**
 * Display all the presentation contained in list
 */
function createPresentationGrid(list){
	var appContent = document.getElementById("app-content");
	appContent.innerHTML = "";
	var wrapper = document.createElement("section");
	wrapper.setAttribute("id", "wrapper");
	appContent.appendChild(wrapper);
	
	for (var i=0, elmt; elmt = list[i]; i++){
		var iframe = document.createElement("iframe");
		wrapper.appendChild(iframe);
		
		var content = "";
		content += "<link 	rel='stylesheet'";
		content += "		href='"+elmt.template+"'";
		content += "		type='text/css'";
		content += "		media='screen'/>";
		content += "<section>";
		content += elmt.firstSlide;
		content += "</section>";
		
		iframe.src = "data:text/html;charset=utf-8,"+escape(content);
		iframe.onclick=""
	}

//iframe.src = "data:text/html;charset=utf-8," + escape("<body><h1>Test</h1></body>");
}


/**
 * changing state and entering the main state
 * We fecth all presentation available for the user and display them
 */
function openMain(){
	document.querySelector("#app-header>h1").textContent="Open a presentation";
	
	// fetch the list of presentations from the server.
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				// Here we have the list.
				var list = JSON.parse(httpRequest.responseText);
				createPresentationGrid(list);
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
 * changing state and entering a state containing the standard header
 */
function openHeader(){
	var header = document.getElementById("app-header");
	if (!header.hasChildNodes()){
		var title = document.createElement("h1");
		header.appendChild(title);
		
		var button = document.createElement('button');
		var icon = document.createElement('i');
		icon.setAttribute("class", "icon-buddy");
		button.appendChild(icon);
		button.appendChild(document.createTextNode(document.session.email));
		button.onclick = function(){navigator.id.logout()};
		header.appendChild(button);
	}
}


/**
 * changing state and entering the splash state.
 */
function openSplash(){
	document.getElementById("app-header").innerHTML = "";
	var content = document.getElementById("app-content");
	content.innerHTML = "";
	var title = document.createElement("h1");
	title.textContent = "SlideZ";
	content.appendChild(title);
	var image = document.createElement("img");
	image.setAttribute("src", "../img/persona-login.png");
	image.setAttribute("alt", "Sign in with Persona");
	image.onclick = function(){navigator.id.request()};
	content.appendChild(image);
}

/**
 * DOM has been loaded, bind all the events.
 */
document.addEventListener("DOMContentLoaded", function () {
	window.addEventListener("hashchange", changeState);
});
