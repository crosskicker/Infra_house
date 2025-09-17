# pip install pymongo passlib[argon2]
from dotenv import load_dotenv
import os, pymongo
from datetime import datetime, timezone
from pymongo import MongoClient, ReturnDocument
from bson import ObjectId
from pymongo.errors import CollectionInvalid, OperationFailure

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]           # Atlas SRV URL
DB_NAME   = os.getenv("MONGO_DB", "app")

client = MongoClient(MONGO_URL, appname="myapp", serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

def ensure_collections_and_indexes():
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
        "required": ["userId", "provider", "externalId", "currentState", "createdAt"],
        "properties": {
            "userId": {"bsonType": "objectId"},
            "provider": {"bsonType": "string"},
            "externalId": {"bsonType": "string"},
            "currentState": {"enum": ["provisioning","running","stopped","terminated","error"]},
            "createdAt": {"bsonType": "date"}
        },
        "additionalProperties": True
    }

    ensure_validator("users", user_schema)
    ensure_validator("vms", vm_schema)
    try:
        db.create_collection("vm_events")  # PAS de ignoreExisting
    except CollectionInvalid:
        pass  # existe déjà (ancienne version de PyMongo)
    except OperationFailure as e:
        # Atlas peut lever OperationFailure code 48 (NamespaceExists)
        if getattr(e, "code", None) != 48 and "already exists" not in str(e).lower():
            raise

    # Indexes (idempotents)
    db.users.create_index("email", unique=True)
    db.vms.create_index([("userId", 1), ("provider", 1), ("externalId", 1)], unique=True)
    db.vms.create_index([("currentState", 1), ("lastSeen", -1)])
    db.vm_events.create_index([("vmId", 1), ("createdAt", -1)])
    # Exemple TTL (purge auto d'événements après N jours)
    # db.vm_events.create_index("createdAt", expireAfterSeconds=60*60*24*90)

def create_user(email: str, password_hash: str) -> ObjectId:
    now = datetime.now(timezone.utc)
    res = db.users.insert_one({
        "email": email,
        "passwordHash": password_hash,  # Argon2id/bcrypt côté app
        "isActive": True,
        "createdAt": now
    })
    return res.inserted_id

def upsert_vm(user_id: ObjectId, provider: str, external_id: str, patch: dict):
    now = datetime.now(timezone.utc)
    return db.vms.find_one_and_update(
        {"userId": user_id, "provider": provider, "externalId": external_id},
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

if __name__ == "__main__":
    ensure_collections_and_indexes()
    # Démo
    """ uid = create_user("alice@example.com", "argon2id$...hash...")
    vm = upsert_vm(uid, "libvirt", "vm-001",
                   {"currentState": "running", "metadata": {"vcpu": 2, "ramMB": 4096}}) 
    print("VM:", vm)
    print("VMs de l'utilisateur:", list_user_vms(uid))"""
