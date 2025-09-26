from flask import Flask, request, session, jsonify
from flask_cors import CORS
from flask_session import Session
import redis
from flask_caching import Cache
from dotenv import load_dotenv
import os
from utils.bdd.bdd import *
from utils.process.processing import *


app = Flask(__name__)
app.secret_key = "my_secret_todo" #os.getenv('SECRET_KEY')  # Secret key for session var
CORS(app, supports_credentials=True)  # CORS enabled for flask

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    print("Login attempt:", data)
    logged = logging(data.get("username"), data.get("password"))
    session['user_id'] = str(logged.get("_id"))  # Store user ID in session
    if logged:
        return jsonify({"results": "success"}), 200
    else:
        return jsonify({"results": "error"}), 401

@app.route("/api/create-vm", methods=["POST"])
def create_vm():
    data = request.json
    print("Received data:", data)

    # TODO : Call processing functions to create VM
    # Then we can add in BDD ressources




    # num_infra_client from BDD
    num_infra_client = get_num_infra_client(ObjectId(session['user_id'])) + 1

    # Add a VM datas in BDD ressources 
    wanted_keys = {"name", "os"}

    # Extraction
    name = data.get("name") # VM NAME
    os = data.get("OS")
    id = session['user_id']
   
    # Extra fields
    extra_fields = {k: v for k, v in data.items() if k not in wanted_keys}

    # Insert VM in BDD
    upsert_vm(ObjectId(id), name, os, f"vm-{name}", num_infra_client,
              {"currentState": "provisioning", "metadata": extra_fields}) # TODO : external id is useless

        
    # TODO : create a loading page while VM is being created
    # TODO : return VM info when ready (ip, user, mdp, ssh key, ...)
    return jsonify({"message": "VM created", "data": data}), 201

if __name__ == "__main__":
    app.run(debug=True)
