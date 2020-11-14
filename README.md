# github

# Installation
Download Nodejs -> https://nodejs.org/en/download/

## PC
  1. Open Scheduled-countdown folder and run Run "PC-Install-Script.cmd"
  2. Run "Scheduled-countdown.cmd"

## MAC
 1. Open Scheduled-countdown folder and run "Scheduled-countdown MAC V2.scpt"
 2. Run "Scheduled-countdown MAC V2.scpt"


# New features
- [X] Select which days the Schedule runs. Function dayOfWeek. Added to adminpage

# Task lists
- [] SEND Warning Message on FULL SCREEN
- [] Implament varibles from "timeSettings" countDown, countUp, cueCountDown, cueCountUp, useMIDI_ProgramChange
- [] Install React Native & Socket.io & react-native-watch-connectivity  https://blog.bam.tech/developer-news/how-to-add-an-apple-watch-extension-to-your-react-native-application
- [] JZZ-gui-Select for midi interface


## Bugs
- [] offsetTime dosn't effect 5min countdown
- [] Save on /Mathias dosen't save to correct file

## Bug Fixes
- [X] OffsetTime .json writes empty files sometimes. - tried using sleep didn't work. - now trying increase setTimeoutTime = 150 instead of 50.
- [x] deleteButton on Scheduled don't work more then once. after deleting one it loops thrue and ads old cues again. Move Delete part to socket and dont jump back to adminScript.js?

# Websites I got code from
- https://github.com/nexe/nexe / https://www.youtube.com/watch?v=ODlYsEITCBM&t=8s / https://guides.github.com/features/mastering-markdown/
