/* eslint-disable prettier/prettier */
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { withSpring } from 'react-native-reanimated';
import React, { useState, useEffect, useRef } from 'react';
// ImagePicker is one of the widely used React Native Camera libraries
import ImagePicker from 'react-native-image-crop-picker';
//import ProcessImage from './ProcessImage';
//import ProcessImageFlask from './ProcessImageFlask';


// Intead of destructing properies you can just pass in props
const BottomSheet = (( props ) => {

  // Timer for image processing
  const [timerStart, setTimerStart] = useState(null);
  const [timerEnd, setTimerEnd] = useState(null);

  const processAndSetImages = (props, image) => { // Detects apple clusters in image, sets the original and processed images
    // Log original image and path
    console.log(image);
    console.log(image.path);

    // Image is already selected so lower BottomSheet by translating
    props.translateY.value = withSpring(0, { damping: 50 });
    // Set the original image selected and opacity to 0 to make camera icon invisible
    props.setNewImage({ opacity: 0, path: image.path });
    // Process the image to detect the apple clusters and set processed image/num apples
    numProcessedImages();
    // ProcessImage(image, props.setProcessedImage, props.setNumApples);
    
    // Send data over to flask for processing and fetch the data after send is complete
    sendDataToServer(image);
  };

  const sendDataToServer = (image) => {
    console.log('sending data to flask...');
  
    // Create FormData instance
    let formData = new FormData();
  
    // Append the image to FormData
    formData.append('image', {
      uri: image.path,
      type: image.mime, // Type of data being sent
      name: image.filename || image.path.split('/').pop(),
    });
  
    // Send FormData to the Flask server
    fetch('http://192.168.1.224:5000/sendData', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
     .then(resp => resp.json())
     .then(json => {
        console.log('Server response:', json);
        fetchProcessedData();
      })
     .catch(error => console.error('Error sending data to server:', error));
  };

  const fetchProcessedData = () => { // Fetch JSON data from Flask web server asynchronously
    console.log('fetching from flask...');

    fetch('http://192.168.1.224:5000/getData', {
      method: 'GET'
    })
   .then(resp => resp.json())
   .then(jsonData => {

        console.log(`Received Promise from flask:`, jsonData);
        console.log('The processed image:', jsonData.procImage);
        console.log('Number of apples:', jsonData.numDetections);

        // Convert base64 string (processedImage) to image source
        const base64String = jsonData.procImage;
        const imageSource = `data:image/jpeg;base64,${base64String}`;

        // Update UI with processed data
        props.setProcessedImage({ opacity: 0, path: imageSource });
        props.setNumApples(jsonData.numDetections);
        setTimerEnd(performance.now());

        // Log the processing time
        const executionTime = timerEnd - timerStart;
        console.log(`Execution time: ${executionTime} ms`);
    })
   .catch(error => console.error("Error fetching data:", error));
  };


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
      processAndSetImages(props, image);
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
      processAndSetImages(props, image);
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
