from flask import Flask, request, jsonify
from supabase_client import supabase

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Supabase + Flask connected!"}

@app.route("/agents", methods=["GET"])
def get_agents():
    response = supabase.table("Agent").select("*").execute()
    return jsonify(response.data)

@app.route("/interactions", methods=["GET"])
def get_interactions():
    agent_id = request.args.get("agent_id")
    if agent_id:
        response = supabase.table("Interaction").select("*").eq("agent_id", agent_id).execute()
    else:
        response = supabase.table("Interaction").select("*").execute()
    return jsonify(response.data)





if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="127.0.0.1", port=port)