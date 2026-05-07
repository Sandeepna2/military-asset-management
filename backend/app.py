from flask import Flask, jsonify
from .extensions import db, jwt, ma, cors
from .routes.auth import auth_bp
from .routes.assets import assets_bp
from .routes.dashboard import dashboard_bp
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
        
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///' + os.path.join(basedir, 'mams.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-military-key' # Change in production
    
    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}}) # Allow all for demo

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    @app.route('/')
    def index():
        return jsonify({
            "message": "MAMS Backend is running.",
            "instructions": "Please access the Frontend at https://military-asset-management-three.vercel.app"
        })

    # Shell context
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'app': app}

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
