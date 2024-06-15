#pragma once

#ifndef cv
// #include <opencv2/opencv.hpp>
#endif

class ProcessImage
{
public:
    // Method that gets image, processes image, and returns data to JavaScript (UI)
    std::string handleImageProcessing();

private:
    // Variables
    int numApples;

    // Methods
    std::string getOsName();
};
