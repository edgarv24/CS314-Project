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
| 10-30-2020 | #266 #265 #268 #269 #292 | #270 #276 #267 #280 | none |
| 11-03-2020 | #280 #270 #312 #290 #313 #314 #315 #316 #317 #320 #318 #321 #323 | #281 #282 #276 #267 | none |
| 11-04-2020 | #271 #291 #322 #267 | #282 #281 #276 #283 | none |
| 11-06-2020 | #331 #276 | #282 #281 #283 #277 | none |
| 11-09-2020 | #282 #281 #337 #276 #278 #277 #283 | #284 #273 #285 #348 | none |
| 11-11-2020 | #349 #350 #348 #273 #284 | #285 #286 #346 #295 | none |

## Review

### Epics done  
Introduction
* The goal of sprint 4 was to give users the ability to shorten their trip. To do this, we added support for trip optimization using heuristic algorithms. Additionally, we integrated filters into our API more easily searchable for airport types and countries, and we improved the overall user experience based on feedback from outside testers. The completed and uncompleted epics and their details are outlined below.

v4 protocol
* Goal: Provide support for the v4 server protocol.
* Process: To meet the new requirements, we first updated all version numbers to 4 on the client, server, and build. Then, we added a “filters” element to the Config object that contains “type” and “where” fields as options. The “type” value is set to a list of three airport types to filter by, including airport, heliport, and balloonport. The “where” element is set to a list of all 247 country names listed in the database. Additionally, a “narrow” element was added to the Find object so that database queries could be modified to return places that match a specific airport type or country filter. These changes are visible in the Server Settings modal where we displayed the list of supported airport types and a popup dialog of all available country names to filter by.

Shorter
* Goal: Use optimization techniques to shorten the trip while visiting the same destinations.
* Process: To give users the option to shorten their trip path, we added a button in the bottom right of the Atlas that sends a new Trip request with a “response” value of “1.0”. This signifies a request for trip optimization that finishes in less than a second. We disabled this button if there are no places in the trip or if the trip is already optimized. To actually shorten the trip, we modified the Trip object on the server so that it uses optimization only if the “response” option is passed with a value greater than “0”. In this case, the trip places data is passed to an optimization helper class that uses nearest-neighbor and 2-opt heuristic algorithms to create a more optimal path while responding in less time than the response value.

Filter Search
* Goal: Add airport type and geographic element filters for ease of finding places.
* Process: To show the user which filters are available to use on the current server, we added a button and popup to the Server Settings modal that lists the names of all the supported countries. Then, we changed the Find modal behavior to send a Config request to get the list of filters before sending any Find requests to search for matching places. For the airport type filters, we gave users the option to select one of the three options using radio buttons. For the geographic element filters, we added an input select component where supported countries or regions can be searched for and added as a value to filter by in the “narrow” element of the Find request. When the query comes back from the database, the Find modal is populated with the first 20 places relating to the specified match string, airport type, and geographic location.

### Epics not done 
User Experience
* Goal: Make the app simpler and more intuitive to use based on user feedback.
* Process: We made good progress on this epic and added many user experience improvements, but we did not finish everything we planned. One area we improved was the Find Modal, where we added more details to each item in the results list such as a country flag, location data, and airport ID. We also received feedback from users that the itinerary should show more details about each place in the trip, so we added collapsible sections to each row that show many details and actions such as removing or editing the place. For the trip markers on the map, we updated the popups to display the location name and current distance rather than just the latitude and longitude values. We added the ability to change units, download trips as JSONs, and upload a Trip File. Finally, we changed locations of buttons on the Atlas and made some of them unclickable during certain events such as when there are no places in the trip.

