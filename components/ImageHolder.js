/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import React from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ImageHolder({ pressHandler, newImage }) {

  return (
    <View>
      <TouchableOpacity
      onPress={pressHandler}
      activeOpacity={0.65}
      >
        <View style={styles.imageBox}>
            <ImageBackground
                source={{
                    uri: newImage.path,
                }}
                style={styles.image}
                imageStyle={styles.imageStyling}
            >
                <View style={styles.iconBox}>
                    <Icon name="camera" size={75} color="#aaaa" style={[styles.icon, {opacity: newImage.opacity}]}/>
                </View>
            </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
}

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
