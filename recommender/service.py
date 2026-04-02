from __future__ import annotations

from typing import Any, Dict, List, Optional
import re
from urllib.parse import urlparse

from .config import MONGODB_URI
from .db import fetch_brand_description_by_user_id, fetch_influencers, get_collections
from .embeddings import embed_description, ensure_embeddings
from .search import rank_influencers


def _extract_instagram_handle(value: Any) -> str:
    if not value:
        return ""
    if isinstance(value, str):
        raw = value.strip()
    else:
        return ""

    if "instagram.com" in raw:
        parsed = urlparse(raw)
        path = parsed.path.strip("/")
        if path:
            return path.split("/")[0].lstrip("@")
        return ""

    handle = raw.lstrip("@").strip()
    if re.match(r"^[A-Za-z0-9._]+$", handle):
        return handle

    return ""


def _pick_youtube_channel(creator: Dict[str, Any]) -> str:
    return creator.get("youtube_channel") or creator.get("youtube") or ""


def _format_output(creator: Dict[str, Any]) -> Dict[str, Any]:
    instagram_value = creator.get("instagram_handle") or creator.get("instagram") or ""
    return {
        "Instagram handle": _extract_instagram_handle(instagram_value),
        "Youtube channel": _pick_youtube_channel(creator),
        "similarity_score": round(float(creator.get("similarity_score", 0.0)), 4),
        "estimated cost": creator.get("estimated_cost"),
    }


def get_recommendations(
    description: str,
    budget: Optional[float] = None,
    top_k: int = 5,
    mongo_uri: Optional[str] = None,
    db_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    uri = mongo_uri or MONGODB_URI
    collections = get_collections(uri, db_name=db_name)

    influencers = fetch_influencers(collections.influencers)
    influencers = ensure_embeddings(influencers, collections.influencers)

    brand_embedding = embed_description(description)
    ranked = rank_influencers(brand_embedding, influencers, budget=budget, top_k=top_k)

    return [_format_output(creator) for creator in ranked]


def get_recommendations_for_user(
    user_id: str,
    budget: Optional[float] = None,
    top_k: int = 5,
    mongo_uri: Optional[str] = None,
    db_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    uri = mongo_uri or MONGODB_URI
    collections = get_collections(uri, db_name=db_name)
    description, _user = fetch_brand_description_by_user_id(collections.users, user_id)

    return get_recommendations(
        description,
        budget=budget,
        top_k=top_k,
        mongo_uri=uri,
        db_name=db_name,
    )
