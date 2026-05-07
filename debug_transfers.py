import requests
import json

BASE_URL = "https://mams-backend-oq0b.onrender.com"

def debug_endpoints():
    session = requests.Session()
    
    # 1. Login
    print("Logging in...")
    resp = session.post(f"{BASE_URL}/api/auth/login", json={"username": "logistics_a", "password": "password"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return

    data = resp.json()
    token = data['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("Login successful.")

    # 2. Get Assets
    print("\nFetching Assets...")
    resp = session.get(f"{BASE_URL}/api/assets/list", headers=headers)
    print(f"Assets Status: {resp.status_code}")
    print(f"Assets Data: {resp.text}")

    # 3. Get Bases
    print("\nFetching Bases...")
    resp = session.get(f"{BASE_URL}/api/assets/bases", headers=headers)
    print(f"Bases Status: {resp.status_code}")
    print(f"Bases Data: {resp.text}")

if __name__ == "__main__":
    debug_endpoints()
