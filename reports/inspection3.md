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
| Edgar |  |
| Rylie |  |

### Problems found

| file:line | problem | hi/med/low | who found | github# |
| --- | --- | :---: | :---: | --- |
| FindModal.js:44 | Items should be contained in a single ModalBody | low | darinh |  |
| FindModals.js:94 | Commented out method renderTripButton() | low | Mikayla |  |
| FindModal.js:104 | Unused/commented out code in renderLocateButton() | low | Mikayla |  |
| FindModal.js:136 | Hard-coded limit of 10 | low | Mikayla |  |
| FindModal.js:77 | listToggle state variable is unnecessary and can be replaced with a conditional | med | darinh |  |
| FindModal.js:78 | ListItem key may cause warnings if there is a duplicate place name | med | darinh |  |
| FindModal.js:78 | ListItem should have "selected" attribute so users can see when a row is selected | med | darinh |  |
| FindModal.js:103 | buttonToggle state variable should be replaced with a "disabled" attribute on the button | med | darinh |  |
| FindModal.js:166 | selectedPlace should be reset (to null) when a new response comes back (on both fail or success) | med | darinh |  |
