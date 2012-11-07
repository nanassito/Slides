/*
 * This JavaScript file implements everything authentication
 * related. This includes interacting with the Persona API, 
 * the Slides server, and updating the UI to reflect sign-in 
 * state.
 */


var Slidez = window.Slidez || {};

Slidez.User = {};


/**
 * Triggered after a successfull login
 */
Slidez.User.afterLogin = function(userData){
	localStorage.setItem('Slidez_User_email', userData.email);
	window.location.replace("/list/presentations");
}


/**
 * Handle the login process
 */
Slidez.User.handleLogin = function(assertion){
	console.log("A user has just logged in (browser-side only) ");

	if (localStorage.getItem('Slidez_User_email') != undefined){
		// The user is already looged in, we don't need to do anything with the 
		// server. If we are on the splash, we need to send the user the the home.
		console.log(localStorage.getItem('Slidez_User_email') + " was already logged in.");
		if (window.location.pathname == "/"){
			window.location.replace("/list/presentations");
		}
		return ;
	}

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
					Slidez.User.afterLogin(JSON.parse(httpRequest.responseText));
				} else {
					console.error("The user loggin process have failed.");
					console.error("Server response code : "+httpRequest.status);
					console.error("Content : "+httpRequest.responseText);
					Slidez.User.afterLogout();
				}
			}
		}
		
		// Send the assertion for server-side verification and login
		httpRequest.open("POST", "/user/auth");
		httpRequest.send(formData);
  }
}


/**
 * Triggered after a logout
 */
Slidez.User.afterLogout = function(){
	localStorage.removeItem('Slidez_User_email');
	if (window.location.pathname != "/"){
		window.location.replace("/");
	}
}


/**
 * Handle the logout process
 */
Slidez.User.handleLogout = function(){
	// preparing the post request to send the assertion for verification
	var httpRequest = new XMLHttpRequest();
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("A user has logged out.");
				Slidez.User.afterLogout();
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
 * Initialization
 */
document.addEventListener("DOMContentLoaded", function () {
	// Register Persona callbacks
	navigator.id.watch({
		onlogin: Slidez.User.handleLogin,
		onlogout: Slidez.User.handleLogout
	});
});//*/
