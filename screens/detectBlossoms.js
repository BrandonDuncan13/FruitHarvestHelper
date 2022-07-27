/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
/* This Custom BottomSheet was adapted from:
https://www.youtube.com/watch?v=Xp0q8ZDOeyE&t=2s
on June 19th, 2022 */

import React, { useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import BottomSheet from '../components/BottomSheet';
import CustomButton from '../components/CustomButton';
import ImageHolder from '../components/ImageHolder';

export default function DetectBlossoms() {
  /* although most of these consts and functions are used in BottomSheet they were created in this file since some of
  them needed to be used here and it seems to make more sense when the code for the bottomSheet's functionality is in one place. */
  const buttonText = 'Choose Picture';

  // Variable to count the number of blossoms
  const [numBlossoms, setNumBlossoms] = useState(0);

  // is used but doesn't actually do anything right now
  let fall = new Animated.Value(1);

  /************ beginning of the bottom sheet's logic ************/
  // here SCREEN_HEIGHT is assigned the height dimensions of the current device
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  // the bottom sheet is allowed to translate 75 units below the top of the screen (top of screen --> -SCREEN_HEIGHT)
  const MAX_TRANSLATE_Y = (-SCREEN_HEIGHT + 75);

  // a const that stores where the bottomSheet is at on the Y axis
  const translateY = useSharedValue(0);

  // a const used to store the initial top value of the bottomSheet when a gesture is initialized
  const context = useSharedValue({ y: 0 });

  // this const will be used in the ImageHolder file to make the "image buttons" not work when sheet is up and work when sheet is down
  const pressHandler = () => {
    // this if statement makes it so the image buttons can be pressed to close the bottomSheet even though they're buttons themselves
    if (translateY.value === (-SCREEN_HEIGHT / 1.75)) {
      translateY.value = withSpring(0, { damping: 50 });
    } else if (translateY.value === 0) {
      translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 }); // change this line when editing the height position of the slider
    }
  };

  // uses an animated function withSpring to make the sheet translate to a Y-value of 0
  const lowerSheet = () => {
    translateY.value = withSpring(0, { damping: 50 });
  };

  // handles the users gestures
  const gesture = Gesture.Pan()
  // storing the bottomSheet's starting top value in context
  .onStart(() => {
      context.value = { y: translateY.value };
  })
  // the amount the user gestured in the Y direction is added with the context value to create a new translateY value
  .onUpdate((event) => {
    translateY.value = event.translationY + context.value.y;
    translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y); // ensures the translateY value doens't exceed max value
  })
  // at the end of the gesture we want to dismiss the bottomSheet or have it return to displayed position
  .onEnd(() => {
      // dismiss the bottomSheet
      if (translateY.value > -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(0, { damping: 50 });
      // return bottomSheet to displayed position
      } else if (translateY.value < -SCREEN_HEIGHT / 1.75) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 1.75, { damping: 50 });
      }
  });

  // this function returns animated styles based on shared values. In this case it returns a transformation (a translation) in the Y direction
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // for path I used an image from the web (search: image icon photo)
  const [newImage, setNewImage]             = useState({ opacity: 1, path: 'data:image/png;base64,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' });
  const [processedImage, setProcessedImage] = useState({ opacity: 1, path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AAAAwMDDo6Oj09PTR0dHv7+/s7OxSUlLf39/T09Pm5ua2trbY2Nj4+Pjc3NyTk5MWFhbBwcGMjIxCQkJaWlrHx8dhYWGhoaFpaWkPDw8nJydERERNTU2qqqp7e3tycnKGhoYhISGwsLB4eHg5OTkuLi4iIiKioqIZGRkhbe73AAAFyElEQVR4nO2d61biMBCABQSKsoigXFcBdVXe/wXXG0ubJpPJbZLZM9+/Pacp+Sykmcwke3EhCIIgCIIgCIIgCIIgCIIgCIJQNP1p1eVFNe07+I1vOxy5HSP9BlXurnpTDTCCvU3ufgaw6SGeIM9v6Ilb+1Pk+xX9prIJjnP3MBjbcLPN3cFgtrBgP3f/IgC/F+e5uxeBOWh4l7t7EfgNGnJ+F57YgIa5excFMWyyHI96JTMa34cZzsCry2AWYrgg6mQYqiJ4sfIVJepiKA/ehhy+o588ehteEvUwlMV/b9gXwxpiWCZiWEcMy0QM65Rl2Fus9uvlcn0Y/wKvY2p4+V5fUnl6ARaYWBoOdx2VrXGazNFw1fL7pBrpr+ZnOPytFfzgUXv9FTdDpcMNdogG4M1LMFRiIYW1pgUzw1+goPYp8jKcWAR1v0Vehu3FwRY3ahtWhpj85YPaiJPhBJW/VJOgnAyfMYKdrtKKkyEyBa2sVDMytL0pTigvRUaGU6ShIsHI8A/WsBlKKY8e/Ii8hva3/YnmW5+PIfZn2Om8QO3Az8hrCM+569w32vExbOU6jTSnNWJYJ68h/lvarM/7Hw25/g6v0YaHRjs+hvhynmZ0wcgQXb7bDIIZGSolB0Zum80YGQ6QhkqB5Q0fQ8wqzSfK2jcnQ1yNslrJxMkQ9xDVxTZWhkpntRwsjcAPyG6ICPO3E7UNL0O1DK9Na0E4j+FkMd3t58+onVYKlmp6TZ40h+Hq+HOLF8RWK4WBMXv4ybOmBb1hr/4Y3Es4J8DkTVvTS27Ya97Fo0rVNNz8GWovpzacvGL+7jA3use4WZmuJjZctrp25XGXhep4nBqHrRGtoW7r1LXPja5XtSFnt2i9Bc/QGuqzR/rfj53RbPxBH7D7uorS0DB1fvVVREFpODRtDbuzPIYgCA0n5tQKvGcuDELD9jB65t7e3Bc6Q3gH6t5XwAqZoa2OohXXxYLKECpH+2YaogFAZDhEHMagLy0MhsgQlaHGnj7iBo3hGiOYaEcjiSF6I7/LOTlYKAwdjtNoL7MEQ2CIWQM88eQVaICkN7x0EOx0tvDy1Gx3v353m6greUfwWj9DcOmozSswC1/8VLY5zQ6SG+7dBDUFov+YI66hN9TvjQAxzcLrM3frYUFkhvgSkRq6ivuLYbdxDX6vfFpDl2G0hq7iXo2e90UYXvoeu9SahWteqdjhJqmhNY9i5L15I+0iMDIYSWnoPIzWeETc6N30wVSGHsNojfMStjkZo0vEEBp6DaM1dj+v/jFweBMm65HMUJkOejnOrvqPXfASRDCipIKiGXoPo47Ae4BTGvoPo45Yg5FEhu2NuqmwnmeZxjBsGHXjzTIgJDHEF7vGwJL1SGGo3DM5cCyVwHDyRif3DRhoJDBElhDGZE9qeKDSqgMEGsPmleGGuG2Q0TEHGrEN7RmYRBgDjciG+C0D0TEFGnENgUR2egyBRlxDKJGdHn3tUVTDA5WLAW2gEdMw/4HmuiNqIhoWcNz3URNoxDM01gNR8tSehcczhJcbqGgHGtEM8w6jZ1pZj1iG6OMAkqMGGsp2KV/D/MPoGSWxE8cQv1eegmagEcXQLZGdnkagEcWwuP80oR5oxDBE1gNRUiuvimBYzjBa4xxohBuGZmAS8S+jEWwYIQOThlN5Vajh4Ngples4hmQZGHfeejEMQxLZyel+dVF5WTsaUmZgPOgGGxY6jJ55CDT0rAeiZBliOKHPwHiwDzF0LKvMxE7ptoNhgbNRLYfmPx0MmSKG/BFD/oghf8SQP2LIHzHkjxjyRwz5I4b8EUP+iCF/QMMSCtdC2YCGxZVceACfuYU+oqRg5qBhAQWkwVi2ZBLtmkzIFhYsqj7PD+tBTejD+wvFfpzGAHFkV8FY95t+0OP8TtygDmYeZNh7F4kKe7r2mOc39ehyGlx/WnV5UU1TnJMmCIIgCIIgCIIgCIIgCIIgCIIQkb/DOnjjNsAtOwAAAABJRU5ErkJggg==' });

  return (
    <GestureHandlerRootView
    style={styles.rootView}
    >
    {/* The GestureHandlerRootView has to be wrapped around all Components in a file when you want to
    be able to perform a gesture on some of the Components. This is required for gestures to work on Android devices. */}
      <TouchableWithoutFeedback
        // this TouchableWithoutFeedback calls a function that lowers the bottomSheet when you click any of the content inside of it
        onPress={lowerSheet}
      >
        {/* If an ImageBackground is wrapped in a View the height and width of the ImageBackground must be defined
        (the code for this is gone but still may be helpful) */}
        <Animated.View style={styles.mainContent}>
          {/* Here an Animated View will be used to change the opacity of the content when the bottomSheet is up */}
          <View style={styles.formatItems}>
            <Text style={styles.captionText}>Original Image</Text>
            <ImageHolder
              // the ImageHolder Component is used and pressHandler and newImage are passed to it as props
              pressHandler={pressHandler}
              newImage={newImage}
            />
            <Text style={styles.captionText}>Processed Image</Text>
            <ImageHolder
              // The porcessed image is now not pressable
              // To make pressable, uncomment 'pressHandler' and comment 'activeOpacity'
              // pressHandler={pressHandler}
              newImage={processedImage}
              activeOpacity={1}
            />
            <Text style={styles.captionText}>Blossoms Detected: {numBlossoms}</Text>
          </View>
        </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.subContent, { opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)) }]}>
          {/* Here an Animated View will be used to change the opacity of the content when the bottomSheet is up */}
            <CustomButton
              // the CustomButton Component is used and props are passed to tell this button what to do
              pressHandler={pressHandler}
              buttonText={buttonText}
            />
        </Animated.View>
        {/* The BottomSheet Component is used here which accepts props in order to handle the
        functionaliy of the sheet, the styling of the sheet, and set two new values after the image is taken */}
        <BottomSheet
          SCREEN_HEIGHT={SCREEN_HEIGHT}
          gesture={gesture}
          rBottomSheetStyle={rBottomSheetStyle}
          lowerSheet={lowerSheet}
          translateY={translateY}
          newImage={newImage}
          setNewImage={setNewImage}
          setProcessedImage={setProcessedImage}
          setNumBlossoms={setNumBlossoms}
        />
    </GestureHandlerRootView>
  );
}

// rootView and subContent are the same size
const styles = StyleSheet.create({
    rootView: {
      flex: 1,
      backgroundColor: 'black',
    },
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
