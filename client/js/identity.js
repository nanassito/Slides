/*
 * This JavaScript file implements everything authentication
 * related. This includes interacting with the Persona API, 
 * the Slides server, and updating the UI to reflect sign-in 
 * state.
 *
 * TODO : 
 *	- refactor to have the ui updates in separates functions.
 *  - change the onClick action when the user is logged in.
 */



/**
 * Get the element where we write the mail adress
 */
function getInfoLoginElement(){
	return document.getElementById("infoLogin");
}

/**
 * Get the element to bind with persona actions
 */
function getLoginElement(){
	return document.getElementById("login");
}

/**
 * The user is logged in, we need to update the UI
 */
function updateUILoggedin(email){
	var uiElmt = getInfoLoginElement();
	uiElmt.innerHTML = email;
	getLoginElement().onclick = function(event) {
		event.preventDefault();
		navigator.id.logout();
	};
}


/**
 * The user is being logged in, we need to update the UI
 */
function updateUIProcessing(){
	var uiElmt = getInfoLoginElement();
	uiElmt.innerHTML = "<img src='../img/loading.gif'/>";
}


/**
 * The user is logged out, we need to update the UI
 */
function updateUILoggedout(){
	var uiElmt = getInfoLoginElement();
	uiElmt.innerHTML = "Sign in";
	getLoginElement().onclick = function(event) {
		event.preventDefault();
		navigator.id.request();
	};
}

/**
 * A user has logged in! We need to:
 * 1. Send the assertion to your backend for verification and to create a session.
 * 2. Update the UI.
 */
function onlogin(assertion) {
	console.log("A user has just logged in (browser-side only)");
    if (assertion) {
    	updateUIProcessing();
    	
    	// Just in case someone does not have javascript, or is using IE
    	if (!window.XMLHttpRequest) {
    		console.error("Please test me in a real browser.");
    		alert("Are you sure you have a real browser ?");
    	}
    	
    	// preparing the post request to send the assertion for verification
    	var httpRequest = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("assertion", assertion);
		
		// get the response from the server
		httpRequest.onreadystatechange = function(){
			// state 4 means that we have the full response.
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					console.log("Server is aware that the user is logged in.");
					
					// Update the UI
					var response = JSON.parse(httpRequest.responseText);
					updateUILoggedin(response.email);
				} else {
					console.error("The user loggin process have failed.");
					console.error("Server response code : "+httpRequest.status);
					console.error("Content : "+httpRequest.responseText);
					updateUILoggedout();
				}
			}
		}
		
		// Send the assertion for server-side verification and login
		httpRequest.open("POST", "/user/auth");
		httpRequest.send(formData);
    }
}


/**
 * A user has logged out! Here you need to:
 * Tear down the user's session by redirecting the user or making a call to
 * your backend.
 */
function onlogout(){
	updateUIProcessing();
	
	// preparing the post request to send the assertion for verification
	var httpRequest = new XMLHttpRequest();
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("A user has logged out.");
				updateUILoggedout();
			} else {
				console.error("Logout failed.");
				console.error("Server response code : "+httpRequest.status);
				console.error("Content : "+httpRequest.responseText);
				// There will be a UI bug here, 
				// the login button will stay in 'processing'
			}
		}
	}
	
	// Send the assertion for server-side verification and login
	httpRequest.open("GET", "/user/logout");
	httpRequest.send();
}


/**
 * DOM has been loaded, bind all the events.
 */
window.onload = function () {
	// Click on the login button. We may want to have this directly in the html
	getLoginElement().onclick = function(event) {
		event.preventDefault();
		navigator.id.request();
	};
	
	// Register Persona callbacks
	navigator.id.watch({
		//loggedInEmail: 'bob@example.org',
		
		onlogin: onlogin,
		onlogout: onlogout
	});
}
