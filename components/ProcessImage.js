// Here is where I will add the image processing to find blossoms

import React from 'react';


export default function ProcessImage( originalImage, setProcessedImage, setNumBlossoms )
{
    setProcessedImage({ opacity: 1, path: originalImage.path });
    setNumBlossoms(Math.ceil(Math.random() * 99));
}
