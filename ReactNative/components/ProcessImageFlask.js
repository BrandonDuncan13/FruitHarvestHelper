// The Flask server uses a docker container to run on a local machine currently -> a container can be hosted on the cloud though
export const sendDataToServer = (image, algoChoice, setTimerStart) => { // Send data that the Flask server needs to process image
    console.log('sending data to flask...');
    // Start the timer and increment processed images for naming images
    setTimerStart(performance.now());
    
    // Create FormData instance
    let formData = new FormData();

    // Append the image to FormData
    formData.append('image', {
      uri: image.path,
      type: image.mime, // Type of data being sent
      name: image.filename || image.path.split('/').pop(),
    });

    // Append the algorithm choice to FormData
    formData.append('algoChoice', algoChoice); // the bottom sheet text can even be based on the user selection
    
    // Send FormData to the Flask server
    return fetch('http://192.168.1.224:5000/sendData', { // Change to server address once server is hosted on cloud
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
     .then(resp => resp.json())
     .catch(error => console.error('Error sending data to server:', error));
  };
  
export const fetchProcessedData = (props, timerStart, setTimerEnd) => { // Fetch JSON data from Flask web server asynchronously
    console.log('fetching from flask...');

    return fetch('http://192.168.1.224:5000/getData', { // Change to server address once server is hosted on cloud
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(jsonData => {
        console.log(`Received Promise from flask:`, jsonData);
        console.log('The processed image:', jsonData.procImage);
        console.log('Number of apples:', jsonData.numDetections);
    
        // Convert base64 string (processedImage) to image source
        const base64String = jsonData.procImage;
        const imageSource = `data:image/jpeg;base64,${base64String}`;

        // Update UI with processed data
        props.setProcessedImage({ opacity: 0, path: imageSource });
        props.setNumApples(jsonData.numDetections);
        setTimerEnd(performance.now());
        
        // Log the processing time
        const executionTime = performance.now() - timerStart;
        console.log(`Execution time: ${executionTime} ms`);
    })
    .catch(error => console.error("Error fetching data:", error));
};

export function numProcessedImages() {  // Counter function for naming images
    if ( typeof numProcessedImages.counter == 'undefined' ) {
        // Initalize the counter if not already initialized
        numProcessedImages.counter = -1;
    }

    numProcessedImages.counter++;
}
