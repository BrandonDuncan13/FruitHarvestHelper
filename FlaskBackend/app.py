from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/sendData", methods=['POST'])
def sendOrgImage():

    return jsonify({"Hello":"World"})

@app.route("/getData", methods=['GET'])
def getProcImageData():

    return jsonify({"Hello":"World"})

if __name__ == "__main__":
    app.run(host='', port=3000, debug=True)