### What went well
We were able to complete ___ story points and all of the tasks under the main epics including: v4 protocol, shorter, and filter search. The progress we made on this sprint exceeded our high of 53 story points from the previous sprint 3. Even though we were not able to fully complete the user experience epic we did make really good progress towards getting it completed. This sprint we planned out our tasks extensively from the start, which gave us a very solid outline of what we needed to do the next three weeks in order to complete these epics. Our team reached out to each other much quicker when problems arose which gave us more time to make progress rather than staying stuck on a problem for too long. For our inspection we continuously tried to inspect sections of code that we deemed complex or unorganized in order to honestly critique our work, improve readability, and gain a shared & better understanding of those particular sections of our code. As this semester progressed we have improved our ability to meet on time regularly and use that time efficiently which allowed us to ask questions and help each other solve.

### Problems encountered and resolutions
Throughout the sprint we ran into several various problems, but we were able to work to overcome these challenges. First, we were able to stay a little bit closer to the burndown report line than in the previous semesters, but we still fell behind during some periods. In order to solve this particular issue, we put additional time in on some days to merge in numerous tasks to catch back up. Additionally, we were having some trouble with testing some of the functional components due to being unable to access state easily. To fix this issue, we converted them to normal React classes that were able to get direct access to getting and setting state in Jest. Next, the Find modal input was continuing to lag because we were sending new server requests on every key press and we were able to fix this through adding a timer. This timer keeps it so that new Find requests are sent only when the user stops typing, or after a second has passed since the last key press. Another issue we had was that we had missed closing the connection to the database in several areas of our code and so we got this completed quickly by putting any connection code into a try catch block. Finally, TravisCI was not working throughout most of this sprint and so we had to adjust by creating and running numerous tests of the new code additions before creating a pull request.

## Retrospective

### What we changed this sprint
Through this sprint we had to make several changes in order to ensure the success of our team. We focused more on implementing features and completing tasks rather than planning out the user interface and figuring out the codebase since we had a much clearer idea of what we wanted to do going into this sprint. Through this sprint our scrum meetings were able to become more regular and consistent due to slight schedule changes that allowed us to get on the same page a bit more frequently. Our natural roles have become more established and developed which has allowed work to move quickly and efficiently causing more to get done. The UI design and decisions became more focused on the perspectives of regular users rather than our own. This focus was intentionally shifter to how individuals would want to be able to use it rather than how we thought it should be used. 

### What went well
For our team we had a lot that went really well for us this sprint as we were able to work more efficiently on planning and coding since we have a greater understanding of the process now. We were able to add a lot of new client-side tests and were able to improve our code coverage from 70% to around 90%. The work we were able to do as a team was significantly better as we are able to  understand each other’s strengths and weaknesses and recognize varying points of view and because of this we were able to focus more on the tasks themselves rather than how the work is getting done. Our understanding of the test suits and run configurations allowed us to better isolate testing on both the client and server sides as opposed to starting the server every time to see if tests passed or failed. Understanding clean code was also something that went well for us as we were able to maintain exceptionally readable code despite not having as much pair programming this time around.

### Potential improvements
As with any project there is always room for potential improvements and these are some that we hope to implement during the next sprint. We would like to get better at time management so that we are able to accomplish more during the sprint. More pair programming could also help with our ability to get work done efficiently but also to help develop better working relationships between each of our team members. The use of more modular code and reusable components as we’ve learned that some of our component classes could be split up more than we currently have. We would like to strived for getting better as Jest and Enzyme as that’s one area that tends to slow and bottleneck our productivity. Introducing 3-opt and concurrency is something we would like to accomplish in order to improve our optimization even further. Finally, we want to really improve and refine our UI to show only what is necessary for the user to see and to help reduce some of the excess clutter. 

### What we will change next time
For next time we have several changes that we plan to implement in order to succeed with the next and final sprint. We want to have a much better estimation of how much we can successfully accomplish and to stay on track with the burndown report. Updating the design.md throughout the sprint rather than just at the end is also something we would like to change to help reduce the end rush. We also would like to be able to hold more collaborative sessions rather than just our scrum meetings.
