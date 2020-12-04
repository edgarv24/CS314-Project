# Inspection - Team *T14* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | *FindModal.js (lines 17-248), Optimizer.java (lines 17-175)* |
| Meeting | *12-04-2020, 4:00 PM, Microsoft Teams* |
| Checklist | *[checklist.md](https://github.com/csucs314f20/t14/blob/master/reports/checklist.md)* |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Darin | 15:20 - 15:45 |
| Edgar | 13:30 - 13:48 |
| Rylie | 15:30 - 15:45 |
| Mikayla | 13:45 - 14:00 |

### Problems found

| file:line | problem | hi/med/low | who found | github# |
| --- | --- | :---: | :---: | --- |
| FindModal.js:52,70 | combine functions due to similar code | med | edvarela, rylied, darinh | #436 |
| FindModal.js:54,72,90 | turn repeated formatting code into global constant | low | rylied | #437 |
| FindModal.is:239 | several comments that could be removed for readability | low | cessna17 | #438 |
| Optimizer.java:117 | while loop runs until the time is finished, but the end time should be treated as an upper bound | med | darinh | #440 |
| Optimizer.java:128 | for loop should be terminated if system time exceeds end-by time | med | darinh | #439 |
