// Here is where the cpp program is called

import { NativeModules } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
const { HelloWorld } = NativeModules;


export default async function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
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
            currently being used for OpenCV to count the number of blossoms
            because we cannot figure out how to change the function's name.

            It is defined at src/cpp/hello_world_impl.cpp
        */
        const message = await HelloWorld.sayHello();

        const temp = message.toString();

        // Catch if there was an error in 'HelloWorld.sayHello()'
        if (temp.includes("error:")) {
            throw(temp);
        };

        // '$$' is used as the delimiter
        const myArray = temp.split("$$");

        setNumBlossoms(myArray[0]);
        path = myArray[1];
    }
    // Error catch
    catch(err)
    {
        alert(err);
    };

    console.log(path);


    // Setting the processed image
    setProcessedImage({ opacity: 0, path: path });
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
