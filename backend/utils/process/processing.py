import subprocess
import os
import json
import shutil
from pathlib import Path
#import yaml as pyyaml
from ruamel.yaml import YAML
import random
import paramiko
from ruamel.yaml.scalarstring import LiteralScalarString, DoubleQuotedScalarString
import threading
import time

import logging

logger_process = logging.getLogger("process")
logger_process.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
file_handler = logging.FileHandler("./logs/process.log")
file_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger_process.addHandler(file_handler)
logger_process.addHandler(console_handler)

def convert_GB_to_MB(data):
    """ Convert GB value to MB """
    return str(int(data) * 1024)

def convert_GB_to_bytes(data):
    """ Convert GB value to bytes """
    return str(int(data) * 1024 * 1024 * 1024)

def get_project_root() -> Path:
    """ Returns project root folder """
    return Path(__file__).resolve().parents[3]

def get_os_url(os_name):   
    """
    Get the URL of the OS image based on the OS name
    """
    os_images = {
        "Ubuntu-20": "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img",
        "Debian-13": "/var/lib/libvirt/images/debian-13-nocloud-amd64.qcow2",
    }
    try :
        return os_images[os_name]
    except KeyError:
        logger_process.error(f"OS name '{os_name}' not found. Available OS: {list(os_images.keys())}")
        return None

#TODO
def gen_ssh_key():
    """ Generate an SSH key pair
     """
    # TODO : use module cryptography 
    key_path = os.path.join(os.getcwd(), "id_rsa")
    subprocess.run(["ssh-keygen", "-t", "rsa", "-b", "2048", "-f", key_path, "-N", ""])
    with open(f"{key_path}.pub", 'r') as f:
        public_key = f.read().strip()
    return public_key



# TODO : Laisser l'utilisateur détaillé la config réseau
def generate_network_config(network_mode, dir, ip=None, gateway=None, dns=None):
    """ Generate a network configuration file in YAML format
    args network_mode: "nat", "bridge", "isolated", "default"
    args dir: directory to save the file
    args ip: IP address for isolated mode
    args gateway: Gateway for isolated mode
    args dns: DNS for isolated mode
    """
    yaml = YAML()
    yaml.preserve_quotes = True
    config = {"version": 2, "ethernets": {"ens3": {}}}
    ens3 = config["ethernets"]["ens3"]

    if network_mode in ("nat", "default"):
        ens3["dhcp4"] = True
        # TODO : generer un reseau nat différent necessite une range ip !
    elif network_mode == "bridge":
        ens3["dhcp4"] = True  # ou False si tu veux statique
    elif network_mode == "isolated":
        ens3["dhcp4"] = False
        ens3["addresses"] = [f"{ip}/24"]
        ens3["gateway4"] = gateway
        ens3["nameservers"] = {"addresses": [dns]}

    filename = os.path.join(dir, "network_config.yml")
    try:
        with open(filename, "w", encoding="utf-8") as f:
            yaml.dump(config, f)
    except (FileNotFoundError, PermissionError) as e:
        logger_process.error(f"Erreur accès fichier {filename} :", e)
    except yaml.YAMLError as e:
        logger_process.error(f"YAML invalide: {e}")
    except Exception as e:
        logger_process.error(f"Erreur inattendue: {e}")





