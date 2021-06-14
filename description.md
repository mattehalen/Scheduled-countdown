# Scheduled-countdown - Description

## [Short description]
This app is a countdown clock build for theaters and venues where you need a countdown clock to start at a specific time with a specific message. The App does this by creating an HTTP server on the computer you run the app from. You can access this clock locally or from another computer in the network by going to this URL.

Locally - http://localhost:3000/ Remotely within the network – http://your-IP-Address:3000/

You can make changes to this countdown on the admin page. Locally - http://localhost:3000/admin Remotely within the network – http://your-IP-Address:3000/admin


## [Main Window]
A window will appear when you click the Scheduled-countdown icon. On this window, you see what version the app is running and you can also change on what port the app is running on. The Default is 3000. When you want to start the server you just press start_server. Two new buttons will appear and you can use these to open the Admin or Index page on your browser. The index page is the page where the countdown clock will appear.
![alt text][main1]
![alt text][main2]

## [Admin page]
On this page, you control what’s going to be displayed on the index page. You can add entries and even store them in a local file. You also have the settings tab from where you can change when the countdown should appear. You have a countdown and countUp section where the default times are 7 and 2. This means that you will see the current time until it’s 7minutes before the Start time provided in the Schedule tab and now you will see the countdown clock counting down to 0 which is your Start Time and counting up 2 minutes before going back to the current time clock.

<details>
  <summary>Schedule</summary>

  ### Schedule
  ![alt text][Schedule]

In this tab you can add entries and even store them in a local file. Each entry look like this:
"#" | Title | Start Time | Cue Length | Cue | 5Min | DEL
--- | --- | --- | --- | --- | --- | ---
Index | Your Title | HH:MM 24h | HH:MM:SS | TRUE | TRUE | X
1 | Your Title | 16:00 | 00:10:00 | TRUE | TRUE | X




</details>

<details>
  <summary>Settings</summary>

  ### Settings
  ![alt text][Settings]

...
</details>

<details>
  <summary>Overview</summary>

  ### Overview
![alt text][Overview]
...
</details>

<details>
  <summary>Alert</summary>

  ### Alert
![alt text][Alert]

...
</details>

<details>
  <summary>Users</summary>

  ### Users
  ![alt text][Users]

...
</details>


### Users

## [User URL - Cue-List]
Every user created on the /admin page under Users tab will have there own url. The local url is
http://localhost:3000/users/[YOUR USER NAME] you can also just enter the IP-Address of the desktop running the app.
http://192.168.8.11:3000/users/random_User_1.
This page is under development but some functions should already work. This cue-list is controlled by the incoming Timecode to the server.
When the timecode is greater then the timecode entered in the TimeCode field that row disappears
  ![alt text][User-URL]



[main1]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/1.%20Main%20Window%20-%20start_server.png "Main Window 1"
[main2]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/2.%20Main%20Window%20-%20server%20Online.png "Main Window 2"

[Schedule]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/4.%20ADMIN%20-%20Schedule.png "Schedule"
[Settings]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/5.%20ADMIN%20-%20Settings.png "Settings"
[Overview]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/6.%20ADMIN%20-%20Overview.png "Overview"
[Alert]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/7.%20ADMIN%20-%20Alert.png "Alert"
[Users]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/8.%20ADMIN%20-%20Users.png "Users"

[User-URL]: https://github.com/mattehalen/Scheduled-countdown/blob/master/github_assets/v.0.0.20/10.%20UserURL%20-%20%20TimeCode%20Cue-list%20.png "User-URL"