#pragma once

/*
    Here are the image filters

    Possibly remove some or all of the 
    debug options in final app version
*/

// Debug variables
//											// Default Values:
/*
    If the returned image 
    should be color (true) or 
    black and white (false)
*/
#define BLOSSOM_DEBUG_IMAGE_COLOR false		// false


/*
    The number of times the 
    filter should be run, I 
    found the best success 
    with 2
*/
#define BLOSSOM_DEBUG_RECURSION_NUM 1		// 2 (must be > 0)


/*
    If the colored boxes 
    should be shown on the 
    returned image
*/
#define BLOSSOM_DEBUG_SHOW_BOXES true		// false


/*
    If the intermediate 
    images should be shown, 
    must be false if run in 
    app
*/
#define BLOSSOM_DEBUG_SHOW_IMAGES false		// false (keep false if rec num is large)


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::                Function to convert a bgr image to binary               ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
cv::Mat bgr_to_bin(cv::Mat bgrImage)
{
    // Converting image to gray scale.
    cv::Mat grayImage;
    cv::cvtColor(bgrImage, grayImage, cv::COLOR_BGR2GRAY);

    // Converting image to binary
    cv::Mat ThresholdImage;
    cv::threshold(grayImage, ThresholdImage, 0, 255, cv::THRESH_BINARY);

    // Invert image
    cv::Mat BinaryImage;
    cv::bitwise_not(ThresholdImage, BinaryImage);

    // Invert image again (back to original b/w)
    cv::Mat UnBinary;
    cv::bitwise_not(BinaryImage, UnBinary);

    return UnBinary;
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::          Filter the image based on saturation to get b/w image         ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
cv::Mat binary_filter(cv::Mat inputImage, std::string blobImagePath)
{
    // Convert the original image from bgr to hsv
    cv::Mat filterImage = inputImage.clone();
    cv::Mat hsvImage;
    cv::cvtColor(filterImage, hsvImage, cv::COLOR_BGR2HSV);

    // Applying color filter to isolate blossoms
    for ( int i = 0; i < hsvImage.rows; i++)
    {
        for (int j = 0; j < hsvImage.cols; j++)
        {
            // Filter based on saturation, stored as [hue, saturation, value]
            if (hsvImage.at<cv::Vec3b>(i,j)[1] > 30)
            {
                // If not blossom, set value to 0 (black)
                hsvImage.at<cv::Vec3b>(i,j)[2] = 0;
            }
        }
    }

    // Convert back to bgr
    cv::Mat bgrImage;
    cv::cvtColor(hsvImage, bgrImage, cv::COLOR_HSV2BGR);

    // Convert image to binary
    cv::Mat BinaryImage = bgr_to_bin(bgrImage);

    // Write image to file for blob analysis
    cv::imwrite(blobImagePath, BinaryImage);

    return BinaryImage;
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::                        Function to fill in blobs                       ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Modified from:
// https://docs.opencv.org/4.7.0/d6/d6e/group__imgproc__draw.html#ga746c0625f1781f1ffc9056259103edbc
cv::Mat blob_fill(std::string path)
{
    // Read image at path
    cv::Mat src = cv::imread( path, 0 );

    // Fill destination image with zeros
    cv::Mat dst = cv::Mat::zeros( src.rows, src.cols, CV_8UC3 );

    // Not sure what this line does, but doesn't work without it
    src = src > 1;

    // Find the contours
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours( src, contours, hierarchy,
        cv::RETR_CCOMP, cv::CHAIN_APPROX_SIMPLE );

    // Iterate through all the top-level contours,
    // draw each connected component in white
    for( int idx = 0; idx >= 0; idx = hierarchy[idx][0] )
    {
        cv::Scalar color( 255, 255, 255 );
        cv::drawContours( dst, contours, idx, color, cv::FILLED );
    }

    return dst;
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::                         Remove noise from image                        ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
cv::Mat remove_noise(cv::Mat src)
{
    // Probably doesn't need to be own function, 
    // but it makes it easier to modify in the future
    cv::Mat dst;
    cv::medianBlur(src, dst, 5);

    return dst;
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::        Count blobs of a particular size and make the rest black        ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
cv::Mat count_blobs(cv::Mat inputImage, int* numBlossoms, cv::Mat copyImage, int itrNum)
{
    int BlossomsDetected = 0;

    // Convert image to binary
    cv::Mat binaryImage = bgr_to_bin(inputImage);

    // Find the image contours
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(binaryImage, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

    // Find the contour boundaries
    std::vector<std::vector<cv::Point>> contours_poly( contours.size() );
    std::vector<cv::Rect> boundRect( contours.size() );

    // Convert image to bgr
    cv::Mat drawing;
    cv::cvtColor(binaryImage, drawing, cv::COLOR_GRAY2BGR);

    // Count blossoms and but box around them
    for (int pointer = 0; pointer < contours.size(); pointer++)
    {
        // If the contour is the correct size to be a blossom
        if (cv::contourArea(contours[pointer]) > 0)
        {
            // Add one to number of counted blossoms
            BlossomsDetected = BlossomsDetected + 1;

            // Only show boxes if debug is true and it's the last iteration
            if (BLOSSOM_DEBUG_SHOW_BOXES && (itrNum >= BLOSSOM_DEBUG_RECURSION_NUM - 1))
            {
                // Find the bounding rectangle of the contours
                cv::approxPolyDP( contours[pointer], contours_poly[pointer], 3, true );
                boundRect[pointer] = boundingRect( contours_poly[pointer] );

                // Draw the bounding rectangle on the binary image
                cv::Scalar color = cv::Scalar(50 + rand() % 206, 50 + rand() % 206, 50 + rand() % 206);
                cv::rectangle( drawing, boundRect[pointer].tl(), boundRect[pointer].br(), color, 2 );

                // Draw the bounding rectangle on the color image
                cv::rectangle( copyImage, boundRect[pointer].tl(), boundRect[pointer].br(), color, 2 );
            }
        }
        // If wrong size, make the contour black
        else
        {
            cv::drawContours(drawing, contours, pointer, cv::Scalar(0, 0, 0), cv::FILLED);
        }
    }

    // Save number of blossoms
    *numBlossoms = BlossomsDetected;

    return drawing;
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::                                                                        ::
// ::                 Filter the image using multiple filters                ::
// ::                                                                        ::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
int filter_image_pre(std::string processedImagePath, std::string originalImagePath)
{
    // The number of blossoms
    int numBlossoms = -404;

    // Read in the original image
    cv::Mat originalImage = cv::imread(originalImagePath);
    cv::Mat copyImage = cv::imread(originalImagePath);

    // Create arrays the size of the number of recursions
    cv::Mat binaryImage[BLOSSOM_DEBUG_RECURSION_NUM];
    cv::Mat blobImage[BLOSSOM_DEBUG_RECURSION_NUM];
    cv::Mat filterImage[BLOSSOM_DEBUG_RECURSION_NUM];
    cv::Mat finalImage[BLOSSOM_DEBUG_RECURSION_NUM + 1];

    // Final is one larger because it starts with the original
    finalImage[0] = originalImage;

    // Filter the image using the algorithms the 
    // number of times specified by recursion num
    for (int i = 0; i < BLOSSOM_DEBUG_RECURSION_NUM; i++)
    {
        binaryImage[i] = binary_filter(finalImage[i], processedImagePath);
        blobImage[i]   = blob_fill(processedImagePath);
        // filterImage[i] = remove_noise(blobImage[i]);
        finalImage[i + 1]  = count_blobs(blobImage[i], &numBlossoms, copyImage, i);
    }
    

    // Show intermediate images, this could be removed for app
    if (BLOSSOM_DEBUG_SHOW_IMAGES)
    {
        cv::imshow("copyImage", copyImage);

        for (int i = BLOSSOM_DEBUG_RECURSION_NUM - 1; i >= 0; i--)
        {
            cv::imshow("finalImage "  + std::to_string(i), finalImage[i + 1]);
            cv::imshow("filterImage " + std::to_string(i), filterImage[i]);
            cv::imshow("blobImage "   + std::to_string(i), blobImage[i]);
            cv::imshow("binaryImage " + std::to_string(i), binaryImage[i]);
        }

        cv::imshow("originalImage", originalImage);
    }

    // Write to processed image file
    if (BLOSSOM_DEBUG_IMAGE_COLOR)
    {
        // Color bgr image
        cv::imwrite(processedImagePath, copyImage);
    }
    else
    {
        // Black and white binary image
        cv::imwrite(processedImagePath, finalImage[BLOSSOM_DEBUG_RECURSION_NUM]);
    }

    return numBlossoms;
}
