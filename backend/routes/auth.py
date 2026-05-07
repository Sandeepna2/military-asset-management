from flask import Blueprint, request, jsonify
from backend.extensions import db, jwt
from backend.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, role=user.role, username=user.username, base_id=user.base_id), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/register', methods=['POST']) # For initial setup/debugging
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "User exists"}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        password_hash=hashed_pw,
        role=data['role'],
        base_id=data.get('base_id')
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created"}), 201
