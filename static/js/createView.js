if (typeof(Slidez) === "undefined"){
	window.Slidez = {};
}
Slidez.CreateView = {};

console.log("createView is starting");

/**
 * Fetch all infos, create a new presentation and redirect to edit mode.
 */
Slidez.CreateView.create = function(){
//	var title = document.querySelector("header input").value;
//	var template = 
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