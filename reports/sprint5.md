# Sprint 5 - *T14* - *The Fourteeners*

## Goal
### User Experience

## Sprint Leader
### *Edgar Varela*


## Definition of Done

* The version in `server/pom.xml` is `<version>5.0</version>`.
* The Product Increment release for `v5.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.


## Policies

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap and ReactLeaflet for a consistent user experience (no HTML, CSS, style=, etc.).

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

### User Experience
The goal for this epic is to make the application more intuitive and easier to use. To accomplish this, we will clean up and improve many areas of the user interface based on feedback from outside testers. Based on feedback from the previous sprint, some potential improvements include the ability to add a destination by clicking on the map, the ability to retain user-input coordinate formats from trip places by including a "coordinate" field in each place's data, and adding a modal for adding or editing a destination. However, the plan is to reach out to more users for additional feedback. The team will discuss and decide which improvements to implement by the end of the sprint.  

### File Formats
The user would like to download the trip data in more useful formats. Currently, trips can be downloaded as a JSON, but the user may want other formats for usability. The goal of this epic is to achieve support for CSV, KML and/or SVG formats. The trip itinerary data will be converted into these formats so they can be used in other tools such as spreadsheets and Google Maps. The user will have the option to select between these formats using some form of dropdown or radio buttons in the Trip Settings modal, potentially through a new popup. Many available fields will be included in the downloaded files, including leg distance and cumulative distance for each place. 

### Place Details
The goal of this epic is to help the user know where they are on the map by using reverse geocoding. To accomplish this, we will be using a reverse geocoding library to convert a chosen coordinate to a more detailed location description. The marker popup will be populated with data such as zipe code, municipality, region, country, and/or street address. If the user chooses to add the marker to the trip, this data will be sent to the Add Destination modal to be reviewed and edited before being added to the itinerary. 

### Modify Trip
The user would like to modify the current trip on the client, including the starting location and order of destinations. To accomplish this, we will implement the edit button functionality for each row in the itinerary so that it opens and populates the Add Destination modal with fields that can be edited by the user. Then, the trip order will be able to be reversed by clicking a button on the itinerary. Each row will have the option of setting the corresponding place to the start of the trip, which will rotate the trip to maintain the overall path. 

### Where is?
This epic will allow the user to see a location on the map through inputting a latitude and longitude pair. It will check the coordinate and warn the user if it is invalid through a red box or error message. The Leaflet map will shift and display a marker at the desired location on submit. 

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *5* | *0* |
| Tasks |  *25*   | *0* | 
| Story Points |  *39*  | *0* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *11-18-20* | *none* | *#398, #388, #387, #289* | *none* | 
| *11-20-20* | *#398* | *#387, #388, #289* | *none* | 
| *11-30-20* | *#387* | *#390, #388, #289, #288* | *none* | 


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
