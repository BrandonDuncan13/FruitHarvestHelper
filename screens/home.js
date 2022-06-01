/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';


export default function Home({ navigation }) {

    const image = require('../images/blossoms.jpg');
    const pressHandler = () => navigation.navigate('Another Screen');

    return (
        <View style={styles.container}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={image}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={pressHandler}
                activeOpacity={0.8}
              >
                <Text style={styles.text}>Navigate To Another Screen</Text>
              </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    text: {
      color: 'white',
      fontSize: 20,
      lineHeight: 40,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    button: {
      alignItems: 'center',
      marginBottom: 120,
      backgroundColor: '#1c1c1a',
      padding: 10,
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
  });
