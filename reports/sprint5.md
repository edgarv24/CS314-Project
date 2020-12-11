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
The goal for this epic is to make the application more intuitive and easier to use. To accomplish this, we will clean up and improve many areas of the user interface based on feedback from outside testers. Based on feedback from the previous sprint, some potential improvements include the ability to add a destination by clicking on the map, the ability to retain user-input coordinate formats from trip places by including a "coordinate" field in each place's data, and creating a modal for adding or editing a destination. However, the plan is to reach out to more users for additional feedback. The team will discuss and decide which improvements to implement by the end of the sprint.  

### File Formats
The user would like to download the trip data in more useful formats. Currently, trips can be downloaded as a JSON, but the user may want other formats for usability. The goal of this epic is to achieve support for CSV, KML and/or SVG formats. The trip itinerary data will be converted into these formats so they can be used in other tools such as spreadsheets and Google Maps. The user will have the option to select between these formats using some form of dropdown or radio buttons in the Trip Settings modal, potentially through a new popup. Many available fields will be included in the downloaded files, including leg distance and cumulative distance for each place. 

### Place Details
The goal of this epic is to help the user know where they are on the map by using reverse geocoding. To accomplish this, we will be using a reverse geocoding library to convert a chosen coordinate to a more detailed location description. The marker popup will be populated with data such as zipe code, municipality, region, country, and/or street address. If the user chooses to add the marker to the trip, this data will be sent to the Add Destination modal to be reviewed and edited before being added to the itinerary. 

### Modify Trip
The user would like to modify the current trip on the client, including the starting location and order of destinations. To accomplish this, we will implement the edit button functionality for each row in the itinerary so that it opens and populates the Add Destination modal with fields that can be edited by the user. Then, the trip order will be able to be reversed by clicking a button on the itinerary. Each row will have the option of setting the corresponding place to the start of the trip, which will rotate the trip to maintain the overall path. 

### Where is?
This epic will allow the user to see a location on the map by entering a latitude and longitude pair. It will check the coordinate and warn the user if it is invalid through a red box or error message. The Leaflet map will shift and display a marker at the desired location on submit. 

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *5* | *4* |
| Tasks |  *25*   | *34* | 
| Story Points |  *39*  | *48* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *11-18-20* | *none* | *#398, #388, #387, #289* | *none* | 
| *11-20-20* | *#398* | *#387, #388, #289* | *none* | 
| *11-30-20* | *#387* | *#390, #388, #289, #288* | *none* | 
| *12-02-20* | *#288, #419, #418, #412, #408, #409, #413, #423, #388* | *#390, #391, #392* | *none* | 
| *12-04-20* | *#390* | *#391, #392, #396, #394* | *none* |
| *12-07-20* | *#430, #391, #394, #437, #438* | *#396, #424, #392, #395* | *none* |


## Review
### Introduction
The goal of sprint 5 was to improve the user experience of our product. To do this, we got user feedback to target areas that need improvement, added new file formats for downloading the trip, displayed additional details using reverse geocoding, and implemented ways to edit or add to the trip using new buttons and a modal. The completed and uncompleted epics and their details are outlined below.

### Epics done
### User Experience
**Goal:** Use feedback and intuition to improve the usability and intuitiveness of our trip planner.  
**Process:** One of the first major additions we made to improve the user experience was showing more details on marker popups. For markers in the trip, we added popup labels for the place’s name, location, altitude, and the distance from the origin. Additionally, we added an Edit button to these markers that opens the DestinationModal where fields for that place can be edited or properties such as notes can be added. For non-trip markers, we added an Add button on their popups so that users can add a place to the trip by using the markers on the map alone. Finally, we added directional arrows to the polylines so that the user can tell which way the trip is moving.  

### File Formats
**Goal:** Support a variety of file formats for downloading the trip data.  
**Process:** In this epic, we modified the Trip class so that it supports the construction of different file formats using the stored place data. Previously, it supported only JSON format. We added support for CSV by comma-separating and stringifying the fields of each place. For KML format, we created a helper class that generated the KML boilerplate elements, and then inserted coordinates from the current trip in KML format. This allows the user to download the trip as a KML file and then use it on Google Earth. Finally, we gave the user the ability to choose between these options when downloading the trip with the use of a drop down menu in our Trip Settings Modal.  

### Place Details
**Goal:** Use reverse geocoding to retrieve information about a position on the map.  
**Process:** This epic involved retrieving the reverse geocode data from an online API using an asynchronous fetch command. With this, we could determine the country, region, street address, area code, and more given a coordinate from the map. These details are displayed on the non-trip markers whenever the user clicks somewhere on the map. If the user adds the marker to the trip, the data is used to construct the resulting place data that goes into the trip.

### Modify Trip
**Goal:** Add functionality to change the order of the trip and the details of destinations.  
**Process:** One of the main changes we made in this epic was the addition of a Destination Modal that shows the user a form that they can fill out to add or edit place details. When editing a place already in the trip, this modal is pre-populated with the current data such as the name, coordinate, country, and notes if they are specified. This allows the user to add notes and even change the coordinates and region of a place. Additionally, an option to reverse the trip was added for when the user clicks a button on the itinerary.


### Epics not done 
### Where is?
**Goal:** Allow for the user to see a location on the map by inputting a latitude and longitude pair.  
**Process:** Our team had planned to extend our Find Modal with a tab that would have input boxes for specifying a latitude and longitude to find on the map. These boxes would perform error checking to make sure the coordinates were valid, then the map would shift to that location when a button is pressed. Due to work in other classes and over-planning at the start of the sprint, we did not get around to completing this epic.


### What went well
We met the sprint goal by improving the UX with things such as removing unnecessary map zooming, adding buttons and modals for editing or adding destinations, and adding more download format options. These are all things that users have told us would improve their experience, as well as ideas from the product manager that would improve UX. 

In terms of process, the team thoroughly planned out 5 epics with doable and near-atomic tasks. We learned from previous sprints that breaking tasks down into very simple steps led to more work getting done and less confusion as to what the tasks were meant to accomplish. This allowed us to complete 45+ story points. Although that total is lower than our previous sprint, it's not bad for a team of four on the final sprint with other classes demanding time. Ultimately, we did follow through on our assigned tasks and only failed to complete one epic. 

### Problems encountered and resolutions
One of our biggest problems was working without Travis CI for most of the sprint. Making minor changes on pull requests led to a couple issues such as replacing unnecessary functions resulting in a broken test for someone else later. However, those minor issues led to us being more careful to run our test suites before pushing to GitHub and using the built-in testing statistics in Intellij to estimate our coverage.

Our API had failed some tests from the last sprint regarding the Trip API. Before that, we had been passing all API checks, so we made it a priority to fix the issue even though it wasn't exactly a part of the sprint goal or any epics. One of the problems was that the API was hard-coded to detect a "1.0" for response time so any request with a response time of "1" or any other number would throw a BadRequest exception and fail multiple API tests immediately. That was fixed by improving the conditional statement that checked if the user requested an optimization to handle any request with a response time greater than zero. Another fix to the optimization included improving the response time so that the user will always get their result in less than the time allowed.

Finally, we encountered some problems in our code that were pointed out by Code Climate. We had a few places in our code that had duplication and maintainability issues. There were functions that could have been consolidated into a single function and made more modular and there were some functions with too much complexity or classes with too many functions overall. We used this information from Code Climate to inform our decisions on which files to inspect as a team and helped us look out for those things as we kept working on our tasks.   

## Retrospective

### What we changed this sprint
One of the biggest things that changed this sprint was that everyone was on the same page from the start. That lead to more individual work because everyone knew what they were doing, what the tasks meant, how the team wanted things to be done, and everyone was just focused on completing tasks. The scrum meetings became quicker and more efficient but not rushed. Because everyone was on the same page, there was less dead time during meetings. Questions were asked when they were needed but were also more specific so the team was able to identify solutions quicker. Lastly, there was more emphasis on writing Clean Code the first time. Although that's always been a goal, this sprint it was easier to make it a main focus because we already knew the tools, languages, and other processes. This allowed us to spend less time on reformatting and inspections were focused on bigger issues than style. 

### What went well
As previously stated, we made really good use of Code Climate to find areas in the code that need to be cleaned up. The tool was very appreciated as it gave us excellent starting points for our inspections. One of the other things it helped us with was identifying functions that duplicated a lot of code. That lead to greater awareness of design patterns that helped us made our code more modular. 

The team has developed a great working relationship and this sprint only strengthened that. There was less resistance in asking each other for help. We helped each other resolve problems when we were stuck, not only with finding bugs, but with design patterns as well. We also reached out about UI ideas and implementation to see if anyone else had a better idea of doing it or a different vision. This also seemed to become more efficient this sprint because the team's thoughts were more aligned. This also lead to more efficient teamwork such as more efficient scrums and better software development. We began to look at our architecture at a higher level to identify more modular ways of doing things and separating duties by creating more helper classes. 

Test Driven Development was at the forefront of every single coding session and it was maybe the thing that went best this sprint. We had been testing pretty well for previous sprints, but sometimes it was done after gettings things working. This sprint was driven much more by testing first and it allowed us to maintain our very high test coverage, resolved a large number of existing bugs, and minimized new bugs. 

### Potential improvements
One of the areas that we failed to test as well as the rest of the code base was asynchronous functions. Early on in the semester, we couldn't figure out how asynchronous testing worked and ended up testing around those functions. This sprint, we finally figured out the correct methods of testing async functions. This newfound knowledge could have improved our test coverage even more. Another improvement we could have made was working more during the Thanksgiving break. We fell behind coming out of the break and lead to less work getting done. And finally, we made a lot of improvements all over the code base in terms of making things more modular and extracting functionality into new helper classes to keep things clean and simple, but we were never able to fully reformat Atlas.js into separate components. Although Clean Code practices were still upheld such as small functions and readable code, it was our biggest class coming in at 500 lines. It became hard to find methods and required a lot of scrolling around. We should have found a time to focus on how to break it up into separate components. 

### What we will change next time
Next time, we will stay on track with the burndown chart and work more consistently throughout the sprint instead of in bursts. We also want to team up more on certain tasks. This sprint had more individual work because we were on the same page, but some of the bigger tasks would probably have been finished faster if we had two people working in tandem on the problem. We will also clean up smells and duplication before pushing to GitHub so they don't pile up on Code Climate. And finally, we will estimate what we can get done a bit better so that all the epics get completed at the end of the sprint. 
