/* eslint-disable prettier/prettier */
/* This Custom BottomSheet was adapted from:
https://www.youtube.com/watch?v=Xp0q8ZDOeyE&t=2s
on June 19th, 2022 */

import React, { useState, useEffect } from 'react';
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, Text, DeviceEventEmitter } from 'react-native';
import { GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import BottomSheet from '../components/BottomSheet';
import CustomButton from '../components/CustomButton';
import ImageHolder from '../components/ImageHolder';

export default function DetectApples() { // Almost all BottomSheet code is here since some of it is needed in this file

  // Temporary images are initially displayed for original and processed images (updated when image selected)
  const [newImage, setNewImage]             = useState({ opacity: 1, path: 'data:image/png;base64,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' });
  const [processedImage, setProcessedImage] = useState({ opacity: 1, path: 'data:image/png;base64,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' });
  // Use state to update the number of apple clusters detected
  const [numApples, setNumApples] = useState(0);

  // Text for CustomButton component
  const buttonText = 'Go Detect Apples';

  // Doesn't do anything currently
  let fall = new Animated.Value(1);

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  // Allowed to move up to 75 units below top of device's screen
  const MAX_TRANSLATE_Y = (-SCREEN_HEIGHT + 75);
  // Stores current y value of BottomSheet
  const translateY = useSharedValue(0);
  // Will store initial top value of BottomSheet (snap back point)
  const context = useSharedValue({ y: 0 });

  // Used in ImageHolder component
  const pressHandler = () => {
    if (translateY.value === (-SCREEN_HEIGHT / 1.75)) { // Images can be clicked to deactivate the BottomSheet
      translateY.value = withSpring(0, { damping: 50 });
    } else if (translateY.value === 0) { // Images can be clicked to activate the BottomSheet
      translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 });
    }
  };

  // Animated function withSpring makes the sheet translate downward to deactivate BottomSheet
  const lowerSheet = () => {
    translateY.value = withSpring(0, { damping: 50 });
  };

  // Handles the user's gestures (touch commands)
  const gesture = Gesture.Pan()

  .onStart(() => { // At the start of a user gesture (dragging sheet up/down) store top of the sheet
      context.value = { y: translateY.value };
  })
  .onUpdate((event) => { // The amount the user moved the sheet is added to the context to get new screen height
    translateY.value = event.translationY + context.value.y;
    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y); // Don't exceed max height screen can go to
  })
  .onEnd(() => { // At the end of a gesture move the BottomSheet to display position or down
      // Below default display position -> move sheet down
      if (translateY.value > -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(0, { damping: 50 });
      // Above default display posiiton -> move sheet to default display position
      } else if (translateY.value < -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 });
      }
  });

  // Animated style for translations in the y direction
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureHandlerRootView // Has to be wrapped around all components when you want to perform gesture on some components (For Android)
    style={styles.rootView}
    >
      <TouchableWithoutFeedback // BottomSheet lowers when you press any main content
        onPress={lowerSheet}
      >
        <Animated.View style={styles.mainContent} // Main content -> original/processed images, text, and a button
        >
          {/* Animated View is used to change the opacity of the main content when BottomSheet displayed */}
          <View style={styles.formatItems}>
            <Text style={styles.captionText}>Original Image</Text>
            <ImageHolder // ImageHolder component is used to hold default image and state is updated after processing
              pressHandler={pressHandler}
              newImage={newImage}
            />
            <Text style={styles.captionText}>Processed Image</Text>
            <ImageHolder // Not pressable (To make pressable, uncomment 'pressHandler' and comment 'activeOpacity')
              // pressHandler={pressHandler}
              newImage={processedImage}
              activeOpacity={1}
            />
            <Text style={styles.captionText}>Apples Detected: {numApples}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.subContent, { opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)) }]}>
        <CustomButton
          pressHandler={pressHandler}
          buttonText={buttonText}
        />
      </Animated.View>
        {/* BottomSheet component accepts props to handle functionaliy and styling of sheet and update screen with processed data */}
      <BottomSheet
        SCREEN_HEIGHT={SCREEN_HEIGHT}
        gesture={gesture}
        rBottomSheetStyle={rBottomSheetStyle}
        lowerSheet={lowerSheet}
        translateY={translateY}
        newImage={newImage}
        setNewImage={setNewImage}
        setProcessedImage={setProcessedImage}
        setNumApples={setNumApples}
      />
    </GestureHandlerRootView>
  );
}

// Root and sub content are the same size
const styles = StyleSheet.create({
    rootView: {
      flex: 1,
      backgroundColor: 'black',
    },
    // Split the screen into main and sub content
    subContent: {
      flex: 0.175,
      justifyContent: 'flex-end',
    },
    mainContent: {
      flex: 0.825,
      alignItems: 'center',
    },
    formatItems: {
      marginTop: '4%',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    captionText: {
      color: 'white',
      fontSize: 17,
      padding: 6,
    },
  });
