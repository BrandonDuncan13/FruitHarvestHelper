#pragma once

#ifndef cv
// #include <opencv2/opencv.hpp>
#endif

class ProcessImage
{
public:
    // Our method that returns a string
    std::string get_processed_image();

private:
    std::string getOsName();

    // // Filter
    // cv::Mat filterImage(cv::Mat inputImage);

    // Variables
    int numApples;
};
