#include <jni.h>
#include <stdio.h>
#include <iostream>

#include <opencv2/opencv.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/core.hpp>

// JNI wrapper for the (Java -> C++ -> Java) function
extern "C" JNIEXPORT jint JNICALL Java_com_blossomscam_ImageProcessingModule_detectBlossoms(
    JNIEnv *env, jobject obj, jbyteArray imageBytes)
{
    // Convert byte array to Mat to get the user selected image
    jbyte *buffer = env->GetByteArrayElements(imageBytes, NULL);
    jsize length = env->GetArrayLength(imageBytes);
    cv::Mat orgImage = cv::imdecode(cv::Mat(1, length, CV_8UC1, (unsigned char *)buffer), cv::IMREAD_COLOR);
    env->ReleaseByteArrayElements(imageBytes, buffer, 0);
    // cv::Mat *orgImage = (cv::Mat *)orgImageAddr;

    // cv::Mat copy = orgImage->clone();
    cv::Mat copy = orgImage.clone();

    // resize the image for testing purposes
    cv::Size newSize(600, 800);
    cv::resize(copy, copy, newSize);
    cv::Mat appleObjectsMask0 = cv::Mat::zeros(copy.size(), CV_64F); // Change to CV_64F

    // split the image into B, G, R color channels
    std::vector<cv::Mat> channels;
    cv::split(copy, channels);

    cv::Mat blueChannel = cv::Mat::zeros(copy.size(), CV_8UC3);
    cv::Mat greenChannel = cv::Mat::zeros(copy.size(), CV_8UC3);
    cv::Mat redChannel = cv::Mat::zeros(copy.size(), CV_8UC3);

    std::vector<cv::Mat> blueChannels = {channels[0], cv::Mat::zeros(channels[0].size(), CV_8U), cv::Mat::zeros(channels[0].size(), CV_8U)};
    std::vector<cv::Mat> greenChannels = {cv::Mat::zeros(channels[1].size(), CV_8U), channels[1], cv::Mat::zeros(channels[1].size(), CV_8U)};
    std::vector<cv::Mat> redChannels = {cv::Mat::zeros(channels[2].size(), CV_8U), cv::Mat::zeros(channels[2].size(), CV_8U), channels[2]};

    cv::merge(blueChannels, blueChannel);
    cv::merge(greenChannels, greenChannel);
    cv::merge(redChannels, redChannel);

    // convert the image to gray scale
    cv::Mat gray;
    cv::cvtColor(copy, gray, cv::COLOR_BGR2GRAY); // Convert to grayscale
    // convert the red and green and blue channels to gray scale
    cv::Mat redGray, greenGray, blueGray;
    cv::cvtColor(redChannel, redGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(greenChannel, greenGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(blueChannel, blueGray, cv::COLOR_BGR2GRAY);
    // get the ratio of red/green/blue in image to the total color intensity of the image
    cv::Mat redRatio, greenRatio, blueRatio;
    cv::divide(redGray, gray + 1e-10, redRatio, 1.0, CV_64F);
    cv::divide(greenGray, gray + 1e-10, greenRatio, 1.0, CV_64F);
    cv::divide(blueGray, gray + 1e-10, blueRatio, 1.0, CV_64F);
    // create the apple evaluation equations
    cv::Mat d1 = 0.3 * redRatio - 0.13 * greenRatio - 0.3 * blueRatio;
    cv::Mat d2 = 0.19 * redRatio - 0.08 * greenRatio - 0.02 - 0.3 * blueRatio;

    // loops for debugging the equations
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

    // iterate through each pixel and mark as white for what we think are apple pixels
    for (int i = 0; i < copy.rows; ++i)
    {
        for (int j = 0; j < copy.cols; ++j)
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
            // else
            // {
            //     std::cerr << "Error: Index out of bounds at i=" << i << ", j=" << j << std::endl;
            // }
        }
    }

    // Perform morphological opening on the mask (get rid of white pixels around "apples")
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
    int minContourArea = 10; // Change this value to finetune algorithm
    for (auto it = contours.begin(); it != contours.end();)
    {
        double area = cv::contourArea(*it);
        if (area < minContourArea) // erase small contours so only "apples" remain
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
    jint count = 0;
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
            // cv::circle(copy, centroid, radius, cv::Scalar(0, 255, 0), 2);
            cv::rectangle(copy, boundingBox, cv::Scalar(0, 255, 0), 2);
        }
    }

    // return both the image and detected apple count

    return count;

    // return 69;
}
