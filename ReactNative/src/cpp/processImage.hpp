#pragma once

#ifndef cv
// #include <opencv2/opencv.hpp>
#endif

class ProcessImage
{
public:
    // Gets image, processes image, and returns data to JavaScript (UI)
    std::string handleImageProcessing();

private:
    int numApples;

    std::string getOsName();
};
