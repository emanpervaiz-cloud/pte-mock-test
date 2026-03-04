import requests
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("VITE_GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        models = response.json().get("models", [])
        for m in models:
            print(f"- {m.get('name')} ({m.get('displayName')})")
    else:
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
