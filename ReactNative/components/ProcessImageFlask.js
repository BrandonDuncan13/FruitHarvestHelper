import React, { useEffect } from 'react';


export default function ProcessImageFlask( originalImage, setProcessedImage, setNumApples )
{
    console.log(`Inside the Image processing component`);
    // Start processing timer for testing purposes
    const start = performance.now();

    numProcessedImages();

    // Send the original image to the server for processing


    // Fetch JSON data from Flask web server
    useEffect(() => {
        fetch('http://192.168.1.224:5000/getData', {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(jsonData => {
            console.log(`Received Promise from flask:`, jsonData);
            console.log('The processed image:', jsonData.procImage);
            console.log('Number of apples:', jsonData.numDetections);
            setProcessedImage({ opacity: 0, path: jsonData.procImage });
            setNumApples(jsonData.numDetections);
        })
        .catch(error => console.error("Error fetching data:", error));
    }, [])

    // Stop the timer
    const end = performance.now();
    // Calculate and log the execution time
    console.log(`Execution time: ${end - start} ms`);
}


function numProcessedImages() {  // Counter function
    if ( typeof numProcessedImages.counter == 'undefined' ) {
        // Initalize the counter if not already initialized
        numProcessedImages.counter = -1;
    }

    numProcessedImages.counter++;
}
