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
    return os_images.get(os_name, "Error OS")

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



def update_json(directory, dict_client_data, client_name, num_infra_client):
    """
    To edit the variables.tf.json with client's datas
    args : dict_client_data : dictionnary ex : {'OS': 'Ubuntu', 'Vcpu': '2', 'Memory': '2', 'Disk': '10', 'ssh_key': 'ssh-test'}
    """
    variables_file = os.path.join(directory, "variables.tf.json")
    with open(variables_file, 'r') as f:
        variables = json.load(f)

    variables['variable']['vcpu']['default']= dict_client_data['Vcpu']
    variables['variable']['memory']['default']= convert_GB_to_MB(dict_client_data['Memory'])
    variables['variable']['disk_size']['default']= convert_GB_to_bytes(dict_client_data['Disk'])
    variables['variable']['ssh-key']['default']= dict_client_data['ssh_key']
    variables['variable']['image_name']['default']= dict_client_data['OS']
    variables['variable']['mac']['default'] = "52:54:00:" + ":".join([f"{random.randint(0, 255):02x}" for _ in range(3)]) #MAC random
    variables['variable']['client_name']['default']= client_name
    variables['variable']['domain_num']['default']= num_infra_client
    variables['variable']['image']['default']= get_os_url(dict_client_data['OS'])


    with open(variables_file, 'w') as f:
        json.dump(variables, f, indent=2)



def update_yaml(file_path, dict_client_data, client_name, num_infra_client):
    """
    To edit the cloud_init.yml and network_config.yml with client's datas
    args : dict_client_data : dictionnary ex : {'OS': 'Ubuntu', 'Vcpu': '2', 'Memory': '2', 'Disk': '10', 'ssh_key': 'ssh-test'}
    """
    yaml = YAML()
    yaml.preserve_quotes = True
    # Cloud init configuration
    cloud_init_file = os.path.join(file_path, "cloud_init.yml")
    with open(cloud_init_file, 'r', encoding="utf-8") as f:
        yaml_data = yaml.load(f)

    yaml_data['hostname'] = client_name
    yaml_data['users'][0]['home'] = "/home/" + client_name # TODO : not name but user login !? -> BDD
    yaml_data['users'][0]['name'] = client_name # TODO : not name but user login !? -> BDD
    
    ssh_key_in_place = yaml_data['users'][0]['ssh-authorized-keys'].pop()# to use DoubleQuotedScalarString with the original key
    yaml_data['users'][0]['ssh-authorized-keys'].append(DoubleQuotedScalarString(ssh_key_in_place))
    yaml_data['users'][0]['ssh-authorized-keys'].append(DoubleQuotedScalarString(dict_client_data['ssh_key']))
    
    # TODO ERROR WRITING
    yaml_data['chpasswd']['list'] = LiteralScalarString(f"{client_name}:toto\n")
    #LiteralScalarString(f"{client_name}:test\n{client_name}:test2\n")

    with open(cloud_init_file, 'w', encoding="utf-8") as f:
        yaml.dump(yaml_data, f)

""" 
    # Network configuration
    network_config_file = os.path.join(file_path, "network_config.yml")
    with open(network_config_file, 'r', encoding="utf-8") as f:
        yaml_data = yaml.load(f)

    match dict_client_data.get('Network'):
        case 'bridge':
            yaml_data['ethernets']['eth0']['dhcp4'] = True
        case 'default':
            pass # TODO

    with open(network_config_file, 'w', encoding="utf-8") as f:
        yaml.dump(yaml_data, f) """



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


    print(f"Client '{client_name}' infra {num_infra_client} created successfully.")

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
        print("Error occurred while getting VM IP, get_vm_ip function:", e)
        return None
    


def run_infra(project_dir, client_name, num_infra):
    """
    Run terraform init and apply in the client's infra directory
    args: project_dir : root project directory
    args: client_name : name of the client
    args: num_infra : number of the infra
    return: None
    """
    infra_dir = f"{project_dir}/tf/stacks/{client_name}/infra{num_infra}"
    try:
        subprocess.run(["terraform", "init"], cwd=infra_dir, check=True)
        subprocess.run(["terraform", "apply", "-auto-approve"], cwd=infra_dir, check=True)
        print("Infrastructure deployed successfully.")
        return get_vm_ip(infra_dir)
    except subprocess.CalledProcessError as e:
        print("Error occurred while deploying infrastructure:", e)
        res = subprocess.run(["terraform", "destroy", "-auto-approve"], cwd=infra_dir, capture_output=True)
        print("Auto destruction for the infra ", res.stdout)
        return None



def destroy_infra(project_dir, client_name, num_infra):
    """
    Destroy the infrastructure using terraform destroy
    args: project_dir : root project directory
    args: client_name : name of the client
    args: num_infra : number of the infra
    return: None
    """
    infra_dir = f"{project_dir}/tf/stacks/{client_name}/infra{num_infra}"
    try:
        subprocess.run(["terraform", "destroy", "-auto-approve"], cwd=infra_dir, check=True)
    except subprocess.CalledProcessError as e:
        print("Error occurred while destroying infrastructure:", e)

def create_ssh_key():
    print("todo create ssh key")




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
    print("Using private key:", private_key_path)
    print("Connecting to:", ip)
    print("Using username:", username)

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
        raise TimeoutError("Aucune URL tty-share détectée dans le délai imparti.")

    # retourne le client et le channel pour les garder vivants
    return url_container["url"] , None


def get_vm_ip(path):
    result = subprocess.run(
        ["terraform", "output", "-json", "vm_ip"],
        cwd=path,
        capture_output=True,
        text=True,
        check=True
    )
    return json.loads(result.stdout)

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
    
