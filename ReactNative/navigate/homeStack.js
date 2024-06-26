/* eslint-disable prettier/prettier */
import React from 'react';

// App uses the native stack navigator from React Navigation a third party navigation source
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/home';
import DetectApples from '../screens/detectApples';

const Stack = createNativeStackNavigator();

// Class component called HomeStack holds the navigation layout and logic for the app
const HomeStack = () => {
  return (
    <NavigationContainer>
      {/* The navigation container must be wrapped around the Stack Navigator in order to keep the app's state */}
      <Stack.Navigator
      // Stack Navigator is a stack that allows user to switch between screens -> display screen on top of the stack
        screenOptions={{
          // Customization options for the header and items inside the header
          headerStyle: {
            backgroundColor: '#1a1a1c'
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 21,
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
        // Stack screens are screens that can be added to the stack -> Home screen is first so it's default screen
          name="Home" // Name used to navigate to the screen from another screen
          component={Home}
          options={{
            title: 'Apple Detection App', // Title of screen in the navigation heading
          }}
        />
        <Stack.Screen
        // Screen to navigate to
          name="Detect Apples"
          component={DetectApples}
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
