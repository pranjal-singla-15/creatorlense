from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional

import numpy as np


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    if a.size == 0 or b.size == 0:
        return 0.0
    return float(np.dot(a, b))


def _coerce_cost(value: Any) -> Optional[float]:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def rank_influencers(
    brand_embedding: np.ndarray,
    influencers: Iterable[Dict[str, Any]],
    budget: Optional[float] = None,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    scored = []
    budget_value = _coerce_cost(budget)

    for creator in influencers:
        cost = _coerce_cost(creator.get("estimated_cost"))
        if budget_value is not None and cost is not None and cost > budget_value:
            continue

        embedding = np.array(creator.get("embedding") or [], dtype=float)
        if embedding.size == 0:
            continue

        score = cosine_similarity(brand_embedding, embedding)
        scored.append((score, creator))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [
        {"similarity_score": score, **creator}
        for score, creator in scored[: max(top_k, 0)]
    ]

