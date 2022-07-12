// Here is where I will add the image processing to find blossoms

// import int_sqrt from '../cCode/hello.cpp';
import React, { Component } from "react";
import { NativeModules, StyleSheet, Text, View } from "react-native";
const { HelloWorld } = NativeModules;


async function getMessage( setNumBlossoms )
{
    try {
        const message = await HelloWorld.sayHello();
        setNumBlossoms(message.toString());
    }
    catch(e)
    {
        alert(e);
    }
}


export default function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
    // int_sqrt = Module.cwrap('int_sqrt', 'number', ['number']);
    // int_sqrt(12);
    // int_sqrt(28);

    // try {
    //     const message = await HelloWorld.sayHello();
    //     console.log(Object.keys(message));
    //     console.log(Object.values(message));
    //     setNumBlossoms(message.toString());
    // }
    // catch(e)
    // {
    //     alert(e);
    // }

    getMessage( setNumBlossoms );

    // This sets the processed image
    setProcessedImage({ opacity: 0, path: originalImage.path });

    // This sets the number of blossoms
    // setNumBlossoms({message});//Math.ceil(Math.random() * 99));

    // setNumBlossoms(int_sqrt(28));
}
