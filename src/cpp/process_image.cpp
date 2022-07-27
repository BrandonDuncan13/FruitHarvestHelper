// Process blossom image

#include <filesystem>
#include <string>

#include "process_image.hpp"

// Defines
#define IMAGEPATH "images/image"
#define EXTENSION ".jpg"


// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    // Counter to remember which photo it is using
    static int count = 0;
    count++;

    // Paths
    std::string originalImagePath = IMAGEPATH + std::to_string(count) + EXTENSION;
    std::string processedImagePath = "images/processed_image" + std::to_string(count) + EXTENSION;
    std::string cachePath = std::filesystem::temp_directory_path().string();

    // Finding cache path for different devices
    if (getOsName() == "Apple")
    {
        // Make sure there is no '/' at the end of the path
        if (cachePath.at(cachePath.length() - 1) == '/')
        {
            cachePath = cachePath.substr(0, cachePath.find_last_of("/"));
        }
    
        // Edit path to be cache directory
        cachePath = cachePath.substr(0, cachePath.find_last_of("/"));
        cachePath += "/Library/Caches/";
    }
    else
    {
        // This will be where the cache path is fixed for Android
        return "error: Android not yet supported";
    }

    // Finishing path variables
    originalImagePath = cachePath + originalImagePath;
    processedImagePath = cachePath + processedImagePath;

    // This just shows that openCV does something
    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = grayImage(originalImage);
    // int rows = copyImage.rows;
    // int cols = copyImage.cols;
    // for (int i = 50; i < rows - 50; i++)
    // {
    //     for (int j = 50 * 3; j < (cols * 3) - 50 * 3; j += 2)
    //     {
    //         copyImage.at<unsigned char>(i,j) = rand() % 256;
    //     }
    // }

    // Write to processed image file
    cv::imwrite(processedImagePath, copyImage);

    // Generating the return string
    std::string myString = std::to_string(404/*numBlossoms*/) + "$$" + processedImagePath;
    return myString;
}


// Find OS name
std::string ProcessImage::getOsName()
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


// Convert image to grayscale
cv::Mat ProcessImage::grayImage(cv::Mat inputImage)
{
    // cv::Mat originalImage = [inputImage CVMat3];
    
    cv::Mat grayscaleImage;
    
    cv::cvtColor(inputImage/*originalImage*/, grayscaleImage, cv::COLOR_BGR2GRAY);
    
    // UIImage* ResultingImage =[UIImage imageWithCVMat:grayscaleImage];
    
    return grayscaleImage;
}
