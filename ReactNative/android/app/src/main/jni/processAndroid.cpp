#include <jni.h>
#include <stdio.h>
#include <iostream>
#include <vector>
#include <cstdlib>

#include <opencv2/opencv.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/core.hpp>

// JNI wrapper for the (Java -> C++ -> Java) function
extern "C" JNIEXPORT jobjectArray JNICALL Java_com_blossomscam_ImageProcessingModule_detect(
    JNIEnv *env, jclass ImageProcessingModule, jbyteArray orgImage)
{
    // Convert byte array to Mat to get the image to be processed
    jbyte *buffer = env->GetByteArrayElements(orgImage, NULL);
    jsize length = env->GetArrayLength(orgImage);
    cv::Mat inputImage = cv::imdecode(cv::Mat(1, length, CV_8UC1, (unsigned char *)buffer), cv::IMREAD_COLOR);
    env->ReleaseByteArrayElements(orgImage, buffer, 0);

    // Copy the original image to process copied image
    cv::Mat copyImage = inputImage.clone();

    // Resize the image for testing purposes (tested at 600, 800)
    // In retrospect this was stupid... Dale said shrinking image loses data... duhh...
    // Look up largest square image size that would work across various Android & iOS devices
    // NOTE: algorithm has not been tested on sqaure resized images
    cv::Size newSize(800, 800);
    cv::resize(copyImage, copyImage, newSize);
    cv::Mat appleObjectsMask0 = cv::Mat::zeros(copyImage.size(), CV_64F);

    // Split the image into B, G, R color channels
    std::vector<cv::Mat> channels;
    cv::split(copyImage, channels);

    // One matrix for each channel
    cv::Mat blueChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);
    cv::Mat greenChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);
    cv::Mat redChannel = cv::Mat::zeros(copyImage.size(), CV_8UC3);

    // One vector of matricies for each channel
    std::vector<cv::Mat> blueChannels = {channels[0], cv::Mat::zeros(channels[0].size(), CV_8U), cv::Mat::zeros(channels[0].size(), CV_8U)};
    std::vector<cv::Mat> greenChannels = {cv::Mat::zeros(channels[1].size(), CV_8U), channels[1], cv::Mat::zeros(channels[1].size(), CV_8U)};
    std::vector<cv::Mat> redChannels = {cv::Mat::zeros(channels[2].size(), CV_8U), cv::Mat::zeros(channels[2].size(), CV_8U), channels[2]};

    // Merge the matricies and vectors to get channel with correct values
    cv::merge(blueChannels, blueChannel);
    cv::merge(greenChannels, greenChannel);
    cv::merge(redChannels, redChannel);

    // Convert the image to gray scale
    cv::Mat gray;
    cv::cvtColor(copyImage, gray, cv::COLOR_BGR2GRAY);

    // Convert the B,G,R channels to gray scale
    cv::Mat redGray, greenGray, blueGray;
    cv::cvtColor(blueChannel, blueGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(greenChannel, greenGray, cv::COLOR_BGR2GRAY);
    cv::cvtColor(redChannel, redGray, cv::COLOR_BGR2GRAY);

    // Get the ratio of red/green/blue in image to the total color intensity of the image
    cv::Mat redRatio, greenRatio, blueRatio;
    cv::divide(redGray, gray + 1e-10, redRatio, 1.0, CV_64F);
    cv::divide(greenGray, gray + 1e-10, greenRatio, 1.0, CV_64F);
    cv::divide(blueGray, gray + 1e-10, blueRatio, 1.0, CV_64F);

    // Create the pixel classifcation equations that classify pixels as apple (white) or not apple (black)
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
    jint numApples = 0;
    for (int label = 1; label <= numLabels; ++label)
    {
        cv::Mat componentMask = (labels == label);
        std::vector<std::vector<cv::Point>> contour;
        cv::findContours(componentMask, contour, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE);

        if (!contour.empty())
        {
            numApples++;
            cv::Point2f centroid;
            float radius;
            cv::minEnclosingCircle(contour[0], centroid, radius);

            cv::Rect boundingBox = cv::boundingRect(contour[0]);

            // Finally, draw the centroids and bounding boxes on the original image
            // cv::circle(copyImage, centroid, radius, cv::Scalar(0, 255, 0), 2);
            cv::rectangle(copyImage, boundingBox, cv::Scalar(0, 255, 0), 2);
        }
    }

    // Convert the processed image (copyImage) to a byte array
    std::vector<uint8_t> processedImage;
    cv::imencode(".jpeg", copyImage, processedImage);

    // Prepare the processed image
    jbyteArray imageBytes = env->NewByteArray(processedImage.size());
    env->SetByteArrayRegion(imageBytes, 0, processedImage.size(), reinterpret_cast<jbyte *>(processedImage.data()));

    // Return both the image and detected apples
    // Create a new Object array with 2 elements
    jobjectArray result = env->NewObjectArray(2, env->FindClass("java/lang/Object"), NULL);
    if (result == NULL)
        return NULL;

    // Set the elements in the Object array
    env->SetObjectArrayElement(result, 0, imageBytes);
    env->SetObjectArrayElement(result, 1, env->NewObject(env->FindClass("java/lang/Integer"), env->GetMethodID(env->FindClass("java/lang/Integer"), "<init>", "(I)V"), numApples));

    return result;
}
