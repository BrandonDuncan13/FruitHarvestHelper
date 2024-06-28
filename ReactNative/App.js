// this command is on every page just to make running the code easier

// IMPORTANT: this project uses the bare react native cli not the expo cli
/* IMPORTANT: a library called 'react-native-version' was installed
Modify the package.json file's version and run the command 'react-native-version --never-amend' in React Native
directory to simplify updating the version number of the app */
import React from 'react';
import HomeStack from './navigate/homeStack.js';


// App uses stack navigation instead called HomeStack
export default function BlossomCounter() {
  return (
      <HomeStack />
    );
}
