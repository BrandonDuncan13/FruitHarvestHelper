// Here is where the cpp program is called

import { NativeModules } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
const { HelloWorld } = NativeModules;


export default async function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
    // Will be path to the processed image
    let path = originalImage.path;
    const dirPath = Dirs.CacheDir + '/images/';
    const imageName = 'image.jpg';
    const fullPath = dirPath + imageName;

    try
    {
        /*
            Hello world is a c++ function that is linked to react native, it is
            currently being used for OpenCV to count the number of blossoms
            because Josh cannot figure out how to change the function's name.

            It is defined at src/cpp/hello_world_impl.cpp
        */
        const message = await HelloWorld.sayHello();

        const temp = message.toString();

        // This used '$$' as the delimiter
        const myArray = temp.split("$$");

        setNumBlossoms(myArray[0]);
        path = originalImage.path;//myArray[1];
    }
    // Error catch
    catch(e)
    {
        alert(e);
    }

    // This will be the final processed image path
    // return originalImage.path;//myArray[1];

    // FileSystem.mkdir(dirPath);

    try
    {
        await check_file_path(Dirs.LibraryDir);
        await check_file_path(Dirs.CacheDir);
        // await check_file_path(dirPath);
    }
    catch (err)
    {
        console.error(err.name + ' ' + err.errno + ': ' + err.message);
        return;
    };

    try
    {
        await check_file_path(dirPath);
    }
    catch (err)
    {
        console.log(err.message);

        FileSystem.mkdir(dirPath)
    };

    try
    {
        await check_file_path(fullPath);

        FileSystem.unlink(fullPath);
    }
    catch (err)
    {
        console.log(err.message);
    };

    FileSystem.cp(path, fullPath);

    console.log(fullPath);

    // This sets the processed image
    setProcessedImage({ opacity: 0, path: fullPath });
}


async function check_file_path(path)
{
    var err2;

    await FileSystem.exists(path).then((exists) =>
    {
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

    if(typeof err2 !== 'undefined')
    {
        throw(err2);
    };
}
