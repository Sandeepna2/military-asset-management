from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from backend.models import User

def role_required(required_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role not in required_roles:
                return {'message': 'Access forbidden: Insufficient permissions'}, 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
