# Todolist
https://babeljs.io/docs/en/

## Front End
4. (X) Auto Scale down Text on #title CSS
5. () Add "Users" to Nav bar on /admin. See which users exist and add / delete new users
8. () midi_interface_ID should be the saved in db-settings. The selection of a new midi interface should be one of its own under midi_interface_ID. Now we don't know which interface is saved in db-settings from settings-tab.
9. (X) remove fs.existsSyn from src\services\admin-settings.js -> listBackups & LoadFromBackup & DeleteBackup
10. (X) Add Overide existing Backup on /admin
11. (X) X Add CheckBox. Auto Reset After each entry ends
12. (X) Add auto reset to db-settings
13. (X) Start / Stop / Restar Server from main Window
14. (X) favicon
15. () ios / Safari problem with websocket.


### currentTime
### cueCountDown
### Sound Button
1. () - Add soun button again to / - /admin - /foh - /stage
### TimeCode

### 5MinCountdown
1. () Fix
### Alert
1. (X) Add Alert function back after moving over to Electron
### Switch to Checkbox insted of range
1. () dayOfWeek
2. () cueBool
3. () fiveBool
4. () useMIDI_ProgramChange

## Back End / Database
8. (-) Implement db-settings
    ### timeSettings
    (X) offsetTime now _offsetTime (not stored in db-settings)
    (X) countDown
    (X) countUp
    (X) cueCountDown
    (X) cueCountUp
    (X) changeBgColorTimeCountDown
    (X) changeBgColorTimeCountUp
    ### MIDI
    () useMIDI_ProgramChange
    () midi_interface_ID
    ### Color
    (X) countDownColor
    (X) countUpColor
12. () midi_interface_ID needs to be a number and not a string. String works on MAC but not PC. Report bug? - Could be related to RTP midi !!!!!!

## Other
1. (X) - Install Electron !!    - 2021-01-13
2. Install Angular
3. Install TypeScript
