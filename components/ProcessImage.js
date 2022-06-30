// Here is where I will add the image processing to find blossoms

// import int_sqrt from '../cCode/hello.cpp';


export default function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
    // int_sqrt = Module.cwrap('int_sqrt', 'number', ['number']);
    // int_sqrt(12);
    // int_sqrt(28);


    // This sets the processed image
    setProcessedImage({ opacity: 0, path: originalImage.path });

    // This sets the number of blossoms
    setNumBlossoms(Math.ceil(Math.random() * 99));

    // setNumBlossoms(int_sqrt(28));
}
