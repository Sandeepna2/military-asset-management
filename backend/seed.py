from backend.app import create_app, db
from backend.models import User, Base, Asset, Inventory
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.create_all()

    if not User.query.filter_by(username='admin').first():
        # Create Bases
        base_a = Base(name='Alpha Base', location='Sector 1')
        base_b = Base(name='Bravo Base', location='Sector 2')
        db.session.add(base_a)
        db.session.add(base_b)
        db.session.commit()

        # Create Assets
        m4 = Asset(name='M4 Carbine', type='Weapon', description='Standard issue rifle')
        tank = Asset(name='M1 Abrams', type='Vehicle', description='Main battle tank')
        ammo = Asset(name='5.56mm Rounds', type='Ammunition', description='Standard ammo')
        db.session.add_all([m4, tank, ammo])
        db.session.commit()

        # Create Users
        admin = User(username='admin', password_hash=generate_password_hash('password'), role='Admin')
        cmdr_a = User(username='commander_a', password_hash=generate_password_hash('password'), role='Commander', base_id=base_a.id)
        log_a = User(username='logistics_a', password_hash=generate_password_hash('password'), role='Logistics', base_id=base_a.id)
        
        db.session.add_all([admin, cmdr_a, log_a])
        db.session.commit()
        
        # Initial Inventory
        inv1 = Inventory(base_id=base_a.id, asset_id=m4.id, quantity=100)
        inv2 = Inventory(base_id=base_b.id, asset_id=m4.id, quantity=50)
        db.session.add_all([inv1, inv2])
        db.session.commit()
        
        print("Database seeded successfully!")
    else:
        print("Database already seeded.")
