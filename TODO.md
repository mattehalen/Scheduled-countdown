# Todolist

## Front End
### currentTime
1. (X) Fix /admin currentTime   - 2021-01-12
2. (X) Fix /foh currentTime     - 2021-01-12
3. (X) Fix /stage currentTime   - 2021-01-12
### cueCountDown
1. (X) Fix /foh cueCountDown    - 2021-01-12
2. (X) Fix /admin cueCountDown  - 2021-01-12
3. (X) Fix /stage cueCountDown  - 2021-01-12
4. () Cue appers even if cueBool is marked as off. /admin /foh / stage
5. () Cue disapers when reaching 0:00:00
### Sound Button
1. () - Add soun button again to / - /admin - /foh - /stage
### TimeCode
1. (X) Add TC to /admin         - 2021-01-13
2. (X) Add TC to /FOH           - 2021-01-13
3. (X) Add TC to /STAGE         - 2021-01-13
4. (X) Fix [object Object] Displayed on /admin & /foh & /stage
### 5MinCountdown
1. () Fix
### Switch to Checkbox insted of range
1. () dayOfWeek
2. () cueBool
3. () fiveBool
4. () useMIDI_ProgramChange

## Back End / Database
8. () Implement db-settings
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
    () countDownColor
    () countUpColor
9. (X) SAVE TO BACKUP - Should store with current date and custom text to a folder named Backups at getPath('userData'). 
10. (X) LOAD FROM BACKUP - should list all files inside of Backups.                     - 2021-01-18
11. (X) LOAD FROM BACKUP - thrue router.post to get a page reload                       - 2021-01-18

## Other
1. (X) - Install Electron !!    - 2021-01-13
2. Install Angular
3. Install TypeScript
