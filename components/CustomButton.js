/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';

export default function CustomButton({ pressHandler, buttonText }) {

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
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d42d2d', // green color -> #287c37, red color -> #d42d2d
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
