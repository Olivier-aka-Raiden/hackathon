React native project based on React Native Starter App : https://github.com/mcnamee/react-native-starter-app#getting-started
/!\ This project is made to work on android platform at the moment.

Setup:

 - Make sure you have npm installed with react-native globally.
 - Go to your project folder with a command prompt and type:  rm -rf node_modules && npm install
 - Make sure you have setup your android environment by following the official tutorial for projects with native code: https://facebook.github.io/react-native/docs/getting-started.html
 - Open your project (android folder) with android studio and build with gradle to see if gradle is correctly configured and if you have the correct versions of SDK installed.
 - Install all SDK tools and everything until build succeed
 - Open a new command prompt as administrator and type: "adb devices" to check if your device is recognized by your computer OR
 - If adb isn't installed globally go to C:\Users\UserName\AppData\Local\Android\sdk\platform-tools and type: ./adb devices
 - Also, type: ./adb reverse tcp:8081 tcp:8081  if you have trouble to connect the package manager with the phone
 - Go back to your project root and type: react-native run-android
 - Project should build and launch on your device! (if packager didn't start automatically run "npm start" in your project folder and let it run)