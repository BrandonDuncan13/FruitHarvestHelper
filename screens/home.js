/* eslint-disable prettier/prettier */
// npx react-native run-android
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function Home({ navigation }) {

    const image = require('../images/blossoms.jpg');

    const pressHandler = () => navigation.navigate('Detect Blossoms');

    const buttonText = 'Detect Blossoms';

    return (
        <View style={styles.container}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={image}
            >
              <CustomButton
                pressHandler={pressHandler}
                buttonText={buttonText}
              />
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
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
  });
