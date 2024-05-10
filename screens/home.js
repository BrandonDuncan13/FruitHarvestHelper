/* eslint-disable prettier/prettier */
// eslint was causing errors within the terminal so I disabled it
/*
npx react-native run-android
*/
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton';

/* the navigation prop is destructured by the {}'s and we now have a navigation object we can use. When configuring
screens each screen in the stack automatically gets a navigation property that can be used */
export default function Home({ navigation }) {

    const image = require('../images/blossoms.jpg');

    // here a method called navigate from the navigation object is used to navigate to the screen of a specific screen name
    const pressHandler = () => {
      navigation.navigate('Detect Blossoms');
    }

    // buttonText needs to be created in order to have this as the button title
    // since components are code that's reusable we need to pass information that's specific as props
    const buttonText = 'Detect Blossoms';

    return (
        <View style={styles.container}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={image}
            >
              <CustomButton
              // here the CustomButton Component is used and two props are passed to the Component to be used
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
