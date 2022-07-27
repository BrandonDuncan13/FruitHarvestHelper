// Process blossom image

#include <filesystem>
#include <string>

#ifndef cv
#include <opencv2/opencv.hpp>
#endif

#include "process_image.hpp"


// Defines
#define IMAGEPATH "images/image"
#define EXTENSION ".jpg"


// Function prototypes
std::string getOsName();


// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    // Variables
    static int count = 0;
    count++;
    std::string originalImagePath = IMAGEPATH + std::to_string(count) + EXTENSION;
    std::string processedImagePath = "images/processed_image" + std::to_string(count) + EXTENSION;
    std::string cachePath = std::filesystem::temp_directory_path().string();

    if (getOsName() == "Apple")
    {
        if (cachePath.at(cachePath.length() - 1) == '/')
        {
            // cachePath += '/';// !=
            cachePath = cachePath.substr(0, cachePath.find_last_of("/"));// ==
        }
    
        // Edit path to be cache directory
        cachePath = cachePath.substr(0, cachePath.find_last_of("/"));
        cachePath += "/Library/Caches/";
        // return "error: Good";
    }
    else
    {
        return "error: Android not yet supported";
    }

    originalImagePath = cachePath + originalImagePath;
    processedImagePath = cachePath + processedImagePath;

    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = originalImage;
    int rows = copyImage.rows;
    int cols = copyImage.cols;
    // // // cv::Mat inputMat = cv::Mat::zeros(2, 2, CV_64F);
    // // // inputMat.at<unsigned char>(1,1) = 144;
    // // // cv::Mat greyMat;
    // // // cv::cvtColor(inputMat, greyMat, cv::COLOR_BGR2GRAY);
    // // // numBlossoms = originalImage.at<unsigned char>(1,1);

    for (int i = 50; i < rows - 50; i++)
    {
        for (int j = 50 * 3; j < (cols * 3) - 50 * 3; j += 2)
        {
            copyImage.at<unsigned char>(i,j) = rand() % 256;
        }
    }

    cv::imwrite(processedImagePath, copyImage);

    // Generating the return string
    std::string myString = std::to_string(404/*numBlossoms*/) + "$$" + processedImagePath;
    return myString;
}


// Find OS name
std::string getOsName()
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
