# Blossom Cam Application

This application was created for a research project run by Dr.Bulanon at Northwest Nazarene University with the goal in mind to further the development of an application that was previously created. The application that we were asked to improve on was an IOS app with a working camera, access to the photo library, etc., and an algorithm to recognize the number of blossoms on a peach or apple tree. In order to recognize the number of blossoms on fruit trees, former students used Image Processing within the OpenCV library which detected each individual blossom by a process called blob analysis and they then had code that simply counted up all of the blobs. Here are the improvements we were asked to make to the application:

1. Create an Android version of the application so it's available on both platforms. This involves converting the blossom recognition algorithm to make it compatible.
2. Add a bounding box to provide bounds to perform the algorithm within.
3. Further the application by allowing the user to take multiple photos, run the algorithm on these photos to count the blossom, and then providing them with a fruit yield estimate based on the blossom count.
4. Make the application "Farmer Friendly".

## Languages Used

Initially, the IOS application that we started out with was created using Swift for the base of it as well as C++ to add the OpenCV library used within the blossom counter algorithm. This was created with the idea in mind that an IOS application might be able to successfully count fruit tree blossoms to estimate the number of apples on a tree.

Continuing this project, we decided to use React Native in order to meet the requests of having a cross-platform application meaning an application that's available on both IOS and Android. We thought React Native would serve as a great base for this project since this would allow us to have code that was shared on both platforms. In doing this, we didn't have to write nearly as much code natively in Java and Swift.

This is a good start, we can update this as we continue research.
