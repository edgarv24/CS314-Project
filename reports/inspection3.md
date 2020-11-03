# Inspection - Team *T14* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | FindModal.js (lines 23-149) |
| Meeting | 11-02-2020, 6:00 PM, Microsoft Teams |
| Checklist | [checklist.md](https://github.com/csucs314f20/t14/blob/master/reports/checklist.md) |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Mikayla | 16:00 - 16:45 |
| Darin | 15:30 - 16:20 |
| Edgar | 16:00 - 16:30 |
| Rylie | 16:30 - 17:10 |

### Problems found

| file:line | problem | hi/med/low | who found | github# |
| --- | --- | :---: | :---: | --- |
| FindModals.js:94 | Commented out method renderTripButton() | low | cessna17, ryliedd | #312 |
| FindModal.js:104 | Unused/commented out code in renderLocateButton() | low | cessna17, ryliedd | #323 |
| FindModal.js:136 | Hard-coded limit of 10 | low | cessna17 | #313 |
| FindModal.js:85 | renderButtons should be changed to fulfill single responsiblity principle | low | ryliedd | #314 |
| FindModal.js:77 | listToggle state variable is unnecessary and can be replaced with a conditional | med | darinh | #315 |
| FindModal.js:78 | ListItem key may cause warnings if there is a duplicate place name | med | darinh | #316 |
| FindModal.js:78 | ListItem should have "selected" attribute so users can see when a row is selected | med | darinh | #317 |
| FindModal.js:103 | buttonToggle should be replaced with a "disabled" attribute on the button | med | darinh | #318 |
| FindModal.js:166 | selectedPlace should be reset (to null) when a new response comes back (on both fail or success) | med | darinh | #320 |
| FindModal.js:102 | renderList modal should close after Locate button is pressed | med | darinh | #321 |
| FindModal.js:30 | Unnecessary state variable inputText | med | edvarela | #319 |
| FindModal.js:67 | onChange can be simplified and value can be removed | med | edvarela | #322 |
