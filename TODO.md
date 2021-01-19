# Todolist

## Front End
1. (X) Fix -aN:aN:aN on /admin so it say "No more entries today"
2. (X) Move offset section to be just under topRow
3. (X) Add page reload on "Load from / Save to Backup"
4. () Auto Scale down Text on #title CSS
5. () Add "Users" to Nav bar on /admin. See which users exist and add / delete new users
6. (X) Display current offset on a div - just says 1 now
7. () Delete specific db-backups
8. () midi_interface_ID should be the saved in db-settings. The selection of a new midi interface should be one of its own under midi_interface_ID. Now we don't know which interface is saved in db-settings from settings-tab.


### currentTime
### cueCountDown
### Sound Button
1. () - Add soun button again to / - /admin - /foh - /stage
### TimeCode

### 5MinCountdown
1. () Fix
### Alert
1. Add Alert function back after moving over to Electron
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
    () cueCountDown
    () cueCountUp
    (X) changeBgColorTimeCountDown
    (X) changeBgColorTimeCountUp
    ### MIDI
    () useMIDI_ProgramChange
    () midi_interface_ID
    ### Color
    (X) countDownColor
    (X) countUpColor
12. () midi_interface_ID needs to be a number and not a string. String works on MAC but not PC. Report bug?

## Other
1. (X) - Install Electron !!    - 2021-01-13
2. Install Angular
3. Install TypeScript
