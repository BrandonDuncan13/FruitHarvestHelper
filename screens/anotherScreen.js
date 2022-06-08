/* eslint-disable prettier/prettier */
// npx react-native run-android
import React, { useRef } from 'react';
import { useWindowDimensions, Dimensions, View, StyleSheet, ImageBackground, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, PanGestureHandlerEvent, GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from '../components/BottomSheet';

export default function AnotherScreen() {
  {/* const SPRING_CONFIG = {
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  };

  const dimensions = useWindowDimensions();

  const top = useSharedValue(
    dimensions.height
  );

  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
    };
  });

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerEvent>({
    onStart(_, context) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      top.value = context.startTop + event.translationY;
    },
    onEnd() {
      // Dismissing snap point
      if (top.value > ((dimensions.height / 2) + 200)) {
        top.value = dimensions.height;
      } else {
        top.value = dimensions.height / 2;
      }
    },
  });
*/}

  const myImage = require('../images/bigblossoms.jpg');

  let bs = React.createRef();
  let fall = new Animated.Value(1);

  return (
    <GestureHandlerRootView
    style={{flex: 1}}
    >
      <View style={styles.container}>
        {/* If an ImageBackground is wrapped in a View the height and width must be defined (at least I think so) */}
        <Animated.View style={[styles.imgContainer,
        { opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)) }]}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={myImage}
            >
              <TouchableOpacity
                style={styles.textBox}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <Text style={styles.text}>Blossoming Apple Tree</Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </Animated.View>
        <BottomSheet />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
