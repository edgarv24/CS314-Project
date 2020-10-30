# Sprint 4 - T14 - The Fourteeners

## Goal
### Shorter Trips!
## Sprint Leader
### Mikayla Powell


## Definition of Done

* The version in `server/pom.xml` is `<version>4.0</version>`.
* The Product Increment release for `v4.0` created on GitHub.
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
Introduction
* Sprint 4 focuses on improving the user experience and shortening the trip path through optimization algorithms. Our server will be updated to support the v4 protocol standard that allows query results to be filtered. Then, we will add functionality to shorten the trip using heuristic optimization techniques. For searching the database, a filtering mechanism will be implemented for airport types and geographic elements. Finally, we will enhance the UX using feedback from testers. From past criticisms, we plan to create a new modal to modify the trip and add more details to the itinerary and marker pop-ups. The specific epics and their requirements are outlined below.

v4 Protocol
* Provide server support for version 4 of the protocol standard. This epic will involve updating the request classes and the ServerSettings modal. We will first update version numbers to match the protocol. Then, we will add filter settings to the Config protocol object and display them in the ServerSettings modal. To allow for result filtering, the Find API will be updated to support a “narrow” field. This will modify the SQL query to search for places that relate to the match string, optional airport type(s), and optional geographic element(s).

Shorter
* Implement a way to shorten the trip path through optimization techniques. We plan to add a button on the itinerary or map that the user can press to optimize their trip length. Then, we will research and implement a heuristic optimization algorithm such as nearest neighbor, 2-opt, or 3-opt to quickly respond with an improved path. The origin location will remain the same to prevent confusion during use, and the result will still be a round trip.

Filter Search
* Give users the option of filtering Find requests by criteria such as region and country. The first step will be to request the current server for which airport types and geographic elements it supports. These will be presented to the user as potential filters. Then, the Find modal will be updated to send requests that include the “narrow” field. This will update the SQL query to make a more specific request to the database that helps the user find what they are looking for.

User Experience
* Make the application easier to use for all users. To do this, we will clean up and improve many areas of the site based on feedback from outside testers. One change related to this will be showing more details on the results during a Find request so that the user can identify airports more easily by country, municipality, or other features. Another change will involve adding a button to the Find Modal that will add a selected airport to the trip itinerary. We will also modify trip marker pop-ups to show more details about the location if they are provided. Users would like the ability to add a destination by clicking on the map, so we will add this by including a button in the selected marker’s pop-up. Additionally, we will retain user-inputted coordinate formats from trip places by including a “coordinate” field in each place’s data. Finally, a modal will be added for adding or editing a destination.

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 4 | *count* |
| Tasks |  33   | *count* |
| Story Points |  49  | *sum* |

### Confidence in Task Completion
Our team feels good about our ability to complete the majority of the tasks we have planned. Our production improved significantly between sprints 2 and 3, where we increased the number of completed story points by nearly 36%. We did overplan during sprint 3 and didn’t end up finishing one of the epics, but our knowledge has improved and we are more aware of what it will take to reach our goal. For this sprint, we will attempt to stay more consistent on the burndown report with reduced flatlining.

## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 10-28-2020 | none | #265 #266 #267 #276 | none |

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
