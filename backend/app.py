from flask import Flask, request, session, jsonify
from flask_cors import CORS
""" from flask_session import Session
import redis """
from flask_caching import Cache
from dotenv import load_dotenv
import os
from utils.bdd.bdd import *
from utils.process.processing import *
from utils.infrastrcuture.infrastructure import *
from utils.exception.exception import *

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")  # Clé secrète par défaut # Secret key for session var
app.config["SESSION_COOKIE_NAME"] = "session"
app.config["SESSION_COOKIE_SAMESITE"] = "None" # Autoriser les cookies cross-origin
app.config["SESSION_COOKIE_SECURE"] = True # Only over HTTPS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])  # CORS enabled for flask


 
@app.errorhandler(AppError)
def handle_app_error(e):
    """Handle custom application errors.
    Return a JSON response with the error message and a 400 status code.
    """
    return jsonify({"error": str(e)}), 400




@app.route("/api/sign-up", methods=["POST"])
def sign_up():
    # todo : add error control
    data = request.json
    print("Sign Up attempt:", data)
    create_user(data.get("username"), data.get("password"))
    return jsonify({"results": "success"}), 201



@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    print("Login attempt:", data)
    user = logging(data.get("username"), data.get("password"))

    # todo : faire expirer la session 
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

    # login
    login_user = get_login(ObjectId(session['user_id']))
    
    # num_infra_client from BDD
    num_infra_client = get_num_infra_client(ObjectId(session['user_id'])) + 1

    # Create VM ressources with Terraform
    # Then we can add in BDD ressources
    new_infra_client(login_user, num_infra_client, data)

    # Run infrastructure
    vm_ip = run_infra(get_project_root(), login_user, num_infra_client)
    print(vm_ip)

    # TODO : avec les try catch pour gérer les erreurs
        # si on a un probleme ca continue alors il faut que ca continue mais comme il faut !!!  
              # on ne vas pas ajouter dans la BDD si l'infra ne s'est pas lancer, on ne va pas non plus renvoyé code 201 au serveur
    
    # Add a VM datas in BDD ressources 
    wanted_keys = {"name", "os"}
    name = data.get("name") # VM NAME
    os = data.get("OS")
    id = session['user_id']
   
    # Extra fields
    extra_fields = {k: v for k, v in data.items() if k not in wanted_keys}
    extra_fields["ip"] = vm_ip[0] if vm_ip else ""  # Add IP to metadata


    # Insert VM in BDD
    upsert_vm(ObjectId(id), name, os, f"vm-{name}", num_infra_client,
              {"currentState": "running", "metadata": extra_fields}) # TODO : external id is useless 
        
    # TODO : create a loading page while VM is being created
    # TODO : return VM info when ready (ip, user, mdp, ssh key, ...)
    return jsonify({"message": "VM created", "data": data}), 201



@app.route("/api/start-shell", methods=["POST"])
def start_shell():
    data = request.json
    print("Received data for SSH:", data)
    id = data.get("vm_id")
    ip = get_vm_ip_bdd(ObjectId(id))
    command = "sudo /usr/local/bin/tty-share --public"
    output, err = run_ssh_command(ip, command)
    print("SSH Command Output:", output)
    print("SSH Command Error:", err)
    return jsonify({"results": output}), 200



@app.route("/api/vms-info", methods=["GET"])
def vms_info():
    # toutes les vms d'un user
    id = session.get('user_id')
    vms_info =get_user_vms(ObjectId(id)) # list of dicts
    return jsonify({"results": vms_info}), 200



@app.route("/api/destroy-vm", methods=["POST"])
def destroy_vm():
    data = request.json
    print("Received data for destroy:", data)
    vm_id = data.get("vm_id")

    # Get user login
    login_user = get_login(ObjectId(session['user_id']))

    # Get l'infra de la vm pour détruire le dossier
    infra_num = get_num_infra_vm(ObjectId(vm_id))
    
    # detruire l'infra terraform
    destroy_infra(get_project_root(), login_user, infra_num)

    # TODO : Detruire le directory ( seulement si la destruction terraform a fonctionné correctement )

    # Remove VM from BDD
    delete_vm_bdd(ObjectId(vm_id))

    return jsonify({"results": "VM destroyed"}), 200



if __name__ == "__main__":
    app.run(ssl_context=("localhost+2.pem", "localhost+2-key.pem"),
            host="0.0.0.0",
            port=5000,
            debug=True)
