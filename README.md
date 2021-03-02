# Screen Time Monitor
![alt Screenshot](https://imgur.com/E03lmBl.png) <br>
![alt Screenshot](https://imgur.com/uQIQsh2.png) <br>
![alt Screenshot](https://imgur.com/Fl1Ekcy.png) <br>
## Usage Instructions
**1. Initialize dependencies - run npm install in both root and monitor-js directories.** <br>
**2. Run main.js in /monitor-js in the background - node main.js** <br>
  - this script will poll for the user's active window every 1s and save their activity to *%USERPROFILE%/Documents/ActivityMonitor.org* every 10 seconds.<br>
<!-- end of the list -->
**3. Run the main electron application to visualize data in a timeline and see usage statistics - npm run electron-react**