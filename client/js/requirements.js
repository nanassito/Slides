/**
 * Verify that the browser is good enough to run the app.
 */
document.addEventListener("DOMContentLoaded", function () {
	var requirements = [
		{
			"desc" : "window.XMLHttpRequest",
			"object" : window.XMLHttpRequest
		},
		{
			"desc" : "window.history",
			"object" : window.history
		},
	];

	for (var i=0, elmt; elmt = requirements[i]; i++){
		if (!elmt.object){
			alert("No support for "+elmt.desc);
		}
	}
});
