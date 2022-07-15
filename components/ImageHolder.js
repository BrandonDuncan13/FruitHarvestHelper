/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import React from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// state is passed from detectBlossom file which was set within the BottomSheet file
// code was made once but used multiple times
export default function ImageHolder({ pressHandler, newImage, activeOpacity=0.65 }) {

  return (
    <View>
      <TouchableOpacity
      // pressHandler in this case makes the "image buttons" not work when sheet is up and work when sheet is down (essentially)
      onPress={pressHandler}
      activeOpacity={activeOpacity}// Changed activeOpacity to be able to be changed
      >
        {/* A box view to hold the image is created */}
        <View style={styles.imageBox}>
            <ImageBackground
                // newImage starts out as template images but is changed when an image is used
                source={{
                    uri: newImage.path,
                }}
                style={styles.image}
                imageStyle={styles.imageStyling}
            >
                {/* A view within the box to hold the image is created to hold a camera icon */}
                <View style={styles.iconBox}>
                    {/* once an image is used, the icon becomes invisible */}
                    <Icon name="camera" size={75} color="#aaaa" style={[styles.icon, {opacity: newImage.opacity}]}/>
                </View>
            </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// device dimensions were used to dynamically style the image box and the image itself (not the icon...this can be done if you want)
const styles = StyleSheet.create({
    imageBox: {
        height: ((Dimensions.get('window').width)) * 0.5,
        width: ((Dimensions.get('window').width)) * 0.5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        height: ((Dimensions.get('window').width)) * 0.5,
        width: ((Dimensions.get('window').width)) * 0.5,
        borderRadius: 15,
    },
    iconBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#aaaa',
        borderRadius: 10,
    },
    imageStyling: {
        borderRadius: 15,
    },
});
