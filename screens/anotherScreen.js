/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function anotherScreen() {

    const image = require('../images/bigblossoms.jpg');

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ImageBackground
                    style={styles.backgroundImage}
                    resizeMode="cover"
                    source={image}
                    >
                        <TouchableOpacity
                        style={styles.textBox}
                        activeOpacity={0.8}
                        >
                            <Text style={styles.text}>Blossoming Apple Tree</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
            );
        }

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
  });
