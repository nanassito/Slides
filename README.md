Slides
======

SlideZ is a web-based graphical editor to create presentation.  
Presentations created with SlideZ are based on DZSlides  

The project is still in the early stages.  

At the moment there are no publicly available server running this code. Nevertheless you can run it on you computer.  
1- Fork the project  
2- Install npm and node.js (see official documentation for your operating system)  
3- Install mongodb (see official documentation)  
3- Install dependencies : $ npm install -d  
4- If needed launch the database : $ mongod  
5- Launch the development server : $ node app  
6- Browse to localhost:3000 and login using Mozilla persona.  

What needs to be done ?  
As I stated before the project is still imature.   
here is a list without any kind of priorities of what needs to be done to achieve 1.0 :  
- Refactor to make a app single page
- Find a better way to handle the slide's preview in edit mode
- fix the login mechanism
- Add functionality to the edit mode to ease the insertion of different type of content
- Add more templates

Long term objectives :
- refactor to use Mozilla gaya building block for the UI
- use websocket to enable real-time collaboration
- add sharing capabilities


If you feel like helping on any of those topics (or even other that I might not have thought of),   
feel free to hack and submit a pull request.