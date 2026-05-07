import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def crash_it():
    session = requests.Session()
    
    # 1. Login
    print("Logging in...")
    resp = session.post(f"{BASE_URL}/api/auth/login", json={"username": "logistics_a", "password": "password"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return

    token = resp.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("Login successful.")

    # 2. Transfer
    payload = {
        "asset_id": "1", # Intentionally strings because React state uses strings
        "quantity": "1",
        "from_base_id": "1",
        "to_base_id": "2"
    }
    print("Sending Transfer...")
    resp = session.post(f"{BASE_URL}/api/assets/transfer", json=payload, headers=headers)
    print(f"Transfer Status: {resp.status_code}")
    print(f"Transfer Response: {resp.text}")

if __name__ == "__main__":
    crash_it()
