import requests

BASE_URL = "https://mams-backend-oq0b.onrender.com"

def test_login():
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login Successful! Database is seeded.")
        else:
            print("❌ Login Failed. Database might not be seeded or creds are wrong.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
