/*
	This module manage the identification of the user.
*/

(function( window ) {
	if (typeof(window.Slidez) === "undefined"){
		window.Slidez = {};
	}
	var Slidez = window.Slidez;

	Slidez.User = {};


/******************************************************************************
 *                               initialization                               *
 ******************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
	// Register Persona callbacks
	navigator.id.watch({
		onlogin: handleLogin,
		onlogout: handleLogout
	});
});


/******************************************************************************
 *                              internal methods                              *
 ******************************************************************************/

/**
 * Handle the login process
 */
function handleLogin(assertion){
	if (window.location.pathname != '/'){
		console.log('Login required but a user is already logged in.');
		return;
	}

	if(assertion){
		console.log('A user logged in with Persona.');

		// preparing the post request to send the assertion for verification
  	var httpRequest = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("assertion", assertion);
		
		// get the response from the server
		httpRequest.onreadystatechange = function(){
			// state 4 means that we have the full response.
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					afterLogin(JSON.parse(httpRequest.responseText));
				} else {
					console.error("The user loggin process have failed.");
					console.error("Server response code : "+httpRequest.status);
					console.error("Content : "+httpRequest.responseText);
					afterLogout();
				}
			}
		}
		
		// Send the assertion for server-side verification and login
		httpRequest.open("POST", "/api/0.3/user/auth");
		httpRequest.send(formData);
	}
}


/**
 * Triggered after a successfull login
 */
function afterLogin(userData){
	window.location.replace("/list/presentations");
}


/**
 * Triggered after a logout
 */
function afterLogout(){
	if (window.location.pathname != "/"){
		window.location.replace("/");
	}
}


/**
 * Handle the logout process
 */
function handleLogout(){
	if (window.location.pathname != "/"){
		window.location.replace("/api/0.3/user/logout");
	}
}


/******************************************************************************
 *                               public methods                               *
 ******************************************************************************/



})( window );