/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
import React from 'react';

// These two things make up the "Stack Navigator" and must be imported for each stack navigator you want to create
// some apps use multiple stack navigators but most apps use one stack navigator and one drawer navigator
// this uses the native stack navigator from React Navigation a third party navigation source
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/home';
import DetectBlossoms from '../screens/detectBlossoms';

const Stack = createNativeStackNavigator();

// there's no StyleSheet in this file becuase the styling is done within the Components that are configured inside the navigator
// here there is a class component called HomeStack which holds the navigation layout and logic for the app
const HomeStack = () => {
  return (
    <NavigationContainer>
      {/* The navigation container must be wrapped around the Stack Navigator in order to keep the app's state */}
      <Stack.Navigator
      /* The Stack Navigator provides a way to transition between screens where each new screen is placed
      onto the top of the stack. Stacks can also be popped off the stack by clicking the back arrow, etc. */
        screenOptions={{
          // screen options offers customization options for the navigation header, items belonging to the header, etc.
          headerStyle: {
            backgroundColor: '#1a1a1c',
            //backgroundColor: '#111112',
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 21,
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
        /* The Home Component is placed as the first Stack.Screen which makes it the default
        screen that appears on the device. A Stack.Screen is a screen that can be added to the stack
        when an event triggers */
          name="Home" // The name is used for navigating to this Stack.Screen from another screen
          component={Home} // this Stack.Screen is configuring the Home component
          options={{
            title: 'Blossom Counter App', // The title of the screen in the navigation heading
          }}
        />
        <Stack.Screen
        /* Since the Detect Blossoms screen isn't the first Stack.Screen to appear in the code
        it won't be the default screen and will have to be navigated to in order to access it */
          name="Detect Blossoms"
          component={DetectBlossoms}
          options={{
            headerBackTitle: 'Previous',
            headerBackTitleStyle: {
              fontSize: 14,
            },
            headerTintColor: '#287c37',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
