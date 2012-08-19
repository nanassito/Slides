/*
 * This JavaScript file implements everything authentication
 * related. This includes interacting with the Persona API, 
 * the Slides server, and updating the UI to reflect sign-in 
 * state.
 */

/**
 * A user has logged in! We need to:
 * 1. Send the assertion to your backend for verification and to create a session.
 * 2. Update the UI.
 */
function onlogin(assertion) {
	console.log("A user has just logged in (browser-side only)");
    if (assertion) {
    	// Update the UI to show we are working
		var uiElmt = document.getElementById("login");
		uiElmt.innerHTML = "<img src='../img/loading.gif'/>";
    	
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
					uiElmt.innerHTML = response.email;
				} else {
					console.error("The user loggin process have failed.");
					console.error("Server response code : "+httpRequest.status);
					console.error("Content : "+httpRequest.responseText);
					uiElmt.innerHTML = "Sign in";
				}
			}
		}
		
		// Send the assertion for server-side verification and login
		httpRequest.open("POST", "/auth");
		httpRequest.send(formData);
    }
}


/**
 * A user has logged out! Here you need to:
 * Tear down the user's session by redirecting the user or making a call to
 * your backend.
 */
function onlogout(){
	console.log("A user has logged out.");
}


/**
 * DOM has been loaded, bind all the events.
 */
window.onload = function () {
	// Click on the login button. We may want to have this directly in the html
	//var bid = document.getElementById("login");
	//bid.addEventListener("click", navigator.id.request);
	
	// Register Persona callbacks
	navigator.id.watch({
		//loggedInEmail: 'bob@example.org',
		
		onlogin: onlogin,
		onlogout: onlogout
	});
}
