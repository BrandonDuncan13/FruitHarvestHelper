from flask import Flask, jsonify
import base64

# Create app
app = Flask(__name__)

# Holds data from processing an image -> send this data to front end
class procImageData:
    def __init__(self, procImage, numDetections):
        self.procImage = procImage
        self.numDetections = numDetections


# Process Image
def processImage(originalImage):
    procData = detectApples()
    # procData = detectAppleBlossoms()
    # procData = detectPeaches()
    # procData = detectPeachBlossoms()

    return


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

    return jsonify({"Hello":"World"})

@app.route("/getData", methods=['GET'])
def getProcImageData():
    # Process the sent image
    imageData = processImage(originalImage)

    # Convert procImageData object to dictionary for JSON serialization
    responseData = {
        'procImage': imageData.procImage,
        'numDetections': imageData.numDetections
    }

    return jsonify(responseData)

if __name__ == "__main__":
    app.run(host='', port=3000, debug=True)
