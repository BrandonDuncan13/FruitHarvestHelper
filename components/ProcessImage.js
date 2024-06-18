import { NativeModules, Platform } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import ImageProcessingModule from './ImageProcessingModule';
import RNFS from 'react-native-fs';

// Djinni HelloWorld class
const { HelloWorld } = NativeModules;

export default async function ProcessImage( originalImage, setProcessedImage, setNumApples ) // Processes images for iOS and Android devices
{
    // Start processing timer for testing purposes
    const start = performance.now();
    let numApples = 0;

    numProcessedImages();

    // Paths for images
    let path = originalImage.path;
    const cacheDirPath = Dirs.CacheDir + '/images/';
    const imageName = 'image' + numProcessedImages.counter + '.jpg';
    const fullPath = cacheDirPath + imageName;

    // Checking to make sure the cache directory exists
    try
    {
        await checkFilePath(Dirs.CacheDir);
    }
    catch (err)
    {
        console.error(err.name + ' ' + err.errno + ': ' + err.message);
        return;
    };

    // Checking if the image directory exists, and if not creating it
    try
    {
        await checkFilePath(cacheDirPath);
    }
    catch (err)
    {
        console.log(err.message);

        FileSystem.mkdir(cacheDirPath);
    };

    // Checking if the image file exists, and if so deleting it (may exist from previous app lifecycle)
    try
    {
        await checkFilePath(fullPath);

        FileSystem.unlink(fullPath);
    }
    catch (err)
    {
        console.log(err.message);
    };

    // Copying the file from the temporary location to the accessible cache dir we created
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
            currently being used for OpenCV to count the number of apples... 
            we cannot figure out how to change the function's name from the default.

            It is defined at src/cpp/hello_world_impl.cpp
        */
        if (Platform.OS === 'ios') // Handles image processing for iOS
        {
            // Djinni method that returns string containing processed data
            const message = await HelloWorld.sayHello();
            const temp = message.toString();

            // Catch any error that may have been in 'HelloWorld.sayHello()'
            if (temp.includes("error:")) {
                throw(temp);
            };

            // '$$' is used as a delimeter
            const myArray = temp.split("$$");
            // Log the path for debugging
            console.log(path);

            // Store the processed image data
            path = myArray[1];
            numApples = myArray[0];

            // Update UI with processed data
            setNumApples(numApples);
            setProcessedImage({ opacity: 0, path: path });

        } else if (Platform.OS === 'android') // Handles image processing for Android
        {
            try {
                // Android native module method that returns number of apple clusters detected
                const response = await ImageProcessingModule.handleImageProcessing(imageName);
                console.log('Response from processImage:', response);
    
                // Access android cache dir
                const androidCacheDir = RNFS.CachesDirectoryPath + '/images/';
                // Retrieve processed image from Android cache
                const processedImagePath = androidCacheDir + 'processedImage' + numProcessedImages.counter + '.jpg';
                console.log('Constructed processed image path:', processedImagePath);
    
                // Use React Native File System to read the processed image as base64
                RNFS.readFile(processedImagePath, 'base64')
                    .then((result) => {
                        // Add prefix to the base64 processed image to get useable URI
                        const dataUri = `data:image/jpg;base64,${result}`;
    
                        // Update the UI now that all information is available
                        setProcessedImage({ opacity: 0, path: dataUri });
                        setNumApples(response);
                        
                    })
                    .catch((err) => {
                        console.log('Error reading processed image:', err);
                    });
              } catch (err) {
                console.log(err.message);
            }
        } else // For devices not recognized
        {
            console.log('Running default code. Device not compatible...');
        }

        // Stop the timer
        const end = performance.now();
        // Calculate and log the execution time
        console.log(`Execution time: ${end - start} ms`);
    }
    catch(err)
    {
        alert(err);
    };
}


async function checkFilePath(path) // Checks for a file path and throws error otherwise
{
    var err2;

    await FileSystem.exists(path).then((exists) =>
    {
        // Log error information
        if(!exists) 
        {
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

    // If err2 is not defined, then there is no error and the file path exits
    if(typeof err2 !== 'undefined')
    {
        throw(err2);
    };
}

function numProcessedImages() {  // Counter function
    if ( typeof numProcessedImages.counter == 'undefined' ) {
        // Initalize the counter if not already initialized
        numProcessedImages.counter = -1;
    }

    numProcessedImages.counter++;
}
