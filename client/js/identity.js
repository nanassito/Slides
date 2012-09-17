/*
 * This JavaScript file implements everything authentication
 * related. This includes interacting with the Persona API, 
 * the Slides server, and updating the UI to reflect sign-in 
 * state.
 */

/**
 * The login process is over, add data to the DOM and change state.
 */
function onAfterLogin(userData){
	document.session = userData;
	var buttonLabel = document.querySelector("#app-header>button>p");
	buttonLabel.textContent = document.session.email;
	//document.location.hash = "#main";
	changeState("home");
}

/**
 * The login process is over, remove data from the DOM and change state.
 */
function onAfterLogout(){
	if (document.session) document.session = undefined;
	//document.location.hash = "#splash";
	changeState("splash");
}

/**
 * A user has logged in! We need to:
 * 1. Send the assertion to your backend for verification and to create a session.
 * 2. Update the UI.
 */
function onlogin(assertion) {
	console.log("A user has just logged in (browser-side only)");
    if (assertion) {
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
					onAfterLogin(JSON.parse(httpRequest.responseText));
				} else {
					console.error("The user loggin process have failed.");
					console.error("Server response code : "+httpRequest.status);
					console.error("Content : "+httpRequest.responseText);
					onAfterLogout();
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
	// preparing the post request to send the assertion for verification
	var httpRequest = new XMLHttpRequest();
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("A user has logged out.");
				onAfterLogout();
			} else {
				console.error("Logout failed.");
				console.error("Server response code : "+httpRequest.status);
				console.error("Content : "+httpRequest.responseText);
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
document.addEventListener("DOMContentLoaded", function () {
	// Register Persona callbacks
	navigator.id.watch({
		//loggedInEmail: 'bob@example.org',
		
		onlogin: onlogin,
		onlogout: onlogout
	});
});
