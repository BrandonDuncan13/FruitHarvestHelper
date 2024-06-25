from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import base64

# Create app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

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
def processImage(originalImageBase64):
    # maybe have like a switch statement for which num algorithm user wants to run
    # procData = detectApples()
    # procData = detectAppleBlossoms()
    # procData = detectPeaches()
    # procData = detectPeachBlossoms()

    return procImageData(originalImageBase64, 5)

# Detection algorithms
def detectApples():
    # Example data structure
    procData = {
        'image': 'path/to/image.jpg',  # This could be a Base64 string instead
        'numDetections': 5
    }

    return procData

def detectAppleBlossoms():

    return procData

def detectPeaches():

    return procData

def detectPeachBlossoms():

    return procData


# Route functions
@app.route("/sendData", methods=['POST'])
def sendOrgImage():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['image']

        # Convert the uploaded file to a base64 string
        originalImageBase64 = base64.b64encode(file.read()).decode('utf-8')
        
        # Store the original image in the session
        session['originalImageBase64'] = originalImageBase64
        
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

    # Process the image
    imageData = processImage(originalImageBase64)

    # Convert procImageData object to dictionary for JSON serialization
    responseData = {
        'procImage': imageData.procImage,
        'numDetections': imageData.numDetections
    }

    return jsonify(responseData)

if __name__ == "__main__":
    app.run(host='192.168.1.224', port=5000, debug=True)
