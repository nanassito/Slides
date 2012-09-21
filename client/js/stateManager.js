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
	
	}
});


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
				// TODO :
				// - change title
				// - add back button
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
				// TODO : create something prettier than this ugly '+'
				list.splice(0, 0, {firstSlide:"+"});
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
	}
	return {
		stylesheet : presentation.template,
		content : presentation.firstSlide,
		targetState : targetState
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
