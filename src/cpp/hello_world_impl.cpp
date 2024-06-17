#include "hello_world_impl.hpp"
#include "processImage.hpp"
#include <string>

namespace helloworld
{
    // Constructor
    HelloWorldImpl::HelloWorldImpl()
    {
    }

    std::shared_ptr<HelloWorld> HelloWorld::create()
    {
        return std::make_shared<HelloWorldImpl>();
    }

    std::string HelloWorldImpl::get_hello_world()
    {
        // Process an image and get data to return
        ProcessImage processedImage;
        std::string myString = processedImage.handleImageProcessing();

        return myString;
    }
}
