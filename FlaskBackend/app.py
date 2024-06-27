# Runs with a docker container
# To get a docker container running create an image file (.tar) by using dockerfile
from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import base64
import os

# Create app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Generate a random secret key for securing session cookies
app.secret_key = os.urandom(24)

# Configure session to use filesystem (instead of signed cookies)
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Holds data from processing an image -> send this data to front end
class procImageData:
    def __init__(self, procImage, numDetections):
        self.procImage = procImage
        self.numDetections = numDetections


# Process Image
def processImage(originalImageBase64, algorithm):
    # Determine which algorithm to run based on user's selected algorithm
    if algorithm == 0:
        procData = detectApples(originalImageBase64)
    elif algorithm == 1:
        procData = detectAppleBlossoms(originalImageBase64)
    elif algorithm == 2:
        procData = detectPeaches(originalImageBase64)
    elif algorithm == 3:
        procData = detectPeachBlossoms(originalImageBase64)
    
    return procData

# Detection algorithms
def detectApples(originalImageBase64):
    # Just send back the original image for testing
    processedImage = originalImageBase64

    return procImageData(processedImage, 5)

def detectAppleBlossoms(originalImageBase64):
    # Just send back the original image for testing
    processedImage = originalImageBase64

    return procImageData(processedImage, 5)

def detectPeaches(originalImageBase64):
    # Just send back the original image for testing
    processedImage = originalImageBase64

    return procImageData(processedImage, 5)

def detectPeachBlossoms(originalImageBase64):
    # Just send back the original image for testing
    processedImage = originalImageBase64

    return procImageData(processedImage, 5)


# Route functions
@app.route("/sendData", methods=['POST'])
def sendOrgImage():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['image']
        algoChoice = int(request.form.get('algoChoice'))

        # Convert the uploaded file to a base64 string
        originalImageBase64 = base64.b64encode(file.read()).decode('utf-8')
        
        # Store the original image in the session
        session['originalImageBase64'] = originalImageBase64
        # Store the user's algorithm choice in the session
        session['algoChoice'] = algoChoice
        
        # Indicate data was successfully received
        return jsonify({"message": "Success"})
    except Exception as e:
        print(e)  # Log the error for debugging purposes
        return jsonify({"error": str(e)}), 500

@app.route("/getData", methods=['GET'])
def getProcImageData():
    # Retrieve the original image from the session
    originalImageBase64 = session.get('originalImageBase64')
    if originalImageBase64 is None:
        return jsonify({"error": "No image received yet"}), 404
    
    algorithm = session.get('algoChoice')
    if algorithm is None:
        return jsonify({"error": "No algorithm received yet"}), 404

    # Process the image
    imageData = processImage(originalImageBase64, algorithm)

    # Convert procImageData object to dictionary for JSON serialization
    responseData = {
        'procImage': imageData.procImage,
        'numDetections': imageData.numDetections
    }

    return jsonify(responseData)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
