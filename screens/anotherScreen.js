/* eslint-disable prettier/prettier */
// npx react-native run-android
import React from 'react';
import { Dimensions, View, StyleSheet, ImageBackground, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';

const AnotherScreen = () => {

  const myImage = require('../images/bigblossoms.jpg');

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      bs.current.snapTo(1);
    });
  };

  const renderInner = () => (
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
        onPress={() => bs.current.snapTo(1)}
        activeOpacity={0.45}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  let bs = React.createRef();
  let fall = new Animated.Value(1);

  return (
      <View style={styles.container}>
        {/* If an ImageBackground is wrapped in a View the height and width must be defined (at least I think so) */}
        <Animated.View style={[styles.imgContainer,
        { opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)) },
    ]}>
          <TouchableWithoutFeedback onPress={() => bs.current.snapTo(1)}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode="cover"
              source={myImage}
            >
              <TouchableOpacity
              style={styles.textBox}
              activeOpacity={0.8}
              onPress={() => bs.current.snapTo(0)}
              >
                <Text style={styles.text}>Blossoming Apple Tree</Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </Animated.View>
        <BottomSheet
          ref={bs}
          snapPoints={[445, 0]} // 575 for tablet and 445 for phone, 50% for tablet and 58% for phone
          renderContent={renderInner} // first 355 pixels and the first 30% don't show up on the tablet
          renderHeader={renderHeader} // percentages cause the screen to shake in the emulator but not on an actual device
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
          enabledContentTapInteraction={false}
          enabledHeaderGestureInteraction={true}
        />
      </View>
  );
};

export default AnotherScreen;

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
    bgWrapper: {
      margin: 0,
    },
    imgContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });
