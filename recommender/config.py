import os

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("MONGODB_DB", "creatorlense")
INFLUENCER_COLLECTION = os.getenv("INFLUENCER_COLLECTION", "Influencer_dataset")
USERS_COLLECTION = os.getenv("USERS_COLLECTION", "users")
HF_TOKEN = os.getenv("HF_TOKEN", "")

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_FIELD = "embedding"
EMBEDDING_MODEL_FIELD = "embedding_model"
EMBEDDING_UPDATED_AT_FIELD = "embedding_updated_at"
