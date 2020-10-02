# Introduction

This document describes the architecture and design of a single page web application that interacts with microservices via RESTful APIs.
The key elements in this document include the architecture, user interface, client components, and server classes.

This is a living document that is updated as changes are made each sprint.
The initial document describes the Base code students are given as a starting point for the semester.
Students are expected to update this document as changes are made each sprint to reflect the evolution of their application and key decisions they make.
The Base section serves as an example.


# Base

The Base is a simple application to provide the architecture to the students at the beginning of the semester.
The JavaScript code will be useful examples for students to learn from and leverage in the code they write for sprint 1.
The progressive display of information using collapsible sections and popups will serve as examples of good user interface design.
The overall design is somewhat minimalist/simple for the intended mobile device audience.

### Architecture

The Base architecture is a JavaScript single page web application in an HTML5 browser that uses RESTful APIs to access Micro-services provided by a Java server running on Linux.
The client consists of a minimal index.html file that loads and executes the bundled JavaScript application.
The client and server files are bundled into a single JAR file for execution on the Linux server at a specified port.
The browser fetches the client files from the server on the specified port.

![overview](../images/basearchitecture.png)

The browser loads the index.html file (by default) which in turn loads the bundled JavaScript single page application bundle.js.
* The single page application makes RESTful API requests to the server on the same port using  JavaScript's asynchronous fetch.  
* A protocol document describes the JSON format for the RESTful API requests and responses.
* JSON Schemas are used to verify requests on the server side and responses on the client side.
* On the client, ReactJS renders the application using ReactStrap, Leaflet, and application defined components.
* GSON is used on the server to convert JSON requests to Java objects and Java objects to JSON responses.
* The client (ulog) and server (SLF4J) logging mechanisms control debugging output during development and production - print statements and console logging should never be used. 

The following architecture elements are not included in the Base system.
They will be added later in the semester.
* Client filesystem .
* Server SQL .
* Server concurrency.


### User Interface
![base](../images/UserInterface.png)

Changes made to the UI include two new components which are the Where am I and Find Distance. 

Where Is Component
Open an input field that when clicked will have two text entries for latitude and longitude and a button to submit the inputs, then display a marker in the location that the user entered.

Find Distance Component
Open an input field when clicked, which will have text entries for the latitude and longitude of both locations and a submit button which, when pressed, will reveal the distance and then display markers for both locations with a line between them.


#### Clicking on the map places a marker.
Whenever a user clicks on the map, the client should display a marker with latitude and longitude at that location.
We only maintain a single marker at this point displaying the most recently clicked location.

#### Clicking on the team name should tell me more about the team.
Whenever a user clicks the team name in the header, a collapsible section should appear under the header with information about the team.
The collapsible map should disappear so only the about or map are displayed.
A close button / icon in the top right corner of the about will close the about and return the map to display.
A simple toggle in state should be able to control this rendering.
The about page should contain the team name as a heading, but be otherwise blank in base. 

#### Clicking on the URL in the footer should let me change the server.
Whenever a user clicks on the URL a popup should open showing the team name, the URL in an input text box, and a Cancel button.
When the user modifies the URL, a Test button should appear and the server name should disappear.
When the Test button is clicked, it will attempt to connect to the server.
If not successful, nothing changes and the user may continue to make URL changes or click the Cancel button to return to the original sever (it shouldn't change).
If successful, the new server name should appear and a Save button should replace the Test button.
When the user clicks the Save button, the server connection should change and the popup closes, revealing the new servername and URL in the footer.


### Component Hierarchy

Modifications to the component hierarchy are being made to integrate new functionality. Components will be made for the Find Distance. This will allow the user to input coordinates or locations to shift and update the Leaflet map in the Atlas component. These components will lift state up to the Atlas component so that the map is synced with the current request.
Atlas renders the Find Distance popup components when they are requested and enabled.

![base component hierarchy](../images/ComponentHierarchy.png)

We do not show the many ReactStrap components in this hierarchy, even though they will appear when you are debugging on the client.

### Class Diagram
The class diagram for the base application depicted below shows the basic structure of the web server application.

![class diagram](../images/ClassDiagram.png )

The classes in blue represent the classes specific to this application.  
* WebApplication processes command line parameters and creates MicroServer.
* MicroServer start a web server on the given port, configures the server for security, static files, and APIs for different types of requests, and processes the requests as they arrive.
* JSONValidator verifies a request is properly formatted before attempting to process it using JSON Schemas.
* RequestConfig is a specific request that allows the server to respond with its configuration to allow interoperability between clients and servers. 
* RequestHeader defines the basic components of all requests.

The classes in orange represent the external libraries used by the application.
Often there are several related classes but we've listed only one to simplify the diagram.
* GSON converts a JSON string into a Java object instance.
* Spark provides the necessary web support for our MicroServer.
* JSON provides libraries to manipulate JSON objects using the JSON Schema libraries.
* Logger provides a centralized logging facility used in all of the application classes.


# Sprint 1

![sprint 1 user interface](../images/Sprint1UserInterface.png)

* The user interface now has the team name, a mission statement, team member names, information about the team members, and their images on the about page.
* The user interface has the team name in the header and footer.
* The user interface has a new icon for the url and the status icon.
* The user interface has a popup that shows the server settings with labels name, type, version, and url.

# Sprint 2
### User Interface

![sprint 2 user interface](../images/Sprint2UserInterface.png)

Changes made to the UI include four new components named Where Am I, Where Is, Find Distance and Find Places. They will be placed underneath the leaflet map.

* Where Is Component: Open a popup when clicked which will have two input fields for latitude and longitude and a button to submit the inputs, then display a marker in the location that the user entered.

* Find Distance Component: Open a popup when clicked, which will have input fields for the latitude and longitude of both locations and a submit button which, when pressed, will reveal the distance and then display markers for both locations with a line between them.

* Find Places Component: Open a popup when clicked, which will have an input field for the user to search for a name of a location and a list of matching locations will appear. The user can click on one to display a marker for the location. 

### Component Hierarchy

![sprint 2 component hierarchy](../images/Sprint2ComponentHierarchy.png)

Modifications to the component hierarchy are being made to integrate new functionality. Components will be made for the Find Places, Find Distance, and Where Is epics. This will allow the user to input coordinates or locations to shift and update the Leaflet map in the Atlas component. These components will lift state up to the Atlas component so that the map is synced with the current request and location data.
* Atlas renders the Find Places, Find Distance, and Where Is popup components when they are requested and enabled.
* These three components might be combined into a single dynamic component with a dropdown select for the current method of input.

### Class Diagram

![sprint 2 class diagram](../images/Sprint2ClassDiagram.png)

The changes to the class diagram were minor. The Microserver is now interacting with RequestDistance.java and RequestFind.java, two classes that we have to implement that will extend RequestHeader.java. This is done to support the v2 protocol and enable the server to determine what kind of request to build.

# Sprint 3
# Sprint 4 
# Sprint 5
