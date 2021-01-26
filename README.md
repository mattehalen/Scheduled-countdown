# Setup and run

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

# Task lists
- [] New admin-settings structure. Settings -> IP/timeSettings/dayOfWeek/DMX/MIDI/OBS/Color || schedule
- [] ADD DMX Toggle on Settings Page and to admin-settings.js - Toggle Should have a BREAK on the artnet.js so it dosn't log if disalbed.
- [] ADD OBS IP AND PORT to admin-settings
- [] Implament varibles from "timeSettings" countDown, countUp, cueCountDown, cueCountUp, useMIDI_ProgramChange
- [] Install React Native & Socket.io & react-native-watch-connectivity  https://blog.bam.tech/developer-news/how-to-add-an-apple-watch-extension-to-your-react-native-application
- [] JZZ-gui-Select for midi interface
- [] Add save/load to folder for saving adminsettings on other places for backup.
- [] Add Time-varible to Alert Function


# Bugs
- [] offsetTime dosn't effect 5min countdown
- [] Navigated to chrome-error://chromewebdata/ - for some users. macbookAir - Chrome
- [] Dosn't work on Internet Explorer

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
