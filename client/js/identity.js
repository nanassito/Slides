/*
 * This JavaScript file implements everything authentication
 * related. This includes interacting with the Persona API, 
 * the Slides server, and updating the UI to reflect sign-in 
 * state.
 */

function login(event) {
    event.preventDefault();
    navigator.id.get(function (assertion) {
        if (assertion) {
            var assertion_field = document.getElementById("assertion-field");
            assertion_field.value = assertion;
            var login_form = document.getElementById("login-form");
            login_form.submit();
        }
    });
}

window.onload = function () {
	var bid = document.getElementById("login");
	bid.addEventListener("click", login);
}
