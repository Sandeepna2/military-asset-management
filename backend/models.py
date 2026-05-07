from .extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'Admin', 'Commander', 'Logistics'
    base_id = db.Column(db.Integer, db.ForeignKey('base.id'), nullable=True)

class Base(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(200))

class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False) # 'Weapon', 'Vehicle', 'Ammunition'
    description = db.Column(db.String(255))
    
    # Relationships
    inventory_items = db.relationship('Inventory', backref='asset', lazy=True)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    base_id = db.Column(db.Integer, db.ForeignKey('base.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    quantity = db.Column(db.Integer, default=0)

    base = db.relationship('Base', backref=db.backref('inventory', lazy=True))

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False) # 'PURCHASE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ASSIGNMENT', 'EXPENDITURE'
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    to_base_id = db.Column(db.Integer, db.ForeignKey('base.id'), nullable=True) # For transfers/purchases
    from_base_id = db.Column(db.Integer, db.ForeignKey('base.id'), nullable=True) # For transfers
    quantity = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    details = db.Column(db.String(255)) # Extra info like 'Assigned to Pvt Ryan'

    asset = db.relationship('Asset')
    user = db.relationship('User')
    to_base = db.relationship('Base', foreign_keys=[to_base_id])
    from_base = db.relationship('Base', foreign_keys=[from_base_id])
