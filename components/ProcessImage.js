// Here is where the cpp program is called

import React, { useState, useEffect } from 'react';
import { NativeModules, Platform, Base64 } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import ImageProcessingModule from './ImageProcessingModule';
import RNFS from 'react-native-fs';

const { HelloWorld } = NativeModules;

export default async function ProcessImage( originalImage, setProcessedImage, setNumApples )
{
    // Start processing timer for testing purposes
    const start = performance.now();

    // Create num apples var
    let numApples = 0;

    // Counter
    countMyself();

    // Paths
    let path = originalImage.path;
    const dirPath = Dirs.CacheDir + '/images/';
    const imageName = 'image' + countMyself.counter + '.jpg';
    const fullPath = dirPath + imageName;

    // Checking to make sure the cache directory exists
    try
    {
        await check_file_path(Dirs.CacheDir);
    }
    catch (err)
    {
        console.error(err.name + ' ' + err.errno + ': ' + err.message);
        return;
    };

    // Checking if the image directory exists, and if not creating it
    try
    {
        await check_file_path(dirPath);
    }
    catch (err)
    {
        console.log(err.message);

        FileSystem.mkdir(dirPath);
    };

    // Checking if the image file exists, and if so deleting it
    try
    {
        await check_file_path(fullPath);

        FileSystem.unlink(fullPath);
    }
    catch (err)
    {
        console.log(err.message);
    };

    // Copying the file from the temporary location to somewhere that can be accessed
    try
    {
        await FileSystem.cp(path, fullPath);
    }
    catch (err)
    {
        console.log(err.message);
    };

    console.log(fullPath);

    // Sending the image to be processed
    try
    {
        /*
            Hello world is a c++ function that is linked to react native, it is
            currently being used for OpenCV to count the number of apples
            because we cannot figure out how to change the function's name.

            It is defined at src/cpp/hello_world_impl.cpp
        */
        if (Platform.OS === 'ios')
        {
            const message = await HelloWorld.sayHello();

            const temp = message.toString();

            // Catch if there was an error in 'HelloWorld.sayHello()'
            if (temp.includes("error:")) {
                throw(temp);
            };

            // '$$' is used as the delimiter
            const myArray = temp.split("$$");

            // get the data from myArray
            path = myArray[1];
            numApples = myArray[0];

            // Update UI with processed data
            setNumApples(numApples);
            setProcessedImage({ opacity: 0, path: path })
;
            // Stop the timer
            const end = performance.now();

            // Calculate and log the execution time
            console.log(`Execution time: ${end - start} ms`);
        } else if (Platform.OS === 'android')
        {
            try {
                const response = await ImageProcessingModule.handleImageProcessing(imageName);
                console.log('Response from processImage:', response); // Log the raw response
    
                setNumApples(response);
    
                // access android cache dir
                const androidCacheDir = RNFS.CachesDirectoryPath + '/images/';
    
                const processedImagePath = androidCacheDir + 'processedImage' + countMyself.counter + '.jpg';
                console.log('Constructed processed image path:', processedImagePath);
    
                // Use RNFS to read the processed image file as base64
                RNFS.readFile(processedImagePath, 'base64')
                    .then((result) => {
                        // Convert the base64 string to a data URI
                        const dataUri = `data:image/jpg;base64,${result}`;
    
                        // Update the state with the processed image data URI
                        setProcessedImage({ opacity: 0, path: dataUri });
                        
                        // Indicate state was updated
                        console.log('State updated with processed image and number of apples');
                        android = true;
    
                        console.log('Processing Timer Ended...');
                        // Stop the timer
                        const end = performance.now();
    
                        // Calculate and log the execution time
                        console.log(`Execution time: ${end - start} ms`);
                    })
                    .catch((err) => {
                        console.log('Error reading processed image:', err);
                    });
              } catch (err) {
                console.log(err.message);
            }
        } else
        {
            console.log('Running default code. Device not compatible...');

            // Stop the timer just because
            const end = performance.now();
        }
    }
    // Error catch
    catch(err)
    {
        alert(err);
    };

    console.log(path);
}


// Function checks if a path exists, and if not throws an error
async function check_file_path(path)
{
    var err2;

    // Checks if the path exists
    await FileSystem.exists(path).then((exists) =>
    {
        if(!exists)
        {
            // Error information
            var error = new Error("PathError, no such file or directory '" + path + "'");
            error.errno = 404;
            error.code = 'PathError';
            error.path = 'InvalidFile';
            // error.syscall = 'open';
            // error.name = error.code;
            // error.id = error.errno;

            throw(error);
        };
    }).catch((err1) => 
    {
        err2 = err1;
    });

    // If err2 is not defined, then there is no error and the function exits
    if(typeof err2 !== 'undefined')
    {
        throw(err2);
    };
}


// Counter function
// Copied from: https://stackoverflow.com/a/1535650
function countMyself() {
    // Check to see if the counter has been initialized
    if ( typeof countMyself.counter == 'undefined' ) {
        // It has not... perform the initialization
        countMyself.counter = -1;
    }

    // Do something stupid to indicate the value
    countMyself.counter++;
}
