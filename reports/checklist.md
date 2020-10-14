# Inspection Checklist for t14

The goal of an Inspection is to file defects.
This checklist is our guide to help us look for defects.
The checklist will be updated as we identify new faults in our code that we wish to prevent in future inspections.


### Data faults
* Are all program variables initialized before their values are used?
* Have all constants been named?
* Should the upper bound of arrays be equal to the size of the array or size-1?
* Are all cases handled where a null value may lead to errors (bad index/ null reference)?

### Control faults
* For each conditional statement, is the condition correct?
* Is each loop certain to terminate?
* Are compound statements correctly bracketed?
* In case statements, are all possible cases accounted for?
* If a break is required after each case in case statements, has it been included?

### Parameter faults
* Are all input variables used?
* Are values assigned to all output variables before they are output?
* Can unexpected inputs cause corruption?

### Interface faults
* Do all functions and methods have the correct number of parameters?
* Do formal and actual parameter types match?
* Are the parameters in the right order?
* Do all components use a consistent model for shared memory structure?

### Storage faults
* If an object is used, has it been allocated and initialized correctly?

### Exception faults
* Have all possible error conditions been considered?
* Are exceptions caught or thrown by the calling method or object (if needed)?

### Import faults
* Are all imports used somewhere in the file?
* Are new dependencies listed in package.json?

### Test faults
* Do tests actually test what they are supposed to?
* Is there an associated test for all key methods in a class?

### Readability
* Are related variables grouped together?
* Do functions follow the single responsibility principle (only do one thing)?
* Are there any unnecessary comments or commented-out code?
* Do variables, methods, and classes follow proper naming conventions?
* Are long conditional statements simplified into named variables?
* Was the code easy to understand?
* Can the readability of the code be improved by smaller methods?
* Do you think certain methods should be restructured to have more intuitive control flow?

### Usability faults
* Are UI components intuitive to use and accessible?
* Does the API follow the protocol standard?
* Are passed in attributes kept unmodified during server requests?