def update_json(directory, dict_client_data, client_name, num_infra_client):
    """
    To edit the variables.tf.json with client's datas
    args : dict_client_data : dictionnary ex : {'OS': 'Ubuntu', 'Vcpu': '2', 'Memory': '2', 'Disk': '10', 'ssh_key': 'ssh-test'}
    """
    variables_file = os.path.join(directory, "variables.tf.json")
    try:
        with open(variables_file, 'r') as f:
            variables = json.load(f)
    except (FileNotFoundError, PermissionError) as e:
        logger_process.error(f"Erreur accès fichier {variables_file} :", e)
    except json.JSONDecodeError as e:
        logger_process.error(f"JSON invalide: {e}")
    except Exception as e:
        logger_process.error(f"Erreur inattendue: {e}")

    if variables:
        variables['variable']['vcpu']['default']= dict_client_data['Vcpu']
        variables['variable']['memory']['default']= convert_GB_to_MB(dict_client_data['Memory'])
        variables['variable']['disk_size']['default']= convert_GB_to_bytes(dict_client_data['Disk'])
        variables['variable']['ssh-key']['default']= dict_client_data['ssh_key']
        variables['variable']['image_name']['default']= dict_client_data['OS']
        variables['variable']['mac']['default'] = "52:54:00:" + ":".join([f"{random.randint(0, 255):02x}" for _ in range(3)]) #MAC random
        variables['variable']['client_name']['default']= client_name
        variables['variable']['domain_num']['default']= num_infra_client
        variables['variable']['image']['default']= get_os_url(dict_client_data['OS'])
        variables['variable']['network_mode']['default']= dict_client_data['Network'].lower() # nat, bridge, isolated, default
        variables['variable']['iso_name']['default']= dict_client_data['name']+"-"+ client_name

    try:
        with open(variables_file, 'w') as f:
            json.dump(variables, f, indent=2)
    except (FileNotFoundError, PermissionError) as e:
        logger_process.error(f"Erreur accès fichier {variables_file} :", e)
    except json.JSONDecodeError as e:
        logger_process.error(f"JSON invalide: {e}")
    except Exception as e:
        logger_process.error(f"Erreur inattendue: {e}")



def update_yaml(file_path, dict_client_data, client_name, num_infra_client):
    """
    To edit the cloud_init.yml and network_config.yml with client's datas
    args : dict_client_data : dictionnary ex : {'OS': 'Ubuntu', 'Vcpu': '2', 'Memory': '2', 'Disk': '10', 'ssh_key': 'ssh-test'}
    """
    yaml = YAML()
    yaml.preserve_quotes = True
    # Cloud init configuration
    cloud_init_file = os.path.join(file_path, "cloud_init.yml")
    try:
        with open(cloud_init_file, 'r', encoding="utf-8") as f:
            yaml_data = yaml.load(f)
    except (FileNotFoundError, PermissionError) as e:
        logger_process.error(f"Erreur accès fichier {cloud_init_file} :", e)
    except yaml.YAMLError as e:
        logger_process.error(f"YAML invalide: {e}")
    except Exception as e:
        logger_process.error(f"Erreur inattendue: {e}")

    if yaml_data:
        yaml_data['hostname'] = client_name
        yaml_data['users'][0]['home'] = "/home/" + client_name # TODO : not name but user login !? -> BDD
        yaml_data['users'][0]['name'] = client_name # TODO : not name but user login !? -> BDD

        ssh_key_in_place = yaml_data['users'][0]['ssh-authorized-keys'].pop()# to use DoubleQuotedScalarString with the original key
        yaml_data['users'][0]['ssh-authorized-keys'].append(DoubleQuotedScalarString(ssh_key_in_place))
        yaml_data['users'][0]['ssh-authorized-keys'].append(DoubleQuotedScalarString(dict_client_data['ssh_key']))
    
    # TODO ERROR WRITING
        yaml_data['chpasswd']['list'] = LiteralScalarString(f"{client_name}:toto\n")
    #LiteralScalarString(f"{client_name}:test\n{client_name}:test2\n")

    try:
        with open(cloud_init_file, 'w', encoding="utf-8") as f:
            yaml.dump(yaml_data, f)
    except (FileNotFoundError, PermissionError) as e:
        logger_process.error(f"Erreur accès fichier {cloud_init_file} :", e)
    except yaml.YAMLError as e:
        logger_process.error(f"YAML invalide: {e}")
    except Exception as e:
        logger_process.error(f"Erreur inattendue: {e}")

    # TODO : Laisser l'utilisateur détaillé la config réseau
    # Network configuration
    generate_network_config(dict_client_data['Network'], file_path)



   

