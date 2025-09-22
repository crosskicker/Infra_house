from flask import Flask, request, session, jsonify
from flask_cors import CORS
from flask_session import Session
import redis
from flask_caching import Cache
from dotenv import load_dotenv
import os


app = Flask(__name__)
app.secret_key = "my_secret_todo" #os.getenv('SECRET_KEY')  # Secret key for session var
CORS(app, supports_credentials=True)  # CORS enabled for flask

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/api/create-vm", methods=["POST"])
def create_vm():
    data = request.json
    print("Received data:", data)
    # TODO : create in BDD ressources 
    # TODO : Call processing functions to create VM
    return jsonify({"message": "VM created", "data": data}), 201

if __name__ == "__main__":
    app.run(debug=True)
