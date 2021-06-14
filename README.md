# Installation
Download App -> https://github.com/mattehalen/Scheduled-countdown/tags

Microsoft Store -> https://www.microsoft.com/store/apps/9PFCNJKLH31Z

https://github.com/mattehalen/Scheduled-countdown/wiki/Installation-&-Alpha-testing-V.1.0.0-%5B2021-01-26%5D

# WEB API (Companion - Generic HTTP Request)
    1. Generic HTTP Request
        * Base URL = http://localhost:[YOUR PORT - Default Port is 3000]/
            * [POST] - admin\offsetPlus
            * [POST] - admin\offsetMinus
            * [POST] - admin\offsetReset

# CHANGE LOG
<details>
  <summary>CHANGE LOG</summary>

  ## Alpha V.0.0.21 [2021-06-14]
    1. description
## Alpha V.0.0.20 [2021-06-13]
    1. [macOS] - Adding entitlements.mas - <key>com.apple.security.network.server</key> <true/> - TEST ONLY IF V.0.0.19 dosen't crash on startup at Apple.
## Alpha V.0.0.19 [2021-06-13]
    1. [macOS] - Removing entitlements.mas & entitlements.mas.inherit - <key>com.apple.security.network.server</key>
        <true/>
## Alpha V.0.0.18 [2021-06-11]
    1. Updated modules. Electron & Electron builder is now using Latest release.
    2. Remove folder EXTRAS
    3. Remove unused modules.
    4. [Back-end] - Created APN-notification.js and moved notification from alert.js to this file.
    5. [Back-end] - Separate all the create FOLDER into it's own .js file
## Alpha V.0.0.17 [2021-06-11]
    1. [MAIN WINDOW] - app.disableHardwareAcceleration()
## Alpha V.0.0.16 [2021-06-10]
    1. [macOS] - entitlements.mas - <key>com.apple.security.cs.disable-library-validation</key> <true/>
    2. [iOS] - APN - Added message to the sendNotification() in src/APN/index.js
## Alpha V.0.0.15 [2021-06-10]
    1. [Back-End] - Added "Headers" for part of Console.log to see whats triggering the log.
    2. -> REMOVED THIS ONE -> [macOS] - entitlements.mas & entitlements.mas.inherit - ITSAppUsesNonExemptEncryption changed to false
    3. [iOS] - APN - options-production changed to true
    4. [iOS] - APN - Now reads from the db-ios-tokens.json file and uses those inside the deviceTokens var.
    OBS !! when receiving token from iOS device. Sometime the Token ends with a ")". This make the token not work. Needs to remove the ")" in the token to get it to receive Push Notifications.
    5. [macOS] - entitlements.mas & entitlements.mas.inherit - <key>com.apple.security.network.server</key>
        <true/>
## Alpha V.0.0.14 [2021-06-09]
    1. install electron-log for logging to file
    2. [MAIN WINDOW] - Added Open log button
    3. [MAIN WINDOW] - Removikrying again to upload app to mac AppStore.
## Alpha V.0.0.13 [2021-06-07]
    1. Change entitlements -> com.apple.security.app-sandbox to FALSE &  "hardenedRuntime":false in package.json for test upload to Apple Store. WORKS on MAS-DEV.
    2. [AppStore Release] - Trying again to upload app to mac AppStore.
## Alpha V.0.0.12 [2021-06-04]
    1. Added Menu options to MAC version av app. Re-open Main Window & How to.
    2. [Back-end] - Added temporary fix for Re-open page. Now it only gives error but doesn't close app.
    3. [AppStore Release] - Trying again to upload app to mac AppStore.
## Alpha V.0.0.11 [2021-06-03]
    1. [Back-end] - APN now pushes to iOS devices but to all devices and not only local devices. THIS IS A KNOW BUG AND NEDS TO BE FIXED. 
    2. [AppStore Release] - Many changes made to try and find a way to upload the app to AppStore. USE MAS and send the pkg file from MAS with transporter to your App store connect.
