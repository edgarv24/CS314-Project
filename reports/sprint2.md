# Sprint 2 - T14 - The Fourteeners

## Goal
### Show me the distance

## Sprint Leader: 
### Rylie Denehan

## Definition of Done

* The version in `server/pom.xml` is `<version>2.0</version>`.
* The Product Increment release for `v2.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.

## Policies

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap for a consistent user experience (no HTML, CSS, style, etc.).

### Clean Code
* Code Climate maintainability of A or B.
* Minimize code smells and duplication.

### Test Driven Development
* Write tests before code.
* Unit tests are fully automated.

### Processes
* Master is never broken. 
* All pull request builds and tests for Master are successful on Travis-CI.
* All dependencies managed using Maven, npm, and WebPack.
* GitHub etiquette is followed always.


## Planned Epics

* Introduction
  * The epics planned for this sprint will mainly allow for that user to find distance between places on the app. This will require supporting the new V2 protocol, showing current user location, computing distance between two locations, displaying a location based off of longitude and latitude, and allowing for coordinates to be entered to find a location. The specific epics and their requirements are outlined below.

* V2 Protocol
  * The goal of this epic is to provide support for the version 2 protocol standard. This includes updating the config protocol to display the supported requests that the server can handle such as a config request, along with the new supported requests of distance and find. The distance protocol object is used to obtain the distance between two geographic locations. The find protocol object is used to obtain a list of geographic locations matching some criteria. In the find protocol object we can limit the amount of results that come back as well as provide a string used to match locations. If the match string is left empty, it will return a random location from the data source. This epic will provide support for the implementation of the rest of the functionality in this sprint. 

* Find Places
  * The goal of this epic is to allow for users to be shown the location of names and municipalities they entered. This will include creating a component underneath the map that when clicked will open a popup with an input box where text can be entered, communicating with a database that has the locations of predefined names and municipalities, and providing a list of locations that the user can then choose one location from. The team will be required to create the component button, list, and map to accurately represent the outputs and to incorporate the database of locations into the Leaflet map.

* Find Distance
  * The goal of this epic is to provide users with the ability to find the distance between two places. This will entail creating a component underneath the map that when clicked will open a popup allowing them to specify two locations using either the same or different means and show the distance directly in between. It will be using the Vincenty method to compute the Great Circle Distance and will show the final number in miles. The map will also be able to provide a direct line, on the Leaflet map, to connect the places previously entered by the user.

* Where Is?
  * The goal of this epic is to allow the user to see a location on the map through inputting a latitude and longitude pair. This will require the creation of a new component that when clicked will open a popup allowing the user to input a location's latitude and longitude. The inputted value will be validated and converted to the correct form. A red box or error message will appear if the input is invalid. Following the press of a button or return key, the Leaflet map will shift and display a marker at the desired location.

* Where Am I?
  * The goal of this epic is to show the user their current location when the app is started or when the map has shifted from their current location. This will require using geolocation to set a marker on the initial position, a button that returns the marker to the current position, and a unique marker of the current position. The return button will be pressed when the marker has moved off the current location and return the unique user marker to the current location.



## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 5 | 3 |
| Tasks |  17  | 21 | 
| Story Points |  24  | 39 | 

* Our team feels confident that a majority of the planned tasks/story points can be completed within Sprint 2. During the last sprint, the team was able to complete all of the Sprint goals and a majority of the planned story points successfully and on time. There is some concern for the lack of experience working with the tools and codebase. Also, there is concern with keeping the burndown chart linear since last time it wasn’t as linear as it could have been. However, the team is confident that they can communicate, work together, and learn in order to complete the Sprint 2 tasks and story points as planned.

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 9-16-2020 | none | #78, #82, #79, #102 | internet connection issues  | 
| 9-18-2020 | #82, #102, #79 | #108, #107, #78 | none | 
| 9-22-2020 | none | #108, #107, #78 | none | 
| 9-23-2020 | #108, #107 | #78, #115, #31, #77, #85 | none |
| 9-25-2020 | #78, #31 | #115, #77, #85, #121 | none |
| 9-29-2020 | #115, #126, #77, #121, #130 | #84, #85 | none |
| 9-30-2020 | #144, #131 | #84, #85, #139 | none |


## Review

### Epics done
* Introduction
  * The epics completed for this sprint allows for the user to reset the map to their current position and to enter two coordinates or click and place two markers on the map to calculate distance between two points. This sprint supports the new V2 protocol, showing current user location, and computing distance between two locations. The completed and uncompleted epics and their requirements are outlined below.

* v2 Protocol
  * Goal: Provide support for the v2 server protocol. 
  * Process: We first modified the config request to return the new supportedRequests list and update the requestVersion. The distance request was implemented to send the requestType, requestVersion, and the required properties place1 and place2 and earthRadius. A request to this path returns the distance between the two places. Finally, the find request was implemented to send the requestType, requestVersion, and the optional properties of match, a string meant to match locations in the database, and a limit meant to limit the number of queries to return. The find response returns a list of places up to the limit sent in the request.

* Where am I?
  * Goal: To allow the user to display their current location on the map.
  * Process: We accomplished this epic in two ways. When the page is first rendered the browser attempts to access the user’s location. If the user allows it, the map will center on their location and drop down a distinct marker indicating their location. The other method we implemented is adding a button beneath the map labeled “Where Am I?” Clicking this button returns the map to the user’s location.

* Find Distance
  * Goal: To allow the user to calculate the distance between two markers on the map. 
  * Process: This epic required the team to create a Java class on the server side of the application to implement the Great Circle Distance using the Vincenty formula. We created a button beneath the map labeled “Find Distance” that allows the user to enter two coordinates. These coordinates are sent to the server to calculate the distance and the result is displayed beneath the atlas. 

### Epics not done 
* Find Places
  * Goal: Find places in the world that match a name passed in by the user. Display a list of related places returned from the database.
  * Plan: We successfully implemented the find API on the server as part of the v2 Protocol. Next sprint we will have more time to implement the client side features, including getting an input string from the user and using it to query for related places from the server.

* Where Is?
  * Goal: Show the user a location on the map based on a latitude and longitude pair. Allow multiple coordinate input formats and handle conversions.
  * Plan: Our team is not far off from being able to implement this, but we will hold it off until next sprint due to being short on time. Completing this was not necessary to fulfill the sprint goal of finding distance between two points.

### What went well
* Most of the V2 protocol implementation went very well. The team was able to calculate distances that passed test cases from not only our team but from other team’s test cases as well, showing that the implementation was correct. The find requests also managed to query the database and return the correct results. These two aspects of the V2 protocol demonstrated that the team understood the workings of the server and the protocol. 

### Problems encountered and resolutions
* A problem we ran into when working with Atlas.js was figuring out how to use Jest and Enzyme for test driven development. It was difficult to adjust to using this method at first, but after reading documentation and watching videos on the subject it became more clear how to find components and simulate state changes. We also had to spend time adjusting to the declarative mindset when writing React code, rather than telling the program exactly what steps to do like we were used to.

## Retrospective

### What we changed this sprint
* For this sprint, we changed a lot of aspects of how we expected the User Interface to appear and which Epics we planned on completing. Our team overestimated the amount of tasks and epics that could be accomplished in 3 weeks, so we ultimately had to leave off a few of them. We also changed the process of programming that we used. Originally, our team was writing code, then creating tests based on that code. The new process that we implemented this sprint involved writing test cases that code would be built around. This Test-Driven Development was very helpful.  

### What went well
* Something that our team did well this sprint was taking time to familiarize all members with how the codebase works. This helped keep us on the same page throughout the sprint. Communication was also something that was done well. All team members were willing to ask questions and help find solutions to problems. Our team followed clean code principles very well by formatting code, refactoring large methods, and using descriptive naming.

### Potential improvements
* Time management still needs to be improved as our burndown report had long periods where the story points did not decrease. Test-Driven Development was something that the team began implementing, but it’s still something that can improve to make development more efficient. In terms of the planning and design process, the team could improve the way tasks are defined. This sprint led to a few tasks that were too large to be considered incremental tasks. And finally, the design of the user interface can improve. Our team was much more proficient at doing server side tasks but struggled a bit with the client side. Another potential improvement would be to fix the Find Distance button pop-up to stop centering on the user marker and instead have it center between the two inputted points.

### What we will change next time
* Next time, the team will work to create tasks that are smaller and more manageable to finish quickly without the complexity of a large task slowing things down and requiring re-designs. This will also allow the team to make progress in completing story points every day. Another thing the team will change is to program together more often to help each other progress, learn and think about the project on the same terms. Finally, we will make sure to test our client code more to ensure maintainability throughout the semester.
