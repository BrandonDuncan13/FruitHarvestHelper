#include "hello_world_impl.hpp"
#include "processImage.hpp"
#include <string>

namespace helloworld
{

    std::shared_ptr<HelloWorld> HelloWorld::create()
    {
        return std::make_shared<HelloWorldImpl>();
    }

    HelloWorldImpl::HelloWorldImpl()
    {
    }

    std::string HelloWorldImpl::get_hello_world()
    {
        // Here is the where the image processing takes place
        // src/cpp/process_image.cpp
        ProcessImage processedImage;
        std::string myString = processedImage.handleImageProcessing();
        return myString;
    }
}
