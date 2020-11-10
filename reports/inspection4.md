# Inspection - Team *T14* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | QueryDatabase.java (lines 9-247) |
| Meeting | 11-09-2020, 5:30 PM, Microsoft Teams |
| Checklist | [checklist.md](https://github.com/csucs314f20/t14/blob/master/reports/checklist.md) |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Rylie | 14:30 - 15:10 |
| Edgar | 15:00 - 15:19 |
| Mikayla | 15:15 - 16:00 |
| Darin | 15:45 - 16:15 |

### Problems found

| file:line | problem | hi/med/low | who found | github#  |
| --- | --- | :---: | :---: | --- |
| QueryDatabase.java:9 | class QueryDatabase exceeds the limit of 20 methods with 24 methods | med | ryliedd | #345 |
| QueryDatabase.java:61 | duplication on limit range check and check for null limit | low | edvarela | #346 |
| QueryDatabase.java:104 | repetitive code from the queryWithFiltersMethod | low | ryliedd, cessna17, darinh | #347 |
| QueryDatabase.java:138 | unnecessary conditional, for loop is sufficient | low | darinh | #349 |
| QueryDatabase.java:165 | resulting countries list could be cached for later use, so Config only makes a server request once | low | darinh | #350 |
| QueryDatabase.java:239 | move onTravis() to be under configServerUsingLocation() for readability | low | ryliedd | #348 |
| QueryDatabase.java:244 | move usingTunnel() to be under configServerUsingLocation() for readability | low | ryliedd | #348 |
