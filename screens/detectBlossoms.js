/* eslint-disable prettier/prettier */
// npx react-native run-android
import React from 'react';
import { Dimensions, View, StyleSheet, ImageBackground, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import BottomSheet from '../components/BottomSheet';

export default function DetectBlossoms() {

  const myImage = require('../images/bigblossoms.jpg');

  let fall = new Animated.Value(1);

  // start
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const MAX_TRANSLATE_Y = (-SCREEN_HEIGHT + 75);

  const translateY = useSharedValue(0);

  const context = useSharedValue({ y: 0 });

  const raiseSheet = () => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 }); // change this line when editing the position height of the slider
  };

  const lowerSheet = () => {
    translateY.value = withSpring(0, { damping: 50 });
  };

  const gesture = Gesture.Pan()
  .onStart(() => {
      context.value = { y: translateY.value };
  })
  .onUpdate((event) => {
    translateY.value = event.translationY + context.value.y;
    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
  })
  .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(0, { damping: 50 });
      } else if (translateY.value < -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 });
      }
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  // finish

  return (
    <GestureHandlerRootView
    style={styles.rootView}
    >
      <View style={styles.container}>
        {/* If an ImageBackground is wrapped in a View the height and width must be defined (this is my guess why this works) */}
        <Animated.View style={[styles.imgContainer,
        { opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)) }]}
        >
          <TouchableWithoutFeedback onPress={lowerSheet}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={myImage}
            >
              <TouchableOpacity
                style={styles.textBox}
                activeOpacity={0.8}
                onPress={raiseSheet}>
                <Text style={styles.text}>Blossoming Apple Tree</Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </Animated.View>
        <BottomSheet
          SCREEN_HEIGHT={SCREEN_HEIGHT}
          gesture={gesture}
          rBottomSheetStyle={rBottomSheetStyle}
          lowerSheet={lowerSheet}
          translateY={translateY}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    rootView: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundImage: {
      marginLeft: 0,
      width: '100%',
      height: '100%',
    },
    text: {
      color: 'white',
      fontSize: 20,
      lineHeight: 40,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textBox: {
      marginHorizontal: 60,
      marginTop: 225,
      backgroundColor: '#1c1c1a',
      padding: 10,
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
    header: {
        backgroundColor: '#1a1a1c',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: -5,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 64,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'gray',
        marginBottom: 10,
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
    imgContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });
