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
1. (X) Move db to APPDATA
2. (X) Get Timecode to work     - 2021-01-13
3. (X) src\websocket-listeners\SC-module\lib\db.js & src\services\admin-settings.js are doing the same task. Maybe Remove src\websocket-listeners\SC-module\lib\db.js and just use src\services??
4. (X) getWeekDay Dosn't update proporly inside of src\services\admin-settings.js when pushing Save dayOfWeek button on /admin. I see that db-settings.json file is uppdated correctly but async function getWeekDay() dont get that update.
5. SAVE TO BACKUP   -> Should ask user wherer to save the file
6. Load FRO BACKUP  -> Should ask user to select a file saved on System.
7. (X) When SAVE on /admin is pressed this should reset "newArrayIndex" on src\websocket-listeners\SC-module\lib\TimeArraySorting.js - maybe use system emit?
8. () Implement db-settings
    ### timeSettings
    () offsetTime
    () countDown
    () countUp
    () cueCountDown
    () cueCountUp
    () changeBgColorTimeCountDown
    () changeBgColorTimeCountUp
    ### MIDI
    () useMIDI_ProgramChange
    () midi_interface_ID
    ### Color
    () countDownColor
    () countUpColor
9. SAVE TO BACKUP - Should store with current date and custom text to a folder named Backups at getPath('userData'). 
10. LOAD FROM BACKUP - should list all files inside of Backups.

## Other
1. (X) - Install Electron !!    - 2021-01-13
2. Install Angular
3. Install TypeScript
