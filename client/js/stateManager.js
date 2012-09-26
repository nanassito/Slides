/*
 * The view manager handle the context switching between all views.
 */

/**
 * Change active state according to the hash
 * TODO : bind to pop state.
 */
window.History.Adapter.bind(window, "statechange", function(){
	var state = window.History.getState();
	
	console.log("changing to state : "+JSON.stringify(state.data));

	if (state.data.name == "splash"){
		document.body.setAttribute("data-view", "splash");
		
	}else if (state.data.name == "home"){
		document.body.setAttribute("data-view", "grid");
		openMain();
	
	}else if(state.data.name == "overview"){
		document.body.setAttribute("data-view", "grid");
		openOverview(state.data.presentation_id);
	
	}else if(state.data.name == "edit"){
		document.body.setAttribute("data-view", "edit");
		openEdit(state.data.slide_index);
	
	}else if(state.data.name == "new"){
		document.body.setAttribute("data-view", "grid");
		openNew();
	
	}else if(state.data.name == "createNewPresentation"){
		createNewPresentation(state.data.template);
	
	}
});


/**
 * Create a new presentation
 */
function createNewPresentation(template){
	var httpRequest = new XMLHttpRequest();
	var formData = new FormData();
	formData.append("title", document.querySelector("#app-header>h1")
									 .textContent);
	formData.append("template", template);
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("Presentation created");
				// FIXME : next version of the API should return the url 
				window.History.pushState({name:"home"}, 
						 "Open a presentation - SlideZ", "/list/presentations");
			} else if(httpRequest.status === 403){
				console.log("You new to be connected to create a presentation");
			}else {
				console.error("Failed to create the presentation");
				alert("Failed to create the presentation");
			}
		}
	}
	
	// Send the assertion for server-side verification and login
	httpRequest.open("POST", "/new/presentation");
	httpRequest.send(formData);
}

/**
 * Changing state and entering mode to create a new presentation.
 */
function openNew(){
	changeTitle("Title of the new presentation");
	document.title = "New presentation";

	document.querySelector("#app-header>h1").setAttribute("contenteditable", 
																		"true");
	
	// fetch the list of templates from the server.
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				// Here we have the list.
				var list = JSON.parse(httpRequest.responseText);
				createGrid(list, templateListAdapter, iframeCreator);
			}else if (httpRequest.status === 500) {
				console.error("Something went wrong on the server.");
			}else {
				console.error("Got strange response : %s", httpRequest.status);
			}
		}
	}
	
	httpRequest.open("GET", "/list/templates");
	httpRequest.send();
}


/**
 * Changing state and entering the edit mode.
 */
function openEdit(slideId){
	document.body.setAttribute("data-view", "edit");
	exitEdit();
	console.log("trying to edit slide "+slideId);
	var slide = document.querySelectorAll("[data-slide='"+slideId+"']")[0];
	slide.setAttribute('contenteditable', true);
	slide.setAttribute('aria-selected', true);
}


/**
 * Changing the current slide or exiting the edit mode.
 */
function exitEdit(){
	var slides = document.querySelectorAll("[contenteditable]");
	for (var i=0, slide; slide = slides[i]; i++){
		slide.removeAttribute("contenteditable");
	}
	var slides = document.querySelectorAll("[aria-selected]");
	for (var i=0, slide; slide = slides[i]; i++){
		slide.removeAttribute("aria-selected");
	}
}


/**
 * Changing state and entering the overview mode of a presentation
 */
function openOverview(presentation_id){
	// download the presentation content
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				// Here we have the presentation.
				var grid = document.getElementById("app-content");
				grid.innerHTML = httpRequest.responseText;
				var slides = document.querySelectorAll("[data-slide]");
				for (var i=0, slide; slide = slides[i]; i++){
					slide.addEventListener("click", (function(){
						openEdit(this.getAttribute("data-slide"));
					}).bind(slide));
				}
				setAutoSave();
			}else if (httpRequest.status === 500) {
				console.error("Something went wrong on the server.");
			}else {
				console.error("Got strange response : %s", httpRequest.status);
			}
		}
	}
	
	httpRequest.open("GET", "/presentation/"+presentation_id);
	httpRequest.send();
}


/**
 * changing state and entering the main state
 * We fecth all presentation available for the user and display them
 */
