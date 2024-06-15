#pragma once
// Detect

// Function Signatures
cv::Mat detectApples(cv::Mat originalImage, int &numApples);
int detectApplesPre(std::string processedImagePath, std::string originalImagePath);

int detectApplesPre(std::string processedImagePath, std::string originalImagePath) // Process image and write resulting image
{
    // How many apple clusters detected
    int numApples = 0;

    // Detect apple clusters in orignal image that gets copied
    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = detectApples(originalImage, numApples);

    // Write to processed image file
    cv::imwrite(processedImagePath, copyImage);

    return numApples;
}

cv::Mat detectApples(cv::Mat originalImage, int &numApples) // Image segmentation algorithm that uses color ratio's to detect apple clusters
{
    // Create copy of image to modify
    cv::Mat copyImage = originalImage.clone();

    // Resize the image for testing purposes
    // Changed to a square to look better on the poster
    // NOTE: algorithm has not been tested on sqaure resized images... testing was on (600, 800)
    cv::Size newSize(800, 800);
    cv::resize(copyImage, copyImage, newSize);
    cv::Mat appleObjectsMask0 = cv::Mat::zeros(copyImage.size(), CV_64F); // Change to CV_64F

    // Split the image into B, G, R color channels
    std::vector<cv::Mat> channels;
    cv::split(copyImage, channels);

    cv::Mat blueChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);
    cv::Mat greenChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);
    cv::Mat redChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);

    std::vector<cv::Mat> blueChannels = {channels[0], cv::Mat::zeros(channels[0].size(), CV_8U), cv::Mat::zeros(channels[0].size(), CV_8U)};
    std::vector<cv::Mat> greenChannels = {cv::Mat::zeros(channels[1].size(), CV_8U), channels[1], cv::Mat::zeros(channels[1].size(), CV_8U)};
    std::vector<cv::Mat> redChannels = {cv::Mat::zeros(channels[2].size(), CV_8U), cv::Mat::zeros(channels[2].size(), CV_8U), channels[2]};

    cv::merge(blueChannels, blueChannel);
    cv::merge(greenChannels, greenChannel);
    cv::merge(redChannels, redChannel);

    // Convert the image to gray scale
    cv::Mat gray;
    cv::cvtColor(copyImage, gray, cv::COLOR_BGR2GRAY);

    // Convert the red and green and blue channels to gray scale
    cv::Mat redGray, greenGray, blueGray;
    cv::cvtColor(redChannel, redGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(greenChannel, greenGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(blueChannel, blueGray, cv::COLOR_BGR2GRAY);

    // Get the ratio of red/green/blue in image to the total color intensity of the image
    cv::Mat redRatio, greenRatio, blueRatio;
    cv::divide(redGray, gray + 1e-10, redRatio, 1.0, CV_64F);
    cv::divide(greenGray, gray + 1e-10, greenRatio, 1.0, CV_64F);
    cv::divide(blueGray, gray + 1e-10, blueRatio, 1.0, CV_64F);

    // Create the pixel classifcation equations
    // Classify pixels as apple or not apple
    cv::Mat d1 = 0.4 * redRatio - 0.2 * greenRatio - 0.3 * blueRatio;
    cv::Mat d2 = 0.35 * redRatio - 0.15 * greenRatio - 0.02 - 0.3 * blueRatio;

    // Loops for debugging the equations
    //    std::cout << "Equation 1 values: " << std::endl;
    //    for (int i = 0; i < d1.rows - 100; i++)
    //    {
    //        for (int j = 0; j < d1.cols - 100; j++)
    //        {
    //            std::cout << d1.at<double>(i, j) << " ";
    //        }
    //        std::cout << std::endl;
    //    }

    //    std::cout << "Equation 2 values: " << std::endl;
    //    for (int i = 0; i < d2.rows; i++)
    //    {
    //        for (int j = 0; j < d2.cols; j++)
    //        {
    //            std::cout << d2.at<double>(i, j) << " ";
    //        }
    //        std::cout << std::endl;
    //    }

    // Iterate through each pixel and mark as white for what we think are apple pixels
    for (int i = 0; i < copyImage.rows; ++i)
    {
        for (int j = 0; j < copyImage.cols; ++j)
        {
            if (i < appleObjectsMask0.rows && j < appleObjectsMask0.cols)
            {
                double score1 = d1.at<double>(i, j);
                double score2 = d2.at<double>(i, j);

                if (score1 > 0 && score2 > 0)
                {
                    appleObjectsMask0.at<double>(i, j) = 1.0;
                }
            }
            else
            {
                std::cerr << "Error: Index out of bounds at i=" << i << ", j=" << j << std::endl;
            }
        }
    }

    // Perform morphological opening on the mask (get rid of white pixels around "apples") to remove noise, etc.
    cv::Mat structuringElement = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(3, 3));
    cv::morphologyEx(appleObjectsMask0, appleObjectsMask0, cv::MORPH_OPEN, structuringElement);

    // Convert to an 8 bit single channel matrix
    cv::Mat appleObjectsMask0_8u;
    appleObjectsMask0.convertTo(appleObjectsMask0_8u, CV_8UC1);

    // Find the contours (groups of white pixels)
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(appleObjectsMask0_8u, contours, hierarchy, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE);

    // Filter out the contours that are too small
    int minContourArea = 60; // Change this hyperparameter to finetune algorithm

    for (auto it = contours.begin(); it != contours.end();)
    {
        double area = cv::contourArea(*it);
        if (area < minContourArea) // Erase small contours so only "apples" remain
        {
            it = contours.erase(it);
        }
        else
        {
            ++it;
        }
    }

    // Draw the filtered contours onto the mask, no small apples anymore
    cv::Mat appleObjectsMask1 = cv::Mat::zeros(appleObjectsMask0.size(), CV_8UC1);
    for (const auto &contour : contours)
    {
        cv::drawContours(appleObjectsMask1, std::vector<std::vector<cv::Point>>{contour}, -1, cv::Scalar(255), cv::FILLED);
    }

    // Labeling where the apples are
    cv::Mat appleObjectsMask1_8u;
    appleObjectsMask1.convertTo(appleObjectsMask1_8u, CV_8U);

    // Assign unique integer to each connected component in the binary image
    cv::Mat labels;
    int numLabels = cv::connectedComponents(appleObjectsMask1_8u, labels);

    // Iterate over the labels and calculate properties of each component
    double count = 0;
    for (int label = 1; label <= numLabels; ++label)
    {
        cv::Mat componentMask = (labels == label);
        std::vector<std::vector<cv::Point>> contour;
        cv::findContours(componentMask, contour, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE);

        if (!contour.empty())
        {
            count++;
            cv::Point2f centroid;
            float radius;
            cv::minEnclosingCircle(contour[0], centroid, radius);

            cv::Rect boundingBox = cv::boundingRect(contour[0]);

            // Finally, draw the centroids and bounding boxes on the original image
            // cv::circle(copyImage, centroid, radius, cv::Scalar(0, 255, 0), 2);
            cv::rectangle(copyImage, boundingBox, cv::Scalar(0, 255, 0), 2);
        }
    }
    // Set the number of apples detected
    numApples = count;

    // Return processed copied image
    return copyImage;
}

