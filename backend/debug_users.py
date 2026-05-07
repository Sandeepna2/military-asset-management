from backend.app import create_app, db
from backend.models import User

app = create_app()

with app.app_context():
    users = User.query.all()
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"ID: {u.id} | User: {u.username} | Role: {u.role} | PwdHash: {u.password_hash[:20]}...")
