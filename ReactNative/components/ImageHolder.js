/* eslint-disable prettier/prettier */
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// State is passed from BottomSheet to detectApples component
export default function ImageHolder({ pressHandler, newImage, activeOpacity=0.65 }) {

  return (
    <View>
      <TouchableOpacity // Makes image box clickable
      // PressHandler makes image clickable unless pop-up is already up
      onPress={pressHandler}
      activeOpacity={activeOpacity}
      >
        <View style={styles.imageBox}>
            <ImageBackground // Template image until image is selected
                source={{
                    uri: newImage.path,
                }}
                style={styles.image}
                imageStyle={styles.imageStyling}
            >
                <View style={styles.iconBox}>
                    {/* Icon becomes invisible once an image is selected */}
                    <Icon name="camera" size={75} color="#aaaa" style={[styles.icon, {opacity: newImage.opacity}]}/>
                </View>
            </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Devices dimensions are used to style dynamically
const styles = StyleSheet.create({
    imageBox: {
        // When ImageBackground is wrapped in a View the height and width must be defined
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
