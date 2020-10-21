# Sprint 3 - T14 - The Fourteeners

## Goal
### Build a trip!

## Sprint Leader: 
### Darin Harter


## Definition of Done

* The version in `server/pom.xml` is `<version>3.0</version>`.
* The Product Increment release for `v3.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.


## Policies

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap and ReactLeaflet for a consistent user experience (no HTML, CSS, style, etc.).

### Clean Code
* Technical Debt Ratio less than 5% (A).
* Minimize code smells and duplication.

### Test Driven Development
* Write tests before code.
* Unit tests are fully automated.
* Code coverage greater than 70%.

### Processes
* Master is never broken. 
* All pull request builds and tests are successful on Travis-CI.
* All dependencies managed using Maven, npm, and WebPack.
* GitHub etiquette is followed always.


## Planned Epics
Introduction
* Sprint 3 focuses on retrieving locations from the database, using them to build a list of destinations, and, finally, displaying the round trip and leg distances on the atlas. This will require supporting the new v3 protocol, adding an input box to query the database for locations that match a string, and integrating a trip building system with the ability to display the current path and distances, append or remove destinations, and edit listings in the table. The specific epics and their requirements are outlined below.

v3 Protocol
* Provide server support for version 3 of the protocol standard. To do this, we will update the request version to 3 and import the new JSON schemas for requests and responses. For config requests, we will add “trips” as a supported request type. For find requests, the functionality will be changed when a limit is specified without a match string to return (limit) random places from the database. Finally, support for the trip type will be added to the restful API at “/api/trip”. This will take a request with an unlimited number of places and return a response that includes the leg distances between each pair of coordinates in the trip.

Find places
* Allow users to find the names of locations and municipalities around the world. We will create a button under the map that will open a modal for the user to enter a string to match. The client will send a request to “/api/find” containing the string in the input box. The server will return a list of matching locations in the database that will then be displayed on the client in the form of a table or list. The user may click on a location in the table to visit it on the map, or press a button next to the location to add it to the trip.

Build a trip
* Create a way for the user to build a round trip using destinations that consist of a name, municipality, country, and map coordinate. We will start by creating a table on the client where the current trip data and distances can be displayed, likely under the Atlas. We will then add a form to add a custom destination to the trip. Functionality will be added to the Find Place component where destinations found from the database can be added to the trip as well. Whenever a place is added to the trip, a request will be sent to “/api/trip” to update the table and map with new distance data. The map will use markers and polylines to show the path, distances,  and names of destinations along the way. Finally, save and load buttons will allow the user to store or retrieve trip data from local browser storage.

Modify trip
* Add functionality to modify the current trip on the client, including the starting location and order of destinations. To accomplish this, we will add an edit button to each destination listing in the table so that its fields can be updated by the user. An optional notes section will be included with each item in the table, which can be edited as well. Finally, each listing will have a “remove” button, which will be followed by a new server request to update the list if clicked. The ordering of the listings will be able to be listed in reverse order on a button click and each listing will be able to be switched with any other listing.

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 4 | *count* |
| Tasks |  34   | *count* | 
| Story Points |  50  | *sum* | 

### Confidence in Task Completion
* Our team is mostly confident in our ability to complete the majority of the planned tasks for Sprint 3. We gained valuable experience with the code base and process during the last sprint that will allow us to make more timely and efficient progress this time around. We are hoping to either get ahead or stay on the progress line with the burndown chart because last time we got a little behind at the start. Our plan is to break up tasks more than before so that one person doesn’t get caught up in a major feature that takes days to finish. This will help us reach our goal.

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 10-07-2020 | none | #153, #157, #162, #165 | none |
| 10-09-2020 | #153, #157, #158, #159, #162, #165, #188 | #87, #92, #95, #196  | none |
| 10-13-2020 | #87, #92, #139, #195, #203 | #88, #95, #96, #160, #196 | none |
| 10-14-2020 | #95, #209 | #88, #96, #160, #196 | none |
| 10-16-2020 | #96 | #88, #93, #160, #196 | none |
| 10-20-2020 | #88, #163, #225, #227, #231, #233 | #93, #160, #196, #221 | none |

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
