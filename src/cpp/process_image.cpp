#include "process_image.hpp"
// #ifdef __cplusplus
// #import <opencv2/opencv.hpp>
// #endif

// #include <opencv2/highgui/highgui.hpp>
// #include <opencv2/core/core.hpp>


// Constructor
// int ProcessImage::ProcessImageImpl()
// {
//     numBlossoms = 404;
//     return 0;
// }

// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    cv::Mat inputMat = cv::Mat::zeros(2, 2, CV_32F);
    inputMat.at<unsigned char>(1,1) = 3;
    cv::Mat greyMat;
    // cv::cvtColor(inputMat, greyMat, cv::COLOR_BGR2GRAY);
    numBlossoms = 404;
    std::string myString = std::to_string(numBlossoms) + "$$image_path";
    return myString;
}
