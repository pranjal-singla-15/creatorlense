import numpy as np

from recommender.search import rank_influencers
from recommender import _format_output


def test_rank_influencers_respects_budget_and_order():
    brand = np.array([0.8, 0.6])

    influencers = [
        {"_id": 1, "embedding": [0.8, 0.6], "estimated_cost": 200},
        {"_id": 2, "embedding": [0.9, 0.1], "estimated_cost": 1200},
        {"_id": 3, "embedding": [0.1, 0.9], "estimated_cost": 300},
    ]

    ranked = rank_influencers(brand, influencers, budget=500, top_k=5)

    assert [item["_id"] for item in ranked] == [1, 3]


def test_rank_influencers_handles_empty_embeddings():
    brand = np.array([1.0, 0.0])
    influencers = [{"_id": 1, "embedding": []}, {"_id": 2, "embedding": [1.0, 0.0]}]

    ranked = rank_influencers(brand, influencers, budget=None, top_k=5)

    assert len(ranked) == 1
    assert ranked[0]["_id"] == 2


def test_instagram_handle_extraction_from_url():
    creator = {
        "instagram": "https://www.instagram.com/abhishekkarofficial/",
        "similarity_score": 0.9,
        "estimated_cost": 100000,
    }

    formatted = _format_output(creator)

    assert formatted["Instagram handle"] == "abhishekkarofficial"
