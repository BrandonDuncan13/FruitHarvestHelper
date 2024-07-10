# Fruit Harvest Helper Mobile App
## Overview/Contents
A Northwest Nazarene University (NNU) research project run by the Robotics Vision Lab to create a mobile application for helping farmers get a fruit yield estimation for their orchards via image processing. This mobile app is cross-platform compatible across iOS and Android
through React Native, a popular JavaScript framework. While the front-end is all React Native and JavaScript, the back-end of the Fruit Harvest Helper is more complex 
since there are currently two different back-ends, and there is no easy way to get React Native apps to have a shared back-end. The first back-end created is the back-end that 
uses an OpenCV C++ apple detection algorithm, which has separate code for iOS and Android. For iOS, a library called Djinni is used in order to create an environment where the React
Native app can recognize and compile C++ code. While this was a good idea for getting iOS and Android code for the back-end into one spot, Android had its complications since receiving an image from the cache in C++ is challenging due to Android permissions. Instead of Djinni, the Android back-end uses an Android Native Module to compile C++ code
used in an Android project. This back-end is initially complex to understand as the data is originally sent from the front-end to Java and then is sent to C++ using Java Native Interface (JNI). Once the data is processed using the same OpenCV C++ algorithm, it gets sent back the same way it came, going to Java and then the front-end. As you
can imagine, this is significantly slower than its iOS counterpart, as it takes a little over 1 second to process an image. However, for the C++ back-end, both of these setups work
just fine as they can process an image of an apple tree after a farmer either captures or selects the image for processing and sends the number of apples detected and the 
processed image back to the front-end to display it to the farmer. There is also an entirely different back-end that still needs to be completed, as it's just set up for use and has no working algorithms. This back-end is a Python back-end that uses Flask, a Python framework, to send and fetch data from a server. No actual server is running for this back-end, but the app works locally with this Flask back-end. Hosting the server is easy since the back-end is already made and set up for deployment. 
Docker can be used to create a container for the latest version of the Python/Flask code. Once the back-end is functional, a container can be created and then deployed to the 
cloud to get a working server running all the time to handle the image processing for the app. The great thing about this Python back-end is that better image processing 
libraries like TensorFlow, Scikit-image, etc., could be used instead of just OpenCV. Whichever back-end someone chooses to use, the app is already complete enough so they can focus their 
attention on creating cool image processing algorithms that could help farmers estimate fruit yield for orchards that have apples, peaches, etc.

## Running The App
To run the app from the command line, you can use the commands 'npx react-native run-ios' and 'npx react-native run-android'. The app uses React Native cli instead of 
React Native expo since Native modules were used. The app has a true/false value that's hardcoded, which changes the back-end you're running. Currently, the Flask back-end is 
set to off. If you want to run the Flask back-end, change this value in the BottomSheet.js component and run the Docker container manually since it's not set up to run automatically when the app starts. If you use that back-end, I  recommend getting Flask to run when the app starts.

## NPM & Yarn, Updates
During development, npm commands stopped working for this project for unknown reasons. Due to this, the Fruit Harvest Helper project only uses the yarn package manager for 
everything. This issue with npm might make things like updating the React Native version more difficult, but that's how the project works right now. There's no need to update anything, but you'll likely need to work with the project's dependencies at some point.

## Front-End
The front-end of the mobile application was created for an iOS blossom detection app and was adapted for this cross-platform app. It was created to be farmer-friendly as 
it only contains four components: an original image, a processed image, a number of detections, and a button that gives the user the option to capture or select an image for processing. 
While the front-end could be improved, it functions, which is what farmers care about. 

## OpenCV C++ Back-End
All of the different files in the project can be pretty overwhelming. However, it's better than it looks. The Android files for the C++ back-end can be found in the 
directory ReactNative/Android/App/Src/Main. Once in this directory, the files for the back-end are in two spots: the Java/Com/Blossomscam directory and the Jni directory. The actual OpenCV C++ 
algorithm is in the processAndroid.cpp file, and to get this file working, the application.mk and NativeAndroid.mk files and the Android app build settings were modified. The Java 
code for this back-end is in the file ImageProcessingModule.java, which calls the C++ file. That's about all there is to the Android OpenCV C++ back-end. As for the iOS back-end, the files 
are in the ReactNative/Src/Cpp directory. This is how the article that was followed said to set up Djinni. Here is a link to the article: https://medium.com/p/fb30b46c2468. In this directory, 
the processImage.cpp file is the file you'd want to start with as it retrieves a cached image. This file is called the C++ file, containing the OpenCV algorithm called detect.hpp. If you 
look at these two files, understand them, and read through the article, that's all you need to figure out about the iOS back end. Hopefully, this makes everything less overwhelming. 

## Python/Flask Back-End
All of the code for this back-end is located in the FlaskBackend directory. The app.py contains all the code in a single Python file to handle sending and getting data from a server. 
With the current setup, no hosted server is being paid for, but a server could be run quickly. The data being sent to the server is an image and an integer representing which algorithm you are trying to run so that you can create and run multiple algorithms with this app. You can also get data from this server, which will process the image 
with the algorithm you specified and then return a response with the JSON data containing the processed image and the number of detections. While this is the most crucial file, there 
are other essential files. The requirements.txt file has all of the app.py file dependencies and their specific versions in order to get the Python code to run. This file was used 
because it helps eliminate the issue of having the code work only on particular machines. Using the requirements.txt file, the Dockerfile creates a Docker container that runs the Python file. 
Since the app isn't set up to run the Docker container when the app builds yet, the Docker container must be manually run before trying to run the app on a physical device or simulator. 
Also, the Docker container isn't hosted on the cloud, so the app server only works locally now. However, with this setup, you can quickly deploy a Docker container 
to the cloud once you update the app.py and requirements.txt to get a functional algorithm working. If you're unfamiliar with Docker, you should get familiar with it  
to run a container and understand how Docker can be used for deployment.

## Stuck?
If you need help or I need to add any key information to help you get the app running and get you developing, feel free to reach out to me. You can contact me via my email: 
brandonduncan@my.nnu.edu.
