# pip install pymongo passlib[argon2]
from dotenv import load_dotenv
import os, pymongo
from datetime import datetime, timezone
from pymongo import MongoClient, ReturnDocument, ASCENDING
from bson import ObjectId
from pymongo.errors import CollectionInvalid, OperationFailure

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]           # Atlas SRV URL
DB_NAME   = os.getenv("MONGO_DB", "app")

client = MongoClient(MONGO_URL, appname="myapp", serverSelectionTimeoutMS=5000)
db = client[DB_NAME]



def ensure_collections_and_indexes():
    """" Crée les collections, valideurs et indexes.
        Idempotent : peut être appelé à chaque démarrage de l'application.
    """
    # Validators (JSON Schema). Création si absente, sinon collMod (idempotent).
    def ensure_validator(name, schema):
        try:
            db.create_collection(name, validator={"$jsonSchema": schema})
        except pymongo.errors.CollectionInvalid:
            db.command("collMod", name, validator={"$jsonSchema": schema}, validationLevel="moderate")

    user_schema = {
        "bsonType": "object",
        "required": ["email", "passwordHash", "createdAt", "isActive"],
        "properties": {
            "email": {"bsonType": "string"},
            "passwordHash": {"bsonType": "string"},
            "isActive": {"bsonType": "bool"},
            "createdAt": {"bsonType": "date"}
        },
        "additionalProperties": True
    }
    vm_schema = {
        "bsonType": "object",
        "required": ["userId", "name", "os", "externalId", "currentState", "createdAt"],
        "properties": {
            "userId": {"bsonType": "objectId"},
            "name": {"bsonType": "string"},
            "os": {"bsonType": "string"},
            "externalId": {"bsonType": "string"},
            "currentState": {"enum": ["provisioning","running","stopped","terminated","error"]},
            "createdAt": {"bsonType": "date"}
        },
        "additionalProperties": True
    }

    ensure_validator("users", user_schema)
    ensure_validator("vms", vm_schema)
    #ensure_validator("vm_events", vm_event_schema)

    db.vms.create_index([("numero_infra", ASCENDING)], unique=True)

    """ # Indexes (idempotents)
    db.users.create_index("email", unique=True)
    db.vms.create_index([("userId", 1), ("provider", 1), ("externalId", 1)], unique=True)
    db.vms.create_index([("currentState", 1), ("lastSeen", -1)])
    db.vm_events.create_index([("vmId", 1), ("createdAt", -1)])
    # Exemple TTL (purge auto d'événements après N jours)
    # db.vm_events.create_index("createdAt", expireAfterSeconds=60*60*24*90) """



def create_user(email: str, password_hash: str) -> ObjectId:
    """ Crée un utilisateur. Retourne son _id.
        Lève DuplicateKeyError si email déjà utilisé.
    """
    now = datetime.now(timezone.utc)
    res = db.users.insert_one({
        "email": email,
        "passwordHash": password_hash,  # Argon2id/bcrypt côté app
        "isActive": True,
        "createdAt": now
    })
    return res.inserted_id



def upsert_vm(user_id: ObjectId, name:str ,os: str, external_id: str, num_infra: int,patch: dict):
    """ Crée ou met à jour une VM.
        patch : dict avec les champs à mettre à jour (currentState, metadata, etc.)
        args: user_id : ObjectId de l'utilisateur propriétaire
        args: os : str, nom du os (libvirt, aws, azure, ...)
        args: external_id : str, ID de la VM
        args: patch : dict, info sur la VM à mettre à jour
        Retourne le document complet après modification.
    """
    now = datetime.now(timezone.utc)
    return db.vms.find_one_and_update(
        {"userId": user_id, "name": name, "os": os, "externalId": external_id, "numero_infra": num_infra},
        {"$setOnInsert": {"createdAt": now},
         "$set": {"lastSeen": now, **patch}},
        upsert=True, return_document=ReturnDocument.AFTER
    )

def list_user_vms(user_id: ObjectId):
    return list(db.vms.find({"userId": user_id}).sort("createdAt", -1))

def user_with_vms(email: str):
    # Jointure via aggregate + $lookup
    pipeline = [
        {"$match": {"email": email}},
        {"$lookup": {
            "from": "vms",
            "localField": "_id",
            "foreignField": "userId",
            "as": "vms"
        }},
        {"$project": {"passwordHash": 0}}
    ]
    return list(db.users.aggregate(pipeline))[0]

def logging(username: str, password: str) -> bool:
    """
    Check if user exists with given username and password
    Useful for login
    """
    user = db.users.find_one({
        "email": username,
        "passwordHash": password,
        "isActive": True
    })
    print(user)
    return user



def get_num_infra_client(user_id: ObjectId) -> int:
    """
    Get the number of infrastructure clients for a given user
    args user_id: ObjectId of the user
    return: int, number of infrastructure clients
    """
    return db.vms.count_documents({"userId": user_id})



def get_login(user_id: ObjectId) -> str:
    """
    Get the login of a user by its id
    args user_id: ObjectId of the user
    return: str, login of the user
    """
    user = db.users.find_one({"_id": user_id})
    if user:
        return user['email']
    else:
        return None

if __name__ == "__main__":
    ensure_collections_and_indexes()
    # Démo
    """ uid = create_user("alice@example.com", "argon2id$...hash...")
    vm = upsert_vm(uid, "libvirt", "vm-001",
                   {"currentState": "running", "metadata": {"vcpu": 2, "ramMB": 4096}}) 
    print("VM:", vm)
    print("VMs de l'utilisateur:", list_user_vms(uid))"""

    #result = db.vms.find({"currentState": "running"}) 
    """ for vm in result:
        print(vm["userId"]) """
    
    """ result = list(result)
    print(result) """
    #uid = create_user("toto","toto")
    #print(uid)

    lol = logging("toto","toto")
    """
    print(lol) """
    """  uid = create_user("alice@example.com", "argon2id$...hash...")
    print("UID:", uid)
    vm = upsert_vm(uid, "myvm", "libvirt", "vm-001", 1,
                   {"currentState": "running", "metadata": {"vcpu": 2, "ramMB": 4096}})
    """
