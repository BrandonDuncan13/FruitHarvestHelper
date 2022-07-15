#include "process_image.hpp"


// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    cv::Mat inputMat = cv::Mat::zeros(2, 2, CV_64F);
    inputMat.at<unsigned char>(1,1) = 144;
    cv::Mat greyMat;
    // cv::cvtColor(inputMat, greyMat, cv::COLOR_BGR2GRAY);
    numBlossoms = inputMat.at<unsigned char>(1,1);

    // Generating the return string
    std::string myString = std::to_string(numBlossoms) + "$$image_path";
    return myString;
}
