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
| 10-21-2020 | #196, #221 | #93, #160, #219, #242 | none |

## Review

### Epics done  
Introduction
* The goal of sprint 3 was to give the user the ability to build a trip. The epics we completed satisfy this requirement by adding support for trip API requests, building a find modal to retrieve and add airports from a database, and adding an itinerary to view and modify the places in the trip. The completed and uncompleted epics and their details are outlined below.

v3 protocol
* Goal: Provide support for the v3 server protocol. 
* Process: We updated the Config and Find protocol objects and added one for Trip requests. Updating config was the simplest of the three as it required adding “trip” to the supported requests and updating the protocol version constant. The find protocol in v3 required more information coming back from the database about each place, including region, country, and url. The v3 protocol also required different behavior for Find, such as returning (limit) random places when a limit is specified without a match string. Finally, the RequestTrip class was created to calculate the leg distances between places listed in the request, including from the last place back around to the first. We wrote a new class to hold the current trip data such as trip title, earth radius, and attributes for each place.

Find places
* Goal: Allow users to search for airports from the database using a match string.
* Process: To allow users to search for places, we built a find modal with an input box to enter a string to match. When the input box is changed, a server request is sent to /api/find to get a list of matching places from the database. These places are displayed in a scrollable list, where the user can select a place to either add to the trip or view on the map.

Build a trip
* Goal: Implement trip building and display it on the itinerary and map.
* Process: We built an itinerary using material-ui table elements to display destination data. Each row holds the place name, location info, the current distance, and more detail by expanding the row. Then, we built a data class to store and modify the current trip through adding and removing places, loading and saving a trip JSON file, and sending server requests to calculate leg distances. This trip data is also used in the map for displaying the trip through markers and polylines. New destinations can be added from the database or by clicking on the map.

### Epics not done 
Modify trip
* Goal: Add functions to edit the trip and its destinations.
* Plan: Our team did not get to completing this epic due to a shortage of time. We had planned to add the ability to edit destinations in a popup, reverse or change the start of the list, and update other trip information. Implementation of these features will be moved to the next sprint.

### What went well
Many things went well this sprint, and it seemed to go smoother than previous sprints. For one, we were able to meet the sprint goal of building a trip. A big part of this came from our testing and attention to detail on the API and protocol, which allowed us to focus more on implementing client features. We put up a lot more planning up front and were able to have smaller tasks to work on, which made team development go more smoothly. We didn’t get everything done that we planned, but we fixed the broken distance modal from last sprint, added a modal for searching the database, and created an itinerary table for viewing trip data.

### Problems encountered and resolutions
This one was of the more difficult sprints so far, and we had to overcome many problems. First, the codebase started to get complex, especially in files like Atlas.js, so we worked on cleaning up code and abstracting certain parts into new files and classes. This was seen with our Trip class for storing and modifying trip data. There were a lot of small issues that could go wrong when implementing the find popup, map marker functionality, and the itinerary, so we tried to write more tests and not rush writing the code. To figure out proper client-side testing, we had to read documentation and look at examples from others. Finally, we had difficulty finding time for scrum meetings, so we compromised by setting up informal Slack scrums.

## Retrospective

### What we changed this sprint
Last sprint we did not do a great job of minimizing the size of each task in ZenHub. This time, we focused on breaking them down into smaller chunks so that more tasks could be completed in between class sessions and team members could contribute more to each part. This involved spending more time planning in general at the start of the sprint and helped us stay on track throughout the sprint. Additionally, we integrated code inspections into the process so that we could find defects in our logic and clean up messy components. We put an effort towards writing modular code that is easy to test and understand.

### What went well
Even though it is difficult remotely, we incorporated more pair programming to limit easy logic mistakes and help work out solutions to complex problems. This was done through Slack, Microsoft Teams meetings, and simply sharing a remote branch. Also, we put more emphasis into testing our API with Postman and our client with test driven development. We spent more time attempting to write tests first before jumping into implementation. During the last sprint, we had well over 15 failed Travis builds, but this time we managed to limit those to under 5 by being more aware and making sure to test locally before pushing to GitHub. Finally, we substantially increased our understanding of React, including managing state and building more focused components.

### Potential improvements
While we improved greatly on testing from last time, we would like to focus even more on test driven development going forward to help keep things from breaking as the project grows larger. We had a hard time raising our test coverage this sprint, and that will be a point of focus for next time. Time management could also be improved, as we seemed to flatline on the burndown report halfway through the sprint.

### What we will change next time
In Sprint 4, we will try to better estimate the amount of tasks we can finish during the 3 week sprint. We overplanned this time and didn’t get very far into the Modify Trip epic. Our team will also work on cleaning up long and hard to maintain classes in the codebase. It is becoming difficult to fix and search for things in Atlas.js because it contains a lot of functionality that could be abstracted into other components and files.
