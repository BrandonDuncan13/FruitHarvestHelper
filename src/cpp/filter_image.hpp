#pragma once

bool all_within(double r, double g, double b, int range);

/*
    Here are the image filters
*/


// Filter image
cv::Mat filterImage(cv::Mat inputImage, int* numBlossoms)
{
    // If debug is enabled
    const bool BLOSSOM_DEBUG = true;


    cv::Mat filterImage = inputImage.clone();

    std::cout << filterImage.channels() << std::endl;

    // Applying color filter to isolate blossoms.
    for ( int i = 0; i < filterImage.rows; i++)
        for (int j = 0; j < filterImage.cols; j++)
            if (((7 * (double)filterImage.at<cv::Vec3b>(i,j)[0] - 9 * (double)filterImage.at<cv::Vec3b>(i,j)[2] + 135) && (double)filterImage.at<cv::Vec3b>(i,j)[2] < 155)
                || !all_within((double)filterImage.at<cv::Vec3b>(i,j)[2], (double)filterImage.at<cv::Vec3b>(i,j)[1], (double)filterImage.at<cv::Vec3b>(i,j)[0], 50))
            {
                filterImage.at<cv::Vec3b>(i,j)[0] = 0;
                filterImage.at<cv::Vec3b>(i,j)[1] = 0;
                filterImage.at<cv::Vec3b>(i,j)[2] = 0;
            }

    cv::Mat grayImage;

    // Converting Image to gray scale.
    cv::cvtColor(filterImage, grayImage, cv::COLOR_BGR2GRAY);

    cv:: Mat ThresholdImage;

    cv::threshold(grayImage, ThresholdImage, 0, 255, cv::THRESH_BINARY);

    cv::Mat BinaryImage;

    cv::bitwise_not(ThresholdImage, BinaryImage);

    cv::Mat UnBinary;

    cv::bitwise_not(BinaryImage, UnBinary);

    // Get rid of noise
    // cv::blur( UnBinary, UnBinary, cv::Size(2,2) );

    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(UnBinary, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);


    std::vector<std::vector<cv::Point> > contours_poly( contours.size() );
    std::vector<cv::Rect> boundRect( contours.size() );

    cv::Mat drawing;
    cv::cvtColor(UnBinary, drawing, cv::COLOR_GRAY2BGR);


    int BlossomsDetected = 0;

    // Count blossoms and but box around them
    for (int pointer = 0; pointer < contours.size(); pointer++)
    {
        if (cv::contourArea(contours[pointer]) > 200 && cv::contourArea(contours[pointer]) < 2500)
        {
            BlossomsDetected = BlossomsDetected + 1;

            // Only show boxes if debug is true
            if (BLOSSOM_DEBUG)
            {
                cv::approxPolyDP( contours[pointer], contours_poly[pointer], 3, true );
                boundRect[pointer] = boundingRect( contours_poly[pointer] );

                cv::Scalar color = cv::Scalar(50 + rand() % 206, 50 + rand() % 206, 50 + rand() % 206);
                cv::rectangle( drawing, boundRect[pointer].tl(), boundRect[pointer].br(), color, 2 );
            }
        }
    }


    // Save number of blossoms
    *numBlossoms = BlossomsDetected;

    return drawing;
}


// Filter image
int filterImagePre(std::string processedImagePath, std::string originalImagePath)
{
    // The number of blossoms
    int numBlossoms = -404;

    // Filter the image using the algorithm
    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = filterImage(originalImage, &numBlossoms);

    // Write to processed image file
    cv::imwrite(processedImagePath, copyImage);

    return numBlossoms;
}


// Check if all numbers are within range
bool all_within(double r, double g, double b, int range)
{
    int div = 3;

    if (r > g + range / div || r < g - range)
    {
        return false;
    }
    if (r > b + range / div || r < b - range)
    {
        return false;
    }
    if (g > b + range / div || g < b - range)
    {
        return false;
    }
    
    return true;
}
