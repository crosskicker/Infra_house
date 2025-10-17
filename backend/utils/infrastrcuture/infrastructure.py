import subprocess
import json

# todo : fichier des exceptions
#todo : fichier logger
from utils.exception.exception import *

import logging

logger_infra = logging.getLogger("infra")
logger_infra.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
file_handler = logging.FileHandler("./logs/infra.log")
file_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger_infra.addHandler(file_handler)
logger_infra.addHandler(console_handler)


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
        logger_infra.error(f"Error occurred while getting VM IP, get_vm_ip function: {e}")
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
        logger_infra.info("Infrastructure deployed successfully.")
        return get_vm_ip(infra_dir)
    except subprocess.CalledProcessError as e:
        logger_infra.error(f"Error occurred while deploying infrastructure:{infra_dir} ; {e}")
        try:
            res = subprocess.run(["terraform", "destroy", "-auto-approve"], cwd=infra_dir, capture_output=True)
            logger_infra.info(f"Auto destruction for the infra: {infra_dir}")
        except subprocess.CalledProcessError as e:
            logger_infra.error(f"Error occurred while auto destruction infrastructure: {infra_dir} ; {e}")

        finally:
            raise InfraDeployError(f"Terraform apply a échoué pour l'infrastructure {infra_dir} ")
            #return None

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
        logger_infra.info("Infrastructure destroyed successfully.")
    except subprocess.CalledProcessError as e:
        logger_infra.error(f"Error occurred while destroying infrastructure: {e}")
        raise InfraDestroyError(f"Terraform destroy a échoué : {e.stderr}")

def create_ssh_key():
    logger_infra.debug("Creating SSH key...")