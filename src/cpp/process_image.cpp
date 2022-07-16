#include "process_image.hpp"


// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    std::string imagePath = "images/image.jpg";

    // cv::Mat originalImage = cv::imread(imagePath);
    // cv::Mat inputMat = cv::Mat::zeros(2, 2, CV_64F);
    // inputMat.at<unsigned char>(1,1) = 144;
    // cv::Mat greyMat;
    // cv::cvtColor(inputMat, greyMat, cv::COLOR_BGR2GRAY);
    // numBlossoms = originalImage.at<unsigned char>(1,1);

    // Generating the return string
    std::string myString = std::to_string(numBlossoms) + "$$" + imagePath;
    return myString;
}
