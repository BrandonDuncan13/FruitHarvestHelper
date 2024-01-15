#pragma once

/*
    Here are the image filters
*/

// Filter image
cv::Mat filterImage(cv::Mat inputImage)
{
    cv::Mat filterImage = inputImage.clone();

    std::cout << filterImage.channels() << std::endl;

    // Applying color filter to isolate blossoms.
    for (int i = 0; i < filterImage.rows; i++)
        for (int j = 0; j < filterImage.cols; j++)
            if ((7 * (double)filterImage.at<cv::Vec3b>(i, j)[0] - 9 * (double)filterImage.at<cv::Vec3b>(i, j)[2] + 135) && (double)filterImage.at<cv::Vec3b>(i, j)[2] < 155)
            {
                filterImage.at<cv::Vec3b>(i, j)[0] = 0;
                filterImage.at<cv::Vec3b>(i, j)[1] = 0;
                filterImage.at<cv::Vec3b>(i, j)[2] = 0;
            }

    cv::Mat grayImage;

    // Converting Image to gray scale.
    cv::cvtColor(filterImage, grayImage, cv::COLOR_BGR2GRAY);

    cv::Mat ThresholdImage;

    cv::threshold(grayImage, ThresholdImage, 0, 255, cv::THRESH_BINARY);

    cv::Mat BinaryImage;

    cv::bitwise_not(ThresholdImage, BinaryImage);

    cv::Mat UnBinary;

    cv::bitwise_not(BinaryImage, UnBinary);

    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(UnBinary, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

    int BlossomsDetected = 0;

    for (int pointer = 0; pointer < contours.size(); pointer++)
    {
        if (cv::contourArea(contours[pointer]) > 50 && cv::contourArea(contours[pointer]) < 60)
        {
            BlossomsDetected = BlossomsDetected + 1;
        }
    }

    // Added
    // numBlossoms = BlossomsDetected;// Will add back later

    return UnBinary;
}

// Filter image
void filterImagePre(std::string processedImagePath, std::string originalImagePath)
{
    // Filter the image using the algorithm
    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = filterImage(originalImage);

    // Write to processed image file
    cv::imwrite(processedImagePath, copyImage);
}
