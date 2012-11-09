if (typeof(Slidez) === "undefined"){
	window.Slidez = {};
}
Slidez.CreateView = {};

console.log("createView is starting");

/**
 * Fetch all infos, create a new presentation and redirect to edit mode.
 */
Slidez.CreateView.create = function(){
	console.log("creating a new presentation");
	var title = document.querySelector("header input").value;
	var template = document.querySelectorAll(".templateElmt[aria-selected]")[0]
												 .getAttribute('data-templateUrl');

	var httpRequest = new XMLHttpRequest();
	var formData = new FormData();
	formData.append("title", title);
	formData.append("template", template);
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("Presentation created");
				var presentation = JSON.parse(httpRequest.responseText);
				window.location.replace('/edit/'+presentation._id);

			} else if(httpRequest.status === 403){
				console.log("You new to be connected to create a presentation");
				alert("Failed to create the presentation");

			}else {
				console.error("Failed to create the presentation");
				alert("Failed to create the presentation");
			}
		}
	}
	
	// Send the assertion for server-side verification and login
	console.log("sending the creation request");
	httpRequest.open("PUT", "/api/0.3/presentation");
	httpRequest.send(formData);
};//*/


/**
 *	Select a given template and deselect others
 */
Slidez.CreateView.selectTemplate = function(template){
	// Removed all existing selections
	var templates = document.querySelectorAll(".templateElmt");
	for (var i=0, tpl; tpl = templates[i]; i++){
		tpl.removeAttribute("aria-selected");
	}

	// select the current template
	template.setAttribute('aria-selected', 'true');

	// enable the create button
	document.querySelector("footer button.iconDone").removeAttribute("disabled");
}//*/


/**
 * Initial set up
 */
document.addEventListener("DOMContentLoaded", function () {
	var templates = document.querySelectorAll(".templateElmt > section");
	for (var i=0, template; template = templates[i]; i++){
		template.addEventListener("click", (function(){
			console.log("click on "+this);
			Slidez.CreateView.selectTemplate(this.parentElement);
		}).bind(template));
	}
});//*/