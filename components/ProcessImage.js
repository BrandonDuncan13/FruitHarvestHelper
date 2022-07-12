// Here is where I will add the image processing to find blossoms

// import int_sqrt from '../cCode/hello.cpp';
// import React, { Component } from "react";
import { NativeModules } from "react-native";
const { HelloWorld } = NativeModules;


export default async function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )//getNumBlossoms( setNumBlossoms, originalImage )
{
    // Will be path to the processed image
    let imagePath = originalImage.path;

    try
    {
        /*
            Hello world is a c++ function that is linked to react native, it is
            currently being used to count the number of blossoms because Josh
            cannot figure out how to change the function's name.

            It is defined at BlossomCam/src/cpp/hello_world_impl.cpp
        */
        const message = await HelloWorld.sayHello();

        const temp = message.toString();

        // This used '$$' as the delimiter
        const myArray = temp.split("$$");

        setNumBlossoms(myArray[0]);
        path = myArray[1];
    }
    // Error catch
    catch(e)
    {
        alert(e);
    }

    // This will be the final processed image path
    // return originalImage.path;//myArray[1];

    // This sets the processed image
    setProcessedImage({ opacity: 0, path: imagePath });
}


// export default function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
// {
//     // Call to the asynchronous function
//     const processedImagePath = getNumBlossoms( setNumBlossoms, originalImage );

//     // This sets the processed image
//     setProcessedImage({ opacity: 0, path: processedImagePath });
// }
