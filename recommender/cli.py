import argparse
import json

from .service import get_recommendations_for_user


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Recommend influencers by brand description.")
    parser.add_argument("--user-id", required=True, help="User id to fetch brand description")
    parser.add_argument("--budget", type=float, default=None, help="Optional budget filter")
    parser.add_argument("--top-k", type=int, default=5, help="Number of influencers to return")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    results = get_recommendations_for_user(args.user_id, budget=args.budget, top_k=args.top_k)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()

