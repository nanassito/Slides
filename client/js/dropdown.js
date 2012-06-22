// Dropdown menu behavior

// initialisation
dropdowns = document.querySelectorAll(".dropdown");

for (var i = 0; i < dropdowns.length; i++) {
	var elmt = dropdowns[i];
	elmt.getElementsByTagName("button")[0].addEventListener("focus", selectDropdown);
	elmt.getElementsByTagName("button")[0].addEventListener("blur", deselectDropdown);
}

function selectDropdown(){
	console.log("Focus on "+ this.parentElement);
	this.parentElement.setAttribute("data-state", "selected");
}

function deselectDropdown(){
	console.log("Blur on " + this.parentElement);
	this.parentElement.setAttribute("data-state", undefined);
}
