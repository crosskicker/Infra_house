from flask import Flask, request, session, jsonify
from flask_cors import CORS
""" from flask_session import Session
import redis """
from flask_caching import Cache
from dotenv import load_dotenv
import os
from utils.bdd.bdd import *
from utils.process.processing import *

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")  # Clé secrète par défaut # Secret key for session var
app.config["SESSION_COOKIE_NAME"] = "session"
app.config["SESSION_COOKIE_SAMESITE"] = "None" # Autoriser les cookies cross-origin
app.config["SESSION_COOKIE_SECURE"] = True # Only over HTTPS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])  # CORS enabled for flask


@app.route("/")
def home():
    return "Hello, World!"



@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    print("Login attempt:", data)
    user = logging(data.get("username"), data.get("password"))

    if user:
        print("c'est good")
        session['user_id'] = str(user["_id"])
        print(session['user_id'])  
        return jsonify({"results": "success"}), 200
    else:
        return jsonify({"results": "error"}), 401



@app.route("/api/create-vm", methods=["POST"])
def create_vm():
    data = request.json
    print("Received data:", data)
    
    # num_infra_client from BDD
    num_infra_client = get_num_infra_client(ObjectId(session['user_id'])) + 1

    # Create VM ressources with Terraform
    # Then we can add in BDD ressources
    new_infra_client(data.get("name"), num_infra_client, data)

    # Run infrastructure
    # TODO run_infra(get_project_root(), data.get("name"), num_infra_client) 

    # Add a VM datas in BDD ressources 
    wanted_keys = {"name", "os"}
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
    app.run(ssl_context=("localhost+2.pem", "localhost+2-key.pem"),
            host="0.0.0.0",
            port=5000,
            debug=True)
