from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, Optional, Tuple

from bson import ObjectId
from pymongo import MongoClient

from .config import DB_NAME, INFLUENCER_COLLECTION, USERS_COLLECTION


@dataclass
class Collections:
    influencers: Any
    users: Any


def get_client(mongo_uri: str) -> MongoClient:
    return MongoClient(mongo_uri, serverSelectionTimeoutMS=8000)


def get_collections(mongo_uri: str, db_name: Optional[str] = None) -> Collections:
    if not mongo_uri:
        raise ValueError("MongoDB URI is required")

    client = get_client(mongo_uri)
    database = client[db_name or DB_NAME]
    return Collections(
        influencers=database[INFLUENCER_COLLECTION],
        users=database[USERS_COLLECTION],
    )


def _to_object_id(value: str) -> Optional[ObjectId]:
    try:
        return ObjectId(value)
    except Exception:
        return None


def fetch_influencers(collection: Any) -> Iterable[Dict[str, Any]]:
    projection = {
        "name": 1,
        "bio": 1,
        "niche": 1,
        "followers": 1,
        "engagement": 1,
        "estimated_cost": 1,
        "instagram_handle": 1,
        "instagram": 1,
        "youtube_channel": 1,
        "youtube": 1,
        "platform": 1,
        "embedding": 1,
        "embedding_model": 1,
        "embedding_updated_at": 1,
    }
    return collection.find({}, projection=projection)


def fetch_brand_description_by_user_id(
    collection: Any, user_id: str
) -> Tuple[str, Dict[str, Any]]:
    obj_id = _to_object_id(user_id)
    query = {"_id": obj_id} if obj_id else {"_id": user_id}
    projection = {"brandDescription": 1}

    user = collection.find_one(query, projection=projection)
    if not user or not user.get("brandDescription"):
        raise ValueError("Brand description not found for user")

    return user["brandDescription"], user
