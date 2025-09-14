import subprocess
import os
import json
import shutil



def new_client(client_name):
    """
    Create a new client directory with Terraform configuration files
    param client_name: Name of the new client
    return: None
    """
    # Create a new directory for the client
    client_dir = f"tf/stacks/{client_name}"
    if not os.path.exists(client_dir):
        os.makedirs(client_dir)
    
    # Copy the template files to the new client directory
    template_dir = "tf/templates"
    for filename in os.listdir(template_dir):
        src_file = os.path.join(template_dir, filename)
        dst_file = os.path.join(client_dir, filename)
        shutil.copy(src_file, dst_file)
    
    # Update the variables.tf.json file with the client's configuration
    variables_file = os.path.join(client_dir, "variables.tf.json")
    with open(variables_file, 'r') as f:
        variables = json.load(f)
    #TODO: change json values based on user input
    
    # To apply changes
    with open(variables_file, 'w') as f:
        json.dump(variables, f, indent=2)
    
    print(f"Client '{client_name}' created successfully.")


def run_infra():
    print("todo run infra")

def create_ssh_key():
    print("todo create ssh key")
    
if __name__ == "__main__":

    new_client("client_test")