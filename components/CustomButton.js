/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';


export default function CustomButton({ pressHandler, buttonText }) {

  // Button component made for reusability
  return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.button}
            // Uses the passed in custom pressHandler
            onPress={pressHandler}
            activeOpacity={0.8}
        >
            <Text
            style={styles.buttonText}
            // Button text is custom too
            >
              { buttonText }
            </Text>
        </TouchableOpacity>
    </View>
  );
}

// Dimensions can be used to create a dynamic height, width, etc.
const styles = StyleSheet.create({
    container: {
        height: ((Dimensions.get('window').height) * 0.175),
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d42d2d', // green color -> #287c37, red color -> #d42d2d (Whichever you prefer)
        // Used dimensions to grab the window size to get right size for each device
        width: ((Dimensions.get('window').width)) * 0.45,
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
