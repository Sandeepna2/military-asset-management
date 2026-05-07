import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_login_and_dashboard():
    # 1. Login
    print("Attempting to login...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"username": "commander_a", "password": "password"})
        print(f"Login Status: {resp.status_code}")
        if resp.status_code != 200:
            print("Login failed:", resp.text)
            return
        
        data = resp.json()
        token = data['access_token']
        base_id = data.get('base_id')
        print(f"Login success. Token obtained. Base ID: {base_id}")
        
        # 2. Get Dashboard Stats
        print("Fetching dashboard stats...")
        headers = {"Authorization": f"Bearer {token}"}
        params = {"base_id": base_id}
        resp = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers, params=params)
        
        print(f"Dashboard Status: {resp.status_code}")
        print("Response:", resp.text)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_login_and_dashboard()
