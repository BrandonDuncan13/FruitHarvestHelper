#include "process_image.hpp"


// Constructor
int ProcessImage::ProcessImageImpl()
{
    return 0;
}

// Here is where the image gets processed
std::string ProcessImage::get_processed_image()
{
    int numBlossoms = 404;
    std::string myString = std::to_string(numBlossoms) + "$$image_path";
    return myString;
}
