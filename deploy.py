from huggingface_hub import HfApi
import os

# 1. Initialize the API
api = HfApi()

repo_id = "vikasgautam2003/docunexus-backend"
print(f"🚀 Preparing to upload to {repo_id}...")

# 2. Upload with EXPLICIT ignore patterns
# This forces Python to skip these folders, regardless of OS settings
api.upload_folder(
    folder_path=".",
    repo_id=repo_id,
    repo_type="space",
    ignore_patterns=[
        "frontend/**",       # <--- The most important one
        ".git/**",           # Ignore git history
        ".github/**",
        ".vscode/**",
        "data/**",           # Optional: Ignore local data if huge
        "k8s/**",
        "__pycache__/**",
        "*.pyc",
        ".env",              # Never upload .env keys!
        ".venv/**",
        "venv/**"
    ],
    path_in_repo="."
)

print("✅ Upload SUCCESS! Go check your Space now.")