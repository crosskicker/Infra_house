import subprocess
import os
import json
import shutil
from pathlib import Path

def convert_GB_to_MB(data):
    """ Convert GB value to MB """
    return str(int(data) * 1024)

def convert_GB_to_bytes(data):
    """ Convert GB value to bytes """
    return str(int(data) * 1024 * 1024 * 1024)

def get_project_root() -> Path:
    """ Returns project root folder """
    return Path(__file__).resolve().parents[1]



def update_json(directory, dict_client_data ):
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


    with open(variables_file, 'w') as f:
        json.dump(variables, f, indent=2)

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

    # TODO : call update_json
    update_json(f"{project_root}/tf/stacks/client_test/infra1", dict_data_client)


    print(f"Client '{client_name}' infra {num_infra_client} created successfully.")




def run_infra(project_dir, client_name, num_infra):
    """
    Run terraform init and apply in the client's infra directory
    args: project_dir : root project directory
    args: client_name : name of the client
    args: num_infra : number of the infra
    return: None
    """
    infra_dir = f"{project_dir}/tf/stacks/{client_name}/infra{num_infra}"
    subprocess.run(["terraform", "init"], cwd=infra_dir)
    subprocess.run(["terraform", "apply", "-auto-approve"], cwd=infra_dir)



def destroy_infra(project_dir, client_name, num_infra):
    """
    Destroy the infrastructure using terraform destroy
    args: project_dir : root project directory
    args: client_name : name of the client
    args: num_infra : number of the infra
    return: None
    """
    infra_dir = f"{project_dir}/tf/stacks/{client_name}/infra{num_infra}"
    subprocess.run(["terraform", "destroy", "-auto-approve"], cwd=infra_dir)

def create_ssh_key():
    print("todo create ssh key")
    
if __name__ == "__main__":
    #test
    parent = get_project_root()
    """ 
    new_infra_client("client_test",1, {'OS': 'Crotte', 'Vcpu': '2', 'Memory': '2', 'Disk': '10', 'ssh_key': 'ssh-test'})

    run_infra(parent, "client_test", 1) 
    """
    #destroy_infra(parent, "client_test", 1)