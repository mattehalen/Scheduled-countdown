# github

# Installation
Download Nodejs -> https://nodejs.org/en/download/

## PC
  1. Open Scheduled-countdown folder and run Run "PC-Install-Script.cmd"
  2. Run "Scheduled-countdown.cmd"

## MAC
 1. Open Scheduled-countdown folder and run "Scheduled-countdown MAC V2.scpt"
 2. Run "Scheduled-countdown MAC V2.scpt"


## New features
### 2020-11-16
- [X] SEND Warning Message on FULL SCREEN
### Earlier features
- [X] Select which days the Schedule runs. Function dayOfWeek. Added to adminpage

## Task lists
### DONE 2020-11-20
- [X] SAVE on /admin dosn't set newArrayIndex to 0. it's still at the last value. Fix so it goes to 0 when save. Maybe install Socket on rout/index.js - QUICK FIX - newTimeArraySorting() now resets newArrayIndex=0 if newArrayIndex === scheduledTimes.length
### DONE 2020-11-18
- [X] Moved loadDefaultArray from Socket to Rout/Index.js
- [X] Move writeDefaultArray from Socket to Rout/Index.js
### Earlier
- [] Implament varibles from "timeSettings" countDown, countUp, cueCountDown, cueCountUp, useMIDI_ProgramChange
- [] Install React Native & Socket.io & react-native-watch-connectivity  https://blog.bam.tech/developer-news/how-to-add-an-apple-watch-extension-to-your-react-native-application
- [] JZZ-gui-Select for midi interface
- [] Add save/load to folder for saving adminsettings on other places for backup.
- [] Add Time-varible to Alert Function
- [] Socket - getscheduledTimes to Async
- [] scheduleBool in socket.js Seams to not update correctly -
    save dayOfWeek dosn't update the dayOfWeek.js function. Reload of Server make this WORK.
- [] install Socket.js ON index.js



# Bugs
- [] offsetTime dosn't effect 5min countdown
- [] Navigated to chrome-error://chromewebdata/ - for some users. macbookAir - Chrome
- [] Dosn't work on Internet Explorer
- [] myIpArray dont work after update in socket.js

## Bug Fixes
### 2020-11-15
- [X] Save on /Mathias dosen't save to correct
### Earlier fixes
- [X] OffsetTime .json writes empty files sometimes. - tried using sleep didn't work. - now trying increase setTimeoutTime = 150 instead of 50.
- [x] deleteButton on Scheduled don't work more then once. after deleting one it loops thrue and ads old cues again. Move Delete part to socket and don't jump back to adminScript.js?

# Websites I got code from
- https://github.com/nexe/nexe
- https://www.youtube.com/watch?v=ODlYsEITCBM&t=8s
- https://guides.github.com/features/mastering-markdown/








## Support this project
https://www.paypal.com/donate?hosted_button_id=N7GK2QCY8QAWQ
