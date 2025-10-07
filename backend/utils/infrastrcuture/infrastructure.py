import subprocess
import json

# todo : fichier des exceptions
#todo : fichier logger
from utils.exception.exception import *



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
        raise InfraDestroyError(f"Terraform destroy a échoué : {e.stderr}")

def create_ssh_key():
    print("todo create ssh key")