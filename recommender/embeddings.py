from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Iterable, List

import numpy as np
from sentence_transformers import SentenceTransformer

from .config import (
    EMBEDDING_FIELD,
    EMBEDDING_MODEL,
    EMBEDDING_MODEL_FIELD,
    EMBEDDING_UPDATED_AT_FIELD,
    HF_TOKEN,
)

_MODEL: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    global _MODEL
    if _MODEL is None:
        if HF_TOKEN:
            _MODEL = SentenceTransformer(EMBEDDING_MODEL, use_auth_token=HF_TOKEN)
        else:
            _MODEL = SentenceTransformer(EMBEDDING_MODEL)
    return _MODEL


def build_influencer_text(creator: Dict[str, Any]) -> str:
    niche = (creator.get("niche") or "").strip()
    bio = (creator.get("bio") or "").strip()
    if niche and bio:
        return f"{niche}. {bio}"
    return niche or bio


def embed_texts(texts: List[str]) -> np.ndarray:
    model = get_model()
    embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
    return embeddings


def ensure_embeddings(influencers: Iterable[Dict[str, Any]], collection: Any) -> List[Dict[str, Any]]:
    influencers_list = list(influencers)
    missing = []

    for creator in influencers_list:
        stored_model = creator.get(EMBEDDING_MODEL_FIELD)
        embedding = creator.get(EMBEDDING_FIELD)
        if not embedding or stored_model != EMBEDDING_MODEL:
            missing.append(creator)

    if not missing:
        return influencers_list

    texts = [build_influencer_text(creator) for creator in missing]
    embeddings = embed_texts(texts)

    for creator, vector in zip(missing, embeddings):
        collection.update_one(
            {"_id": creator["_id"]},
            {
                "$set": {
                    EMBEDDING_FIELD: vector.tolist(),
                    EMBEDDING_MODEL_FIELD: EMBEDDING_MODEL,
                    EMBEDDING_UPDATED_AT_FIELD: datetime.utcnow(),
                }
            },
        )
        creator[EMBEDDING_FIELD] = vector.tolist()
        creator[EMBEDDING_MODEL_FIELD] = EMBEDDING_MODEL

    return influencers_list


def embed_description(description: str) -> np.ndarray:
    if not description or not description.strip():
        raise ValueError("Brand description cannot be empty")
    return embed_texts([description.strip()])[0]
