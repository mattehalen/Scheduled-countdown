# Todolist
https://babeljs.io/docs/en/

## Front End
15. - [X] - iOS / Safari problem with websocket.
16. - [ ] - Add a console Log on /admin that reflects all logs on server.
17. - [ ] - Add seperat user tab for MIDI trigger so yousers can use time and Midi based triggers.
18. - [X] - Remove Watch URL when iOS/Watch app is upp and running and tested. No need for this page. 
## Back End / Database
14. - [X] - Setting Up a Remote Notification Server - https://GitHub.com/node-apn/node-apn
15. - [ ] - Setting Up a Remote Notification Server - https://docs.tizen.org/application/web/guides/messaging/push/
16. - [ ] - Fix - (node:24651) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 wakeup listeners added to [Connection]. Use emitter.setMaxListeners() to increase limit
(Use `Electron --trace-warnings ...` to show where the warning was created)
17. - [X] - Add notification.js under websocket-listeners and move whats now inside alert.js related to notifications.
18. - [X] - [MAIN WINDOW] - Separate all the create FOLDER into it's own .js file - MAKE SURE IT WOKRS WHEN NO FOLDERS ARE THERE. First try faild on this !
19. Update description.md and GitHub description so it includes all new functions.
20. - [X] - Remove folder EXTRAS.
21. - [X] - Update GitHub_assets and start using it on GitHub !!!
22. - [X] - Update all dependencies & modules
23. - [X] - Remove unused modules
24. - [ ] - Add support for added Midi Trigger tab on /admin (same thinking as Schedule tab)
25. - [ ] - Add support for "offline" Timecode running. A normal timmr that you can enable and set startTime 
26. - [ ] - Find solution for "Exit status 4294930435"
27. - [X] - OffsetTime still dosn't work as expected. If +8 minuts it jumps to next scheduled event after scheduled Time. Like Offsettime is missing in the calulation, Problem seams to be releated to OffsetTime no longer is saved in db-settings. Something I may have changed in the past but not on all places.
## Other
2. - [ ] - Install Angular
3. - [ ] - Install TypeScript
4. - [X] - Release Apple Watch App that talks to server. -> This is released around 2021-06-01
5. - [ ] - Release Samsung Watch App that talks to server.
6. - [X] - [MAIN WINDOW] - Add Auto Start on
7. - [X] - [MAIN WINDOW] - Fix so Port input field is linked to the db-settings.json

## User Page
1. - [ ] - Add fullscreen option with only Cuelist shown. Maybe a seperate url with username/full ?
2. - [X] Change overlayTime = 10*1000;
3. - [/] Add Hide rows so it saves with the user. So when page is reloaded it knows the value.
4. - [X] When selecting a cuelist auto Save as SelectedCuelist so the user don't need to push save as selectedCuelist !!
### cue-list
1. - [X] - Add cues-list's. Chose different cue-lists
2. - [ ] Import cue-list / Timecode cue-list from - HOG - GrandMA - Avolites...