function openMain(){
	changeTitle("Open a presentation");
	
	// fetch the list of presentations from the server.
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				// Here we have the list.
				var list = JSON.parse(httpRequest.responseText);
				list.splice(0, 0, {});
				createGrid(list, presentationListAdapter, iframeCreator);
			}else if (httpRequest.status === 403) {
				// user is not logged in
				window.History.pushState({name:"splash"}, "SlideZ", "/");
			}else if (httpRequest.status === 500) {
				console.error("Something went wrong on the server.");
			}else {
				console.error("Got strange response : %s", httpRequest.status);
			}
		}
	}
	
	httpRequest.open("GET", "/list/presentations");
	httpRequest.send();
}


/**
 * Change the window title
 */
function changeTitle(newTitle){
	document.querySelector("#app-header>h1").textContent=newTitle;
	document.title = newTitle + " - SlideZ";
}


/**
 * Adapt presentation data to be used by a elmtCreator.
 */
function presentationListAdapter(presentation){
	if (presentation.id){
		targetState = {
			data : {
				name : "overview",
				presentation_id : presentation.id
			},
			title : presentation.title+" - SlideZ",
			url : "/presentation/"+presentation.id
		}
	}else{
		targetState = {
			data : {name : "new"},
			title : "Create a new presentation - SlideZ",
			url : "/new/presentation"
		}
		// TODO add the content to firstSlide here
	}
	return {
		stylesheet : presentation.template,
		content : presentation.firstSlide,
		targetState : targetState
	};
}


/**
 * Adapt presentation data to be used by a elmtCreator.
 */
function templateListAdapter(templateUrl){
	return {
		stylesheet : templateUrl,
		content : "<h1>Example</h1><p class='author'>Author<p>",
		targetState : {
			data : {
				name : "createNewPresentation",
				template : templateUrl
			},
			title : "Creating your presentation - SlideZ",
			url : "/new/presentation/"
		}
	};
}


/**
 * Display all the presentation contained in list
 */
function createGrid(list, dataAdapter, elmtCreator){
	var container = document.getElementById("app-content");
	container.innerHTML = "";
	
	for (var i=0, elmt; elmt = list[i]; i++){
		elmtCreator(container, dataAdapter(elmt));
	}
}


/**
 * Create an iframe element inside node and fill it with elmt
 */
function iframeCreator(node, elmt){
	var wrapper = document.createElement("section"),
		iframe = document.createElement("iframe"),
		link = document.createElement("section"),
		linkContent = document.createElement("h1");
	node.appendChild(wrapper);
	wrapper.appendChild(iframe);
	wrapper.appendChild(link);
	link.appendChild(linkContent);
	
	linkContent.textContent = "Open";
	
	var data = "";
	data += "<link 	rel='stylesheet'";
	data += "		href='"+elmt.stylesheet+"'";
	data += "		type='text/css'";
	data += "		media='screen'/>";
	data += "<section data-slide='unknown'>";
	data += 		elmt.content;
	data += "</section>";
	
	iframe.src = "data:text/html;charset=utf-8,"+escape(data);
	
	link.addEventListener("click", function(){
		// TODO : bind only left click
		window.History.pushState(elmt.targetState.data, elmt.targetState.title,
														elmt.targetState.url);
	});
}


/**
 * Add event handler to automatically save the slide after modification
 */
function setAutoSave(){
	var slides = document.querySelectorAll("[data-slide]");
	for (var i=0, slide; slide = slides[i]; i++){
		slide.addEventListener("blur", (function(){
			// saving the content
			saveSlide(this);
		}).bind(slide));
	}

}


/**
 * Save the slide
 */
function saveSlide(slide){
	var httpRequest = new XMLHttpRequest();
	var formData = new FormData();
	formData.append("slideId", slide.getAttribute("data-slide"));
	formData.append("content", slide.innerHTML);
	formData.append("classes", slide.getAttribute("class"));
	
	// get the response from the server
	httpRequest.onreadystatechange = function(){
		// state 4 means that we have the full response.
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log("Slide saved");
			} else if(httpRequest.status === 403){
				console.log("You new to be connected to create a presentation");
			} else if(httpRequest.status === 404){
				console.log("Presentation cannot be found (slide NOT saved)");
			} else if(httpRequest.status === 500){
				console.log(
						"Slide not saved, something went wrong on the server.");
			}else {
				console.error("Failed to create the presentation");
				alert("Failed to create the presentation");
			}
		}
	}
	
	// Send the assertion for server-side verification and login
	httpRequest.open("POST", location.pathname);
	httpRequest.send(formData);
}