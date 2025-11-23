from flask import Flask, request, jsonify
from main import processTranscript
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.INFO)

# @app.route("/")
# def home():
#     return {"message": "Supabase + Flask connected!"}

# @app.route("/agents", methods=["GET"])
# def get_agents():
#     response = supabase.table("agent").select("*").execute()
#     return jsonify(response.data)

# @app.route("/interactions", methods=["GET"])
# def get_interactions():
#     agent_id = request.args.get("agent_id")
#     if agent_id:
#         response = supabase.table("interaction").select("*").eq("agent_id", agent_id).execute()
#     else:
#         response = supabase.table("interaction").select("*").execute()
#     return jsonify(response.data)

# Send transcript to ai
@app.route("/response", methods=["POST"])
def post_transcript():
    # app.logger.info("Running")
    # transcript = request.get_json()
    # app.logger.info(f"Object received: {transcript}")
    # file = transcript.get("file")
    # app.logger.info(f"File: {file}")
    # score = int(processTranscript(file))

    return jsonify({
        "output": 9,
        })



if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="127.0.0.1", port=port)