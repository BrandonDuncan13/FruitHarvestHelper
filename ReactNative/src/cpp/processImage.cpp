// Process apple tree image to detect apple clusters
#define IMAGEPATH "images/image"
#define EXTENSION ".jpg"

#include "filesystem.hpp"
#include "processImage.hpp"

#include <filesystem>
#include <string>

// Only process iOS images
// Still contains Android code in case someone wants to try to get it working here but Python is a better language for the task
#ifdef __APPLE__
#include "detect.hpp"
#else
int detectApplesPre(std::string processedImagePath, std::string originalImagePath, std::string &processingError) // Dummy implementation for Android
{
    return 0;
}
#endif

/*
    If there is an error, do not use throw(), have
    handleImageProcessing() return a string that starts
    with "error:" that way the error will be handled
    correctly.
*/
std::string ProcessImage::handleImageProcessing() // Gets processed image from cache, processes it, and sends data to JavaScript
{
    // Counter to keep create new photo for every image sent to be processed
    static int count = -1;
    // Reset the number of apples detected from image processed
    numApples = 0;

    count++;

    // Image paths
    std::string originalImagePath = IMAGEPATH + std::to_string(count) + EXTENSION;
    std::string processedImagePath = "images/processed_image" + std::to_string(count) + EXTENSION;
    std::string cachePath;
    // Error tracking var
    std::string processingError = "";

    // Finding the cache path
    if (getOsName() == "Apple")
    {
        cachePath = std::filesystem::temp_directory_path().string();

        // Make sure there is no '/' at the end of the new path
        if (cachePath.at(cachePath.length() - 1) == '/')
        {
            cachePath = cachePath.substr(0, cachePath.find_last_of("/"));
        }

        // Edit assisted path to be actual cache directory
        cachePath = cachePath.substr(0, cachePath.find_last_of("/"));
        cachePath += "/Library/Caches/";
    }
    else if (getOsName() == "Linux")
    {
        // Temporary cache path not real Android cache
        // If trying to get Android and iOS C++ processing all done by Djinni note it's hard to access Android cache in C++
        cachePath = "/data/user/0/com.blossomscam/cache/";
    }
    else
    {
        return "error: Unknown OS. Cannot process image...";
    }

    // Finishing path variables
    originalImagePath = cachePath + originalImagePath;
    processedImagePath = cachePath + processedImagePath;

    // Process for iOS devices and use macro to skip on Android
    if (getOsName() == "Apple" || getOsName() == "Linux")
    {
        numApples = detectApplesPre(processedImagePath, originalImagePath, processingError);

        // Image may have been processed unsuccessfully
        if (processingError != "")
        {
            // Contains "error: "
            return processingError;
        }
    }

    // Generate return string to send data back
    std::string processingData = std::to_string(numApples) + "$$" + processedImagePath;

    return processingData;
}

std::string ProcessImage::getOsName() // Find OS name
{
#ifdef _WIN32
    return "Windows 32-bit";
#elif _WIN64
    return "Windows 64-bit";
#elif __APPLE__
    return "Apple";
#elif __MACH__
    return "Mac OS";
#elif __linux__
    return "Linux";
#elif __FreeBSD__
    return "FreeBSD";
#elif __unix || __unix__
    return "Unix";
#else
    return "Other";
#endif
}
