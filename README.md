# Installation
Download Nodejs -> https://github.com/mattehalen/Scheduled-countdown/tags

Microsoft Store -> https://www.microsoft.com/store/apps/9PFCNJKLH31Z

https://github.com/mattehalen/Scheduled-countdown/wiki/Installation-&-Alpha-testing-V.1.0.0-%5B2021-01-26%5D

# WEB API (Companion - Generic HTTP Request)
    1. Generic HTTP Request
        * Base URL = http://localhost:[YOUR PORT - Default Port is 3000]/
            * [POST] - admin\offsetPlus
            * [POST] - admin\offsetMinus
            * [POST] - admin\offsetReset

# CHANGE LOG

## Alpha V.0.0.10 [2021-05-28]
    1.[Back-end] - Start adding support for APN (Apple Push Notification) server. 
    2.[Back-end] - Added Store ios Token when an ios device is connected. This is so the APN server knows what devices should receive the Notification.
## Alpha V.0.0.9 [2021-05-20]
    1.[MAIN WINDOW] - Fixed so Port input field is linked to the db-settings.json
    2.[Back-end] - fix github HEAD on [MAIN WINDOW]
## Alpha V.0.0.8 [2021-05-17]
    1. [MAIN WINDOW] - Added AutoStart Button
## Alpha V.0.0.6 -> V.0.0.7
    1. Tried to make a Appstore version of the software but no luck yet. increse of version number due to not being able to use same version number on upload to Appstore.
## Alpha V.0.0.5 [2021-03-24]
    1. [src/services/admin-settings.js] - removed local datestring. Didn't save db-Backups on system with local date string using "/".
## Alpha V.0.0.4 [2021-03-19]
    1. [Main Window] - Added buttons to open / & /admin in default browser
    2. Test Submitted App to MicrosoftStore waiting approval
## Alpha V.0.0.3 [2021-03-08]
    1. [Main Window] - Remove Scrollers and added  resizable: false, autoHideMenuBar: true,
    2. [Main Window] - Fixed Bug where Save Port button didn't work after removing choose IP from selection of ip addresses.
## Alpha V.0.0.2 [2021-01-29]
    1. [Main Window] - start_server & stop_server now toggles between hidden and shown to prevent double pressing and to easier show if server is started or not.
    2. [/Admin - User-tab] - now lets you add and delete users. Users can then enter there page on url /users/"yourname" example /user/mathias.
    3. [/users/xxx] - 
       1. [Save - button] - Save the cuelist in users.json
       2. [Add new row - button] - Adds a new row to the cuelist with the title "Added Cue"
       3. [TimeCode is ON - button] - TBA
       4. [Hide Rows ON/OFF - button] - If TimeCode is runing and rows are hidden you can push this to un hide All. Good when Captureing TC on rows.
    4. [Alert] - Now works on /watch and /countdown and /users/"yourname"
    5. [/admin - Alert - tab] - Added alertTime så you can chose how long the Alert should last.
## Alpha V.0.0.1 [2021-01-26]
    1. Rebuild of back-end - https://github.com/mukeshkmr776
    2. Implemanting Electron for dist
    3. Creating SC-module for the clock & countdown part.

## BUGS
    1. Auto Reset needs a delay of X when starting a number eirlier.
    exemple - if show should start at 12:00 and we start at 11:55 with the help of offsetMinus and Auto Reset is enabled this will cause the coutdown to run again after the reset because the Auto Reset is triggerd at the end of countUp. 
    2. () Windows Store Version - Scheduled Countdown Alpha V.0.0.5 - GIVES ERROR - Unhandled exception at 0x00007FF7AD1ACA5C in Scheduled-Countdown.exe: 0xC0000005: Access violation writing location 0x0000000000000000.

## Known limitations
    1. [/Admin - Overview-tab] Buttons is not connected yet after back-end rebuild. May not need this anymore due to rebuild of 5mincountdown page.
    2. [/Admin - User-tab] - IN PROGRESS
    3. [/Admin - Settings-tab] - Sometimes when saving midi_interface_ID the change only take affect after a restart of the APP.
    
# Websites I got code from
    - https://github.com/nexe/nexe
    - https://www.youtube.com/watch?v=ODlYsEITCBM&t=8s
    - https://guides.github.com/features/mastering-markdown/


# Support this project
    https://www.paypal.com/donate?hosted_button_id=N7GK2QCY8QAWQ        

# Special thanks to
    - https://github.com/mukeshkmr776 - help rebuild back-end for Alpha V.0.0.1
