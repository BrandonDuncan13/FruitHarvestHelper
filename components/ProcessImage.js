// Here is where the cpp program is called

import { NativeModules } from "react-native";
const { HelloWorld } = NativeModules;

import { Dirs, FileSystem } from 'react-native-file-access';


export default async function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
    // Will be path to the processed image
    let path = originalImage.path;
    const imageName = 'image.jpg';

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

    console.log(path);

    // FileSystem.mkdir(dirPath);

    check_file_system(Dirs.CacheDir + '/images/');

    // try
    // {
    //     FileSystem.exists(Dirs.LibraryDir).then((success) =>
    //     {
    //         if(success)
    //         {
    //             console.log("Good! #1");

    //             FileSystem.exists(Dirs.CacheDir).then((success) =>
    //             {
    //                 if(success)
    //                 {
    //                     console.log("Good! #2");

    //                     const dirPath = Dirs.CacheDir + '/images/';
    //                     const fullPath = dirPath + imageName;

    //                     FileSystem.exists(dirPath).then((success) =>
    //                     {
    //                         if(success)
    //                         {
    //                             console.log("Good! #3");

    //                             FileSystem.cp(path, fullPath);
    //                         }
    //                         else
    //                         {
    //                             throw('err3')
    //                         };
    //                     });
    //                 }
    //                 else
    //                 {
    //                     throw('err2')
    //                 };
    //             });
    //         }
    //         else
    //         {
    //             throw('err1')
    //         };
    //     });
    // }
    // catch (err)
    // {
    //     console.error(err);
    // }

    // console.log(fullPath);

    // This sets the processed image
    setProcessedImage({ opacity: 0, path: path });
}


function check_file_system(path)
{
    try
    {
        if(FileSystem.exists(path) == true)
        {
            console.log("Good! #1");
        }
        else
        {
            throw('err1');
        };
    }
    catch (err)
    {
        console.error(err);
    };
}
