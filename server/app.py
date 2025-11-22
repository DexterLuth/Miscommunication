from flask import Flask, request, jsonify
from supabase_client import supabase

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Supabase + Flask connected!"}


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="127.0.0.1", port=port)