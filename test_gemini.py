import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("VITE_GEMINI_API_KEY")
print(f"Testing Gemini Key: {api_key[:10]}...")

url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Evaluate this PTE writing for grammar and spelling. Response: 'the discovery of alagzamber 1989'. Return JSON."
        }]
    }]
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response received successfully!")
        print(response.json())
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