def new_infra_client(client_name,num_infra_client, dict_data_client):
    """
    Create a new client directory with Terraform configuration files
    args client_name: Name of the new client
    args num_infra_client: Number of the infrastructure client ( get via BDD )
    return: None
    """
    # Parent directory project
    project_root = get_project_root()


    # Create a new directory for new infra
    infra_dir = f"{project_root}/tf/stacks/{client_name}/infra{num_infra_client}"
    if not os.path.exists(infra_dir):
        os.makedirs(infra_dir)

    # Copy the template files to the new client directory
    template_dir = f"{project_root}/tf/templates"
    for filename in os.listdir(template_dir):
        src_file = os.path.join(template_dir, filename)
        dst_file = os.path.join(infra_dir, filename)
        shutil.copy(src_file, dst_file) # Erase if already exists

    
    update_json(f"{project_root}/tf/stacks/{client_name}/infra{num_infra_client}", dict_data_client, client_name, num_infra_client)
    update_yaml(f"{project_root}/tf/stacks/{client_name}/infra{num_infra_client}", dict_data_client, client_name, num_infra_client)


    logger_process.debug(f"Client '{client_name}' infra {num_infra_client} directories created successfully.")


def run_ssh_command(ip,  command, username="toto"):
    """
    Exécute une commande SSH sur une VM avec clé privée.

    :param ip: adresse IP de la VM
    :param private_key_path: chemin vers la clé privée (ex: ~/.ssh/id_rsa)
    :param command: commande shell à exécuter
    :param username: utilisateur SSH (par défaut "cross")
    :return: sortie de la commande (stdout, stderr)
    """
    project_dir = get_project_root()
    private_key_path = os.path.join(project_dir, "backend/ssh/id_rsa")
    key = paramiko.RSAKey.from_private_key_file(private_key_path)
    logger_process.info("Using private key:", private_key_path)
    logger_process.info("Connecting to:", ip)
    logger_process.info("Using username:", username)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())  # accepter hostkey auto
    # TODO : change username
    client.connect(ip, username=username, pkey=key)

    # ouvrir une session avec un pseudo-terminal (PTY obligatoire pour tty-share)
    transport = client.get_transport()
    channel = transport.open_session()
    channel.get_pty()
    channel.exec_command(command)

    url_container = {"url": None}  # stockage temporaire

    def reader():
        while True:
            if channel.recv_ready():
                chunk = channel.recv(4096).decode("utf-8", errors="ignore")
                print("[TTY-SHARE OUT]", chunk.strip())
                if "https" in chunk and url_container["url"] is None:
                    channel.send("\n") # pour lancer le tty-share
                    for word in chunk.split():
                        if word.startswith("https"):
                            url_container["url"] = word
                            print("[URL FOUND]", word)
            if channel.recv_stderr_ready():
                chunk = channel.recv_stderr(4096).decode("utf-8", errors="ignore")
                print("[TTY-SHARE ERR]", chunk.strip())
            if channel.exit_status_ready():
                break

    t = threading.Thread(target=reader, daemon=True)
    t.start()

    timeout = 10  # secondes
    waited = 0
    while url_container["url"] is None and waited < timeout:
        time.sleep(0.2)
        waited += 0.2

    if url_container["url"] is None:
        logger_process.error("Aucune URL tty-share détectée dans le délai imparti.")
        raise TimeoutError("Aucune URL tty-share détectée dans le délai imparti.")

    # retourne le client et le channel pour les garder vivants
    return url_container["url"] , None


def get_vm_ip(path):
    try:
        result = subprocess.run(
            ["terraform", "output", "-json", "vm_ip"],
            cwd=path,
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        logger_process.error(f"Erreur lors de l'exécution de la commande Terraform: {e}")
        return None
    

if __name__ == "__main__":
    #test
    parent = get_project_root()
    print(parent)
     
    #new_infra_client("client_test",1, {'OS': 'Ubuntu', 'Vcpu': '4', 'Memory': '2', 'Disk': '20', 'ssh_key': 'rsa-<key>', 'name': 'myvm1', 'network': 'NAT', 'description': ''})
    """
    run_infra(parent, "client_test", 1) 
    """
    #destroy_infra(parent, "client_test", 1)
    """ with open(f"{parent}/tf/templates/cloud_init.yml", "r") as file:
        print(pyyaml.safe_load(file)) """
    
    #new_infra_client("client_test",2, {'OS': 'Ubuntu-20', 'Vcpu': '4', 'Memory': '2', 'Disk': '20', 'ssh_key': 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyvX6pX5Wn5y7k0vV9xYqz8+7b1gYh+Kk3jH9mXlGk6mZzF3xX5F5mXlGk6mZzF3xX5F5mXlG', 'name': 'myvm2', 'Network': 'bridge', 'description': ''})
    
