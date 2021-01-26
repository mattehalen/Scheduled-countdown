# Installation
Download Nodejs -> https://github.com/mattehalen/Scheduled-countdown/releases/tag/Alpha_V.1.0.0

https://github.com/mattehalen/Scheduled-countdown/wiki/Installation-&-Alpha-testing-V.1.0.0-%5B2021-01-26%5D


# CHANGE LOG
## Alpha V.1.0.0 [2021-01-26]
1. Rebuild of back-end - https://github.com/mukeshkmr776
2. Implemanting Electron for dist
3. Creating SC-module for the clock & countdown part.

## BUGS
1. Alert functions dosen't work on - /watch & /countdown
2. Auto Reset needs a delay of X when starting a number eirlier.
exemple - if show should start at 12:00 and we start at 11:55 with the help of offsetMinus and Auto Reset is enabled this will cause the coutdown to run again after the reset because the Auto Reset is triggerd at the end of countUp. 

## Known limitations
1. [Main Window] - Missing conformation when pushing start_server. User don't know if the button is pushed or not. And if button is push more then once the app crashes.
2. [/Admin - Overview-tab] Buttons is not connected yet after back-end rebuild. May not need this anymore due to rebuild of 5mincountdown page.
3.  [/Admin - Alert-tab] - Missing input for legnth of Alert.
4.  [/Admin - User-tab] - IN PROGRESS
 
# Websites I got code from
- https://github.com/nexe/nexe
- https://www.youtube.com/watch?v=ODlYsEITCBM&t=8s
- https://guides.github.com/features/mastering-markdown/


# Support this project
https://www.paypal.com/donate?hosted_button_id=N7GK2QCY8QAWQ

# Special thanks to
- https://github.com/mukeshkmr776 - help rebuild back-end for Alpha V.1.0.0