## Alpha V.0.0.10 [2021-05-28]
    1.[Back-end] - Start adding support for APN (Apple Push Notification) server. 
    2.[Back-end] - Added Store iOS Token when an iOS device is connected. This is so the APN server knows what devices should receive the Notification.
## Alpha V.0.0.9 [2021-05-20]
    1.[MAIN WINDOW] - Fixed so Port input field is linked to the db-settings.json
    2.[Back-end] - fix GitHub HEAD on [MAIN WINDOW]
## Alpha V.0.0.8 [2021-05-17]
    1. [MAIN WINDOW] - Added AutoStart Button
## Alpha V.0.0.6 -> V.0.0.7
    1. Tried to make a Appstore version of the software but no luck yet. increase of version number due to not being able to use same version number on upload to Appstore.
## Alpha V.0.0.5 [2021-03-24]
    1. [src/services/admin-settings.js] - removed local date-string. Didn't save db-Backups on system with local date string using "/".
## Alpha V.0.0.4 [2021-03-19]
    1. [Main Window] - Added buttons to open / & /admin in default browser
    2. Test Submitted App to MicrosoftStore waiting approval
## Alpha V.0.0.3 [2021-03-08]
    1. [Main Window] - Remove Scrollers and added  resizable: false, autoHideMenuBar: true,
    2. [Main Window] - Fixed Bug where Save Port button didn't work after removing choose IP from selection of ip addresses.
## Alpha V.0.0.2 [2021-01-29]
    1. [Main Window] - start_server & stop_server now toggles between hidden and shown to prevent double pressing and to easier show if server is started or not.
    2. [/Admin - User-tab] - now lets you add and delete users. Users can then enter there page on url /users/"your-name" example /user/mathias.
    3. [/users/xxx] - 
       1. [Save - button] - Save the cue-list in users.json
       2. [Add new row - button] - Adds a new row to the cue-list with the title "Added Cue"
       3. [TimeCode is ON - button] - TBA
       4. [Hide Rows ON/OFF - button] - If TimeCode is running and rows are hidden you can push this to un hide All. Good when Capturing TC on rows.
    4. [Alert] - Now works on /watch and /countdown and /users/"your-name"
    5. [/admin - Alert - tab] - Added alertTime so you can chose how long the Alert should last.
## Alpha V.0.0.1 [2021-01-26]
    1. Rebuild of back-end - https://github.com/mukeshkmr776
    2. Implementing Electron for dist
    3. Creating SC-module for the clock & countdown part.



</details>


## BUGS
1. - [ ] -  Auto Reset needs a delay of X when starting a number earlier.
    example - if show should start at 12:00 and we start at 11:55 with the help of offsetMinus and Auto Reset is enabled this will cause the countdown to run again after the reset because the Auto Reset is triggered at the end of countUp. 
2. - [ ] -  Windows Store Version - Scheduled Countdown Alpha V.0.0.5 - GIVES ERROR - Unhandled exception at 0x00007FF7AD1ACA5C in Scheduled-Countdown.exe: 0xC0000005: Access violation writing location 0x0000000000000000.
3. - [X] -  [iOS] - APN - Sometimes the devidetoken ends with a ")". This make the send function fail and the device with ")" will not receive Push.

## Known limitations
    1. [/Admin - Overview-tab] Buttons is not connected yet after back-end rebuild. May not need this anymore due to rebuild of 5min countdown page.
    2. [/Admin - User-tab] - IN PROGRESS
    3. [/Admin - Settings-tab] - Sometimes when saving midi_interface_ID the change only take affect after a restart of the APP.
    4. [APN] - Sends notifications to all iOS devices. Even if not connected to the same network. This means that an APP running "at home" send notifications to people at work.
    
# Websites I got code from
    - https://github.com/nexe/nexe
    - https://www.youtube.com/watch?v=ODlYsEITCBM&t=8s
    - https://guides.github.com/features/mastering-markdown/


# Support this project
    https://www.paypal.com/donate?hosted_button_id=N7GK2QCY8QAWQ        

# Special thanks to
    - https://github.com/mukeshkmr776 - help rebuild back-end for Alpha V.0.0.1
