// this command is on every page just to make running the code easier
/*
npx react-native run-android
*/

// IMPORTANT: this project uses the bare react native cli not the expo cli
// the folders called components, navigate, and screens contain all of the files and actual code...
import React from 'react';
import HomeStack from './navigate/homeStack.js';

// here a functional component called BlossomCounter is created and exported for the device to read
// the HomeStack component is returned which holds the navigation system for the entire app
// this app uses stack navigation instead of drawer navigation to keep it simple
export default function BlossomCounter() {
  return <HomeStack />;
}
