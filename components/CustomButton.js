/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';

export default function CustomButton({ pressHandler, buttonText }) {

  /* this component is just a simple button with styling that can be reused multiple times. It accepts
  the destructured pressHandler and buttonText props */
  return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.button}
            onPress={pressHandler}
            activeOpacity={0.8}
        >
            <Text style={styles.buttonText}>{ buttonText }</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height: ((Dimensions.get('window').height) * 0.175),
        // read below for how Dimensions can be used to create a dynamic height, width, etc.
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d42d2d', // green color -> #287c37, red color -> #d42d2d
        width: ((Dimensions.get('window').width)) * 0.45,
        // using the Dimensions to grab the width of the window makes it so the width is the right size for each device
        // here we set the button width to 45% of the device's screen width
        height: 60,
        padding: 10,
        borderRadius: 200,
      },
    buttonText: {
        color: 'white',
        fontSize: 17,
        textAlign: 'center',
      },
});
