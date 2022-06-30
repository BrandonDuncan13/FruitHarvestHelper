/* eslint-disable prettier/prettier */
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { withSpring } from 'react-native-reanimated';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import ProcessImage from 'ProcessImage';

const BottomSheet = (( props ) => {

  // Function for setting image
  function setImage(props, image)
  {
    console.log(image);
    console.log(image.path);
    props.translateY.value = withSpring(0, { damping: 50 }); // lowers sheet on photo used from camera
    props.setNewImage({ opacity: 0, path: image.path }); // opacity 0 will make the camera icon disappear

    // Process the image to find blossoms
    ProcessImage(image/*props.newImage*/, props.setProcessedImage, props.setNumBlossoms);
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(props, image);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(props, image);
    });
  };

  return (
    <GestureDetector gesture={props.gesture}>
        <Animated.View
          // eslint-disable-next-line react-native/no-inline-styles
          style={[{
            height: props.SCREEN_HEIGHT, // props aren't able to be passed to styles??
            width: '100%',
            backgroundColor: '#1a1a1c',
            position: 'absolute',
            top: props.SCREEN_HEIGHT,
            borderRadius: 25,
          }, props.rBottomSheetStyle]}>
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
