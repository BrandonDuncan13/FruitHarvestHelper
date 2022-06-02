/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

const AnotherScreen = () => {

  const image = require('../images/bigblossoms.jpg');

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.centerTitle}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <BottomSheet
            ref={bs}
            snapPoints={[445, 0]}
            renderContent={renderInner}
            renderHeader={renderHeader}
            initialSnap={1}
            callbackNode={fall}
            enabledGestureInteraction={true}

        />
        <Animated.View style={{opacity: Animated.add(0.4, Animated.multiply(fall, 1.0)),
        flex: 1,
        }}>
          <View style={styles.bgWrapper}>
          <ImageBackground
            style={styles.backgroundImage}
            resizeMode="cover"
            source={image}
          >
            <TouchableOpacity
            style={styles.textBox}
            activeOpacity={0.8}
            onPress={() => bs.current.snapTo(0)}
            >
              <Text style={styles.text}>Blossoming Apple Tree</Text>
            </TouchableOpacity>
          </ImageBackground>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
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
      flex: 1,
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
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    panelTitle: {
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
      backgroundColor: '#FF6347',
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
