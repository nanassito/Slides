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
	var state = window.location.hash.substring(1)

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
 * changing state and entering the main state
 * We fecth all presentation available for the user and display them
 */
function openMain(){
	document.querySelector("#app-header>h1").textContent="Open a presentation";
	
	var content = document.getElementById("app-content");
	content.innerHTML = "";
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