// Old blossom detection algorithm
// cv::Mat copyImage(cv::Mat originalImage) // Filter image
// {
//     cv::Mat copyImage = originalImage.clone();

//     std::cout << copyImage.channels() << std::endl;

//     // Applying color filter to isolate blossoms
//     for (int i = 0; i < copyImage.rows; i++)
//         for (int j = 0; j < copyImage.cols; j++)
//             if ((7 * (double)copyImage.at<cv::Vec3b>(i, j)[0] - 9 * (double)copyImage.at<cv::Vec3b>(i, j)[2] + 135) && (double)copyImage.at<cv::Vec3b>(i, j)[2] < 155)
//             {
//                 copyImage.at<cv::Vec3b>(i, j)[0] = 0;
//                 copyImage.at<cv::Vec3b>(i, j)[1] = 0;
//                 copyImage.at<cv::Vec3b>(i, j)[2] = 0;
//             }

//     cv::Mat grayImage;

//     // Converting Image to gray scale.
//     cv::cvtColor(copyImage, grayImage, cv::COLOR_BGR2GRAY);

//     cv::Mat ThresholdImage;

//     cv::threshold(grayImage, ThresholdImage, 0, 255, cv::THRESH_BINARY);

//     cv::Mat BinaryImage;

//     cv::bitwise_not(ThresholdImage, BinaryImage);

//     cv::Mat UnBinary;

//     cv::bitwise_not(BinaryImage, UnBinary);

//     std::vector<std::vector<cv::Point>> contours;
//     std::vector<cv::Vec4i> hierarchy;
//     cv::findContours(UnBinary, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

//     int BlossomsDetected = 0;

//     for (int pointer = 0; pointer < contours.size(); pointer++)
//     {
//         if (cv::contourArea(contours[pointer]) > 50 && cv::contourArea(contours[pointer]) < 60)
//         {
//             BlossomsDetected = BlossomsDetected + 1;
//         }
//     }

//     // Added
//     // numBlossoms = BlossomsDetected;// Will add back later

//     return UnBinary;
// }
