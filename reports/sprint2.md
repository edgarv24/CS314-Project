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
| Epics | 5 | *count* |
| Tasks |  17  | *count* | 
| Story Points |  24  | *sum* | 

* Our team feels confident that a majority of the planned tasks/story points can be completed within Sprint 2. During the last sprint, the team was able to complete all of the Sprint goals and a majority of the planned story points successfully and on time. There is some concern for the lack of experience working with the tools and codebase. Also, there is concern with keeping the burndown chart linear since last time it wasn’t as linear as it could have been. However, the team is confident that they can communicate, work together, and learn in order to complete the Sprint 2 tasks and story points as planned.

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 9-16-2020 | none | #78, #82, #79, #102 | internet connection issues  | 
| 9-18-2020 | #82, #102, #79 | #108, #107, #78 | none | 
| 9-18-2020 | none | #108, #107, #78 | none | 

## Review

### Epics done  

### Epics not done 

### What went well

### Problems encountered and resolutions


## Retrospective

### What we changed this sprint

### What went well

### Potential improvements

### What we will change next time
