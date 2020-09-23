# Sprint 1 - *T14* - *The Fourteeners*

## Goal
### Who is the development team?
The solution should clearly identify the team that created the product and a little bit about the team members.

## Sprint Leader
### *Edgar Varela*

## Definition of Done

* The team's web application is deployed on the production server (black-bottle.cs.colostate.edu).
* The version in server/pom.xml is `<version>1.0</version>`.
* The Product Increment release for `v1.0` created on GitHub.
* The completed metrics are captured below.
* The scrums completed during each lecture are captured below.
* The sprint review and restrospective are captured below.
* The design document is updated (design.md).


## Policies

* GitHub etiquette
  * Never commit directly to master. Create a branch and a pull request instead.
  * Assign a milestone and task to every issue.
  * Don’t commit without a related issue.
  * Always test code locally before pushing to GitHub.
  * Don’t break master. If you do, fix it immediately with the team.
  * Be ready to review and perform pull requests daily for teammates.
* Always test code on a mobile client
* Ask teammates before any major changes 


## Planned Epics
* V1 Protocol
  * The goal of this epic is to allow the user the ability to view server capabilities so that they view which server they're on and know its features. This epic will have a feature that allows the user to click on server information in the footer and see its information, an icon in the footer that shows the current connection status, and an icon in the footer that signifies that more information is available.

* Team Identification
  * The goal of this epic is to allow our team to be identifiable to the rest of the organization. This will allow our team name to be set and seen on the client browser tab, server, and the client application for easier identification and correlation to our group.

* About
  * The goal of this epic is to provide information to the user about the team and its members. This includes a team mission statement, where the purpose and foundation of our efforts will be defined. Additionally, a name, image, and biography will be provided to give an overview of the minds behind this project. Consistency across style, format, and voice will be important to highlight the cohesiveness of the team.

* Where Am I?
  * The goal of this epic is to display the user’s current location. This can be done when the app starts or can allow the user to return to their location after they have changed their map view. To implement this feature, a distinct marker will be created to mark their current location to distinguish it from other points on the map. 

* Where Is?
  * The goal of this epic is to allow the user the ability to see a location on a map using latitude and longitude. The user will be able to type or paste a string with a latitude and longitude that was obtained with another tool. The team will handle validating and converting the user’s latitude and longitude from different formats. 


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *5* | *3* |
| Tasks |  *13*   | *12* | 
| Story Points |  *19*  | *52* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *09-05-2020* | *#26, #25, #24* | *#28, #29, #21, #23* | *none* | 
| *09-09-2020* | *#28, #29, #30, #21, #23* | *#32, #34, #33* | *none* |


## Review

#### Epics done
* V1 Protocol
  *  Goal: To allow the user the ability to view server capabilities so that they view which server they’re on and know some of the server settings. To accomplish this feature we replaced the server name with an information icon that pops open the server settings such as server name, request type and the request version. The connection icon was also replaced to the material-ui icon to signify the connection status. These features were implemented to achieve the goal of the epic, and now users are able to view the server capabilities.
* Team Identification
  * Goal: Identify our team name and number in multiple key places on the website. We accomplished this by changing the text in the tab, header, footer, and server to “t14 The Fourteeners”. Now visitors will be able to identify the team behind this project.
* About
  * Goal: Add information about the team, including a mission statement and biographies for each member. To implement this, we used Reactstrap card components with images, titles, and biography descriptions. In order to reduce code repetition, we wrote a BioCard React component that returns a card with specific passed-in properties. A mission statement card was included at the top.

#### Epics not done 
* Where Is?
  * Goal: To display the user’s current location. This epic was not a part of the sprint goal and was chosen to be worked on if we had extra time. The team chose to focus on implementing the work needed to complete the sprint as best as possible instead of overextending to finish extra epics. 

* Where Am I?
  * Goal: To show the user a location on the map by validating and allowing input of the latitude and longitude. This was not completed due to minimal details on the requirements and a shortage of time for our team.


#### What went well
* Sprint goal was main focus and was met on time
* Communication between the team was constant
  * Regular Microsoft Teams meetings for scrums on lecture days
  * Many chat sessions on Slack to work towards completing tasks and epics
* Offering and receiving help between team members
* Scrum meetings
  * Allowed team to break down tasks and distribute them evenly to ensure equal contribution
* Team worked hard to understand the current code base and add to it with React and JS
* Team learned to work well within the GitHub workflow and follow the GitHub ettiquette listed in Policies


#### Problems encountered and resolutions
* Figuring out how to merge conflicting code
  * Resolved by the team learning the GitHub conflict resolution methods and requests for changes
* Figuring out GitHub features within Intellij
  * Resolved by communicating with team members and reading the documentation provided by instructors
* Microsoft Teams technical issues such as laggy/broken sound or video that affected portions of meetings
  * Usually resolved by restarting devices
* Struggled to nail down meeting times for scrums as our schedules are all pretty different
  * Resolved by keeping up frequent communication between team members and ultimately finding times to meet


## Retrospective

#### What went well
* People
  * Team members worked together very well
  * Figuring out schedules
* Relationships
  * The team didn’t "storm" too much
  * Team members were appreciative of work contributed by others
* Process
  * Planning and executing
  * Scrum meetings were quick and helped get team on same page
* Tools
  * Github integration into Intellij helped us be more efficient
  * Slack was invaluable for keeping in touch with team members
  * ZenHub planning and task delegation


#### Potential improvements
* Better estimate how much we can get done beforehand
* Implement more Clean Code principles such as breaking things down into small functions and limiting code reuse 
* More collaborative meetings that incorporate peer programming


#### What we will change next time
* Ask more questions to Dave and TAs to ensure work is being done correctly
* Consistent small changes everyday to stay on progress (linear burndown report) 
* Keep the sprint goal in mind when estimating how many epics we can finish
* Do more testing before pushing to GitHub
