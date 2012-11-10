(function( window ) {
	if (typeof(window.Slidez) === "undefined"){
		window.Slidez = {};
	}
	var Slidez = window.Slidez;

	Slidez.EditView = {};

	/**
	 * call the API to crete a new slide
	 */
	function requestNewSlide(position, presentationId, callback){
		var httpRequest = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("position", position);
		formData.append("presentationId", presentationId);
		
		// get the response from the server
		httpRequest.onreadystatechange = function(){
			// state 4 means that we have the full response.
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					console.log("Slide created");
					var slide = JSON.parse(httpRequest.responseText);
					callback(slide);

				} else if(httpRequest.status === 403){
					console.log("You new to be connected to create a slide");
					alert("Failed to create the slide");

				}else {
					console.error("Failed to create the slide");
					alert("Failed to create the slide");
				}
			}
		}
		
		// Send the assertion for server-side verification and login
		console.log("sending the creation request");
		httpRequest.open("PUT", "/api/0.3/slide");
		httpRequest.send(formData);
	};


	/**
	 * Create a new slide in the current presentation.
	 */
	Slidez.EditView.addSlide = function(){
		var presWindow = document.querySelector('article iframe').contentWindow;

		var presentationId = presWindow.document.head
																	 .querySelector("meta[name='presentationId']")
																	 .getAttribute('content');

		// Find where we are in the presentation
		var currentSlideIdx = presWindow.location.hash.substr(1) /1;

		// Create a new slide
		requestNewSlide(currentSlideIdx+1, presentationId, function(slide){
			console.log(slide);

			// Add the new slide in the presentation
			newSlide = presWindow.document.createElement('section');
			newSlide.setAttribute("data-slide", slide._id);
			newSlide.innerHTML = slide.content;
			var crtSlide = presWindow.document
														 .querySelectorAll("[data-slide]")[currentSlideIdx];
			crtSlide.parentElement.insertBefore(newSlide, crtSlide.nextSibling);

			// Add the preview of the new slide in the sidebar
			newPreview = presWindow.document.createElement('section');
			newPreview.setAttribute("class", "wrapper");
			newPreview.innerHTML = "<section><h1></h1><iframe></iframe></section>";
			var crtPreview = window.document.body
													 .querySelectorAll("aside .wrapper")[currentSlideIdx];
			crtPreview.parentElement.insertBefore(newPreview, crtPreview.nextSibling);
			var previewUrl = 'http://'+window.location.host+'/preview/'+presentationId
																																 +'/'+slide._id;
			newPreview.querySelector('iframe').setAttribute('src', previewUrl);

			// Tell DzSlides that there is a new slide
			presWindow.Dz.listSlides();

			// Go to the new slide
		});
	};

})( window );