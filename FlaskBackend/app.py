from flask import Flask, jsonify
from flask_cors import CORS
import base64

# Create app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Holds data from processing an image -> send this data to front end
class procImageData:
    def __init__(self, procImage, numDetections):
        self.procImage = procImage
        self.numDetections = numDetections


# Process Image
def processImage(originalImage):
    # maybe have like a switch statement for which num algorithm user wants to run
    procData = detectApples()
    # procData = detectAppleBlossoms()
    # procData = detectPeaches()
    # procData = detectPeachBlossoms()

    return procImageData(procImage, procData['numDetections'])

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
    #imageData = processImage(originalImage)

    # Convert procImageData object to dictionary for JSON serialization
    #responseData = {
    #    'procImage': imageData.procImage,
    #    'numDetections': imageData.numDetections
    #}
    responseData = {
        'procImage': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenj8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6ggUEhQGxgkZgAAAAd0SU1FB9YGARcZJADs4OzUAAAArSURBVDhghwMBAgAEUAAnF3AQAAIbJREFUGNO9zLsNglAAxPEfWVlZWNiYUoQqyQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQpQ',
        'numDetections': 37
    }

    return jsonify(responseData)

@app.route("/hello", methods=['GET'])
def helloWorld():

    return jsonify({"Hello":"Hello World"})

if __name__ == "__main__":
    app.run(host='192.168.1.224', port=5000, debug=True)
