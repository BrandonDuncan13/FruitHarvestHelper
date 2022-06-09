/* eslint-disable prettier/prettier */
// npx react-native run-android
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home';
import DetectBlossoms from '../screens/detectBlossoms';

const Stack = createNativeStackNavigator();

// no StyleSheet becuase the styling is done within navigation Component(s) properties
const HomeStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
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
          name="Home"
          component={Home}
          options={{
            title: 'Blossom Counter App',
          }}
        />
        <Stack.Screen
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
