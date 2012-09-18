/**
 * Verify that the browser is good enough to run the app.
 */
document.addEventListener("DOMContentLoaded", function () {
	var requirements = [
		{
			"desc" : "window.XMLHttpRequest",
			"test" : window.XMLHttpRequest
		},
		{
			"desc" : "window.history",
			"test" : (window.history && window.history.pushState)
		},
	];

	for (var i=0, elmt; elmt = requirements[i]; i++){
		if (!elmt.test){
			alert("No support for "+elmt.desc);
		}
	}
});
