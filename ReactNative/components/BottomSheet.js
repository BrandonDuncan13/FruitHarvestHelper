/* eslint-disable prettier/prettier */
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { withSpring } from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
// ImagePicker is one of the widely used React Native Camera libraries
import ImagePicker from 'react-native-image-crop-picker';
//import ProcessImage from './ProcessImage';
//import ProcessImageFlask from './ProcessImageFlask';


// Intead of destructing properies you can just pass in props
const BottomSheet = (( props ) => {

  // If a new image is selected then send data to and receive data from server
  const [newImageSelected, setNewImageSelected] = React.useState(false);
  const [dataProcessed, setDataProcessed] = React.useState(false);
  // Timer for image processing
  const [timerStart, setTimerStart] = React.useState(null);
  const [timerEnd, setTimerEnd] = React.useState(null);

  // Fetch JSON data from Flask web server
  useEffect(() => {
    fetch('http://192.168.1.224:5000/getData', {
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(jsonData => {
        console.log(`Received Promise from flask:`, jsonData);
        console.log('The processed image:', jsonData.procImage);
        console.log('Number of apples:', jsonData.numDetections);
        props.setProcessedImage({ opacity: 0, path: jsonData.procImage });
        props.setNumApples(jsonData.numDetections);
        // Record the end time of the timer
        setTimerEnd(performance.now());
      
        // Calculate and log the execution time
        const executionTime = timerEnd - timerStart;
        console.log(`Execution time: ${executionTime} ms`);

        // Prepare for next processed image
        numProcessedImages();
        setNewImageSelected(false);
    })
    .catch(error => console.error("Error fetching data:", error));
  }, [newImageSelected])


  function numProcessedImages() {  // Counter function
    if ( typeof numProcessedImages.counter == 'undefined' ) {
        // Initalize the counter if not already initialized
        numProcessedImages.counter = -1;
    }

    numProcessedImages.counter++;
  }

  const takePhotoFromCamera = () => { // Use iOS or Android device camera to take photo and then apply image processing
    ImagePicker.openCamera({
      // Set dimensions of image that will be captured
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      //processAndSetImages(props, image);
      setTimerStart(performance.now());
      setNewImageSelected(true);
    }).catch((err) => {
      console.log(err.message);
    });
  };

  const choosePhotoFromLibrary = () => { // Allows you to choose a photo from the device's photo library
    ImagePicker.openPicker({
      // Set dimensions of image that will be selected
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      //processAndSetImages(props, image);
      setTimerStart(performance.now());
      setNewImageSelected(true);
    }).catch((err) => {
      console.log(err.message);
    });
  };



  return (
    <GestureDetector
    // Responsible for creating and updating this gesture handler which allows you to pan and close BottomSheet
      gesture={props.gesture}
    >
        <Animated.View
          // Content inside of BottomSheet is animated to respond when user moves it by a gesture
          // eslint-disable-next-line react-native/no-inline-styles
          style={[{
            // Props aren't able to be passed to styles so an inline style is required
            height: props.SCREEN_HEIGHT,
            width: '100%',
            backgroundColor: '#1a1a1c',
            // Absolute position so screen isn't pushed down by pages content (stays in place)
            position: 'absolute',
            top: props.SCREEN_HEIGHT,
            borderRadius: 25,
          }, props.rBottomSheetStyle, // Updates y position of the sheet
        ]}>
            <View style={styles.line}/>
            <View style={styles.panel}>
                {/* Instructions for user on how to use the panel */}
                <View style={styles.centerTitle}>
                    <Text style={styles.panelTitle}>Upload Photo</Text>
                    <Text style={styles.panelSubtitle}>Choose a photo to detect apples</Text>
                </View>
                <TouchableOpacity // BottomSheet doesn't use custom button
                    style={styles.panelButton}
                    onPress={takePhotoFromCamera}
                    activeOpacity={0.45}
                >
                    {/* Take a photo on iOS or Android for processing */}
                    <Text style={styles.panelButtonTitle}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.panelButton}
                    onPress={choosePhotoFromLibrary}
                    activeOpacity={0.45}
                >
                    {/* Select a photo from iOS or Android library for processing */}
                    <Text style={styles.panelButtonTitle}>Choose From Library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.panelButton}
                    onPress={props.lowerSheet}
                    activeOpacity={0.45}
                >
                    {/* Exit the BottomScreen panel */}
                    <Text style={styles.panelButtonTitle}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
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
        marginTop: -5, // This gets rid of glitches between the header and the panel
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
        backgroundColor: '#287c37', // green color -> #287c37, red color -> #d42d2d (Whichever you prefer)
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

export default BottomSheet;
