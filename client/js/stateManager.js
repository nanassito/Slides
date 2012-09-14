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
		document.body.setAttribute("data-state", state);
		
	}else if (state == "overview"){
		openHeader();
		document.body.setAttribute("data-state", state);
		
	}else if (state == "edit"){
		openHeader();
		document.body.setAttribute("data-state", state);
		
	}else {
		console.error("Unknown state : %s", state);
	}
}

/**
 * changing state and entering a state containing the standard header
 */
function openHeader(){
	var header = document.getElementById("app-header");
	if (!header.innerHTML){
		
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
