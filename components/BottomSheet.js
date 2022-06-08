/* eslint-disable prettier/prettier */
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import React, { useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = (-SCREEN_HEIGHT + 75);

const BottomSheet = (() => {

  const translateY = useSharedValue(0);

  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
  .onStart(() => {
      context.value = { y: translateY.value };
  })
  .onUpdate((event) => {
    translateY.value = event.translationY + context.value.y;
    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
  })
  .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(0, { damping: 50 });
      } else if (translateY.value < -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
      }
  });

  useEffect(() => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      
    });
  };

  return (
    <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
            <View style={styles.line}/>
            <View style={styles.panel}>
                <View style={styles.centerTitle}>
                    <Text style={styles.panelTitle}>Upload Photo</Text>
                    <Text style={styles.panelSubtitle}>Choose a background photo</Text>
                </View>
                <TouchableOpacity
                    style={styles.panelButton}
                    onPress={takePhotoFromCamera}
                    activeOpacity={0.45}
                >
                    <Text style={styles.panelButtonTitle}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.panelButton}
                    onPress={choosePhotoFromLibrary}
                    activeOpacity={0.45}
                >
                    <Text style={styles.panelButtonTitle}>Choose From Library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.panelButton}
                    onPress={() => {}}
                    activeOpacity={0.45}
                >
                    <Text style={styles.panelButtonTitle}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    </GestureDetector>
  );
});

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: '#1a1a1c',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: 25,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    panel: {
        padding: 20,
        backgroundColor: '#1a1a1c',
        marginTop: -5, // this gets rid of glitches between the header and the panel
        paddingTop: 20,
      },
      panelTitle: {
        color: 'white',
        fontSize: 27,
        height: 35,
      },
      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#287c37', // green color -> #287c37, red color -> #d42d2d
        alignItems: 'center',
        marginVertical: 7,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
      centerTitle: {
        alignItems: 'center',
      },
      bgWrapper: {
        margin: 0,
      },
});
