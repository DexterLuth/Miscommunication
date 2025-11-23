from flask import Flask, request, jsonify
from main import processTranscript
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.INFO)

# Send transcript to ai
@app.route("/response", methods=["POST"])
def post_transcript():
    app.logger.info("Running")
    transcript = request.get_json()
    file = transcript.get("file")
    score = processTranscript(file)

    return jsonify({"output": score})



if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="127.0.0.1", port=port)