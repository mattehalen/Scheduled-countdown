# Scheduled-countdown - Description

## [Short description]
This app is a countdown clock build for theaters and venues where you need a countdown clock to start at a specific time with a specific message. The App does this by creating an HTTP server on the computer you run the app from. You can access this clock locally or from another computer in the network by going to this URL.

Locally - http://localhost:3000/ Remotely within the network – http://your-IP-Address:3000/

You can make changes to this countdown on the admin page. Locally - http://localhost:3000/admin Remotely within the network – http://your-IP-Address:3000/admin

## [Main Window]
A window will appear when you click the Scheduled-countdown icon. On this window, you see what version the app is running and you can also change on what port the app is running on. The Default is 3000. When you want to start the server you just press start_server. Two new buttons will appear and you can use these to open the Admin or Index page on your browser. The index page is the page where the countdown clock will appear.

## [Admin page]
On this page, you control what’s going to be displayed on the index page. You can add entries and even store them in a local file. You also have the settings tab from where you can change when the countdown should appear. You have a countdown and countUp section where the default times are 7 and 2. This means that you will see the current time until it’s 7minutes before the Start time provided in the Schedule tab and now you will see the countdown clock counting down to 0 which is your Start Time and counting up 2 minutes before going back to the current time clock.
