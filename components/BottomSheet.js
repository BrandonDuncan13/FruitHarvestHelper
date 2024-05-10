/* eslint-disable prettier/prettier */
/*
npx react-native run-android
*/
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { withSpring } from 'react-native-reanimated';
import React, { useEffect } from 'react';
// ImagePicker is one of the widely used React Native Camera libraries which was imported here
import ImagePicker from 'react-native-image-crop-picker';
import ProcessImage from './ProcessImage';

// rather than destructuring a lot of different properties you can just pass props
const BottomSheet = (( props ) => {

  // Example useEffect hook to log state changes
  useEffect(() => {
    // Assuming processedImage and numBlossoms are state variables or props
    console.log('Processed Image:', props.processedImage);
    console.log('Number of Detected Blossoms:', props.numBlossoms);
  }, [props.processedImage, props.numBlossoms]);

  // Function for setting image, because the same thing is done twice
  function setImage(props, image)
  {
    console.log(image);
    console.log(image.path);
    // once the image is used then the bottomSheet will be lowered by setting the translateY value to 0
    props.translateY.value = withSpring(0, { damping: 50 });
    /* here state passed from the detectBlossoms file is used to change some new values through the setNewImage function.
      Here we are setting the opacity to 0 which is used in the ImageHolder file to have the opacity of the camera icon change
      once an image is used. The value of path is also set to the path of the caputred image to change the BackgroundImage. */
    props.setNewImage({ opacity: 0, path: image.path });

    // Process the image to find blossoms
    ProcessImage(image, props.setProcessedImage, props.setNumBlossoms);
  }

  /* this function allows you to take a photo from the camera by using the ImagePicker library to open the device's camera
  and then spitting out a bunch of data about the captured image. The data can be used to do things with the image... */
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      // these height and width values are used to set the dimensions of the image that will be captured
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(props, image);
    }).catch((err) => {
      console.log(err.message);
    });
  };

  // this function allows you to choose a photo from the device's photo library by using ImagePicker
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(props, image);
    }).catch((err) => {
      console.log(err.message);
    });
  };

  return (
    <GestureDetector
     // GestureDetector is responsible for creating and updating native gesture handlers based on the gesture provided
     // this gesture provided allows you to pan the bottomSheet (it holds it's previous position, and can close the bottomSheet)
      gesture={props.gesture}
    >
        <Animated.View
          /* an Animated View is needed here since the content inside the bottomSheet has to be Animated to respond
          according to the gesture the user makes. */
          // eslint-disable-next-line react-native/no-inline-styles
          style={[{
            // props aren't able to be passed to styles so an inline style is required
            height: props.SCREEN_HEIGHT,
            width: '100%',
            backgroundColor: '#1a1a1c',
            // the position is absolute so the sheet doesn't get pushed down by each page's content
            position: 'absolute',
            top: props.SCREEN_HEIGHT,
            borderRadius: 25,
          }, props.rBottomSheetStyle,
          // this Animated.View accepts styles from detectBlossoms as a prop. This style updates the translateY value of the sheet
        ]}>
            <View style={styles.line}/>
            <View style={styles.panel}>
                <View style={styles.centerTitle}>
                    <Text style={styles.panelTitle}>Upload Photo</Text>
                    <Text style={styles.panelSubtitle}>Choose a photo to count blossoms</Text>
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
                    onPress={props.lowerSheet}
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
