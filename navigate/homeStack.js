/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home';
import AnotherScreen from '../screens/anotherScreen';

const Stack = createNativeStackNavigator();

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
          name="Another Screen"
          component={AnotherScreen}
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
