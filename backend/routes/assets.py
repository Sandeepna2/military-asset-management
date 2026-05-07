from flask import Blueprint, request, jsonify
from backend.extensions import db
from backend.models import Asset, Inventory, Transaction, Base
from backend.utils import role_required
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/list', methods=['GET'])
@role_required(['Admin', 'Commander', 'Logistics'])
def get_assets():
    assets = Asset.query.all()
    return jsonify([{'id': a.id, 'name': a.name, 'type': a.type} for a in assets]), 200

@assets_bp.route('/bases', methods=['GET'])
@role_required(['Admin', 'Logistics']) # Only these roles need to list other bases typically, but maybe Admin/Logistics primarily
def get_bases():
    bases = Base.query.all()
    return jsonify([{'id': b.id, 'name': b.name} for b in bases]), 200

@assets_bp.route('/purchase', methods=['POST'])
@role_required(['Admin', 'Logistics'])
def purchase_asset():
    data = request.get_json()
    # Expect: asset_id, base_id, quantity
    user_id = get_jwt_identity()
    
    asset_id = int(data['asset_id'])
    base_id = int(data['base_id'])
    qty = int(data['quantity'])

    inventory = Inventory.query.filter_by(base_id=base_id, asset_id=asset_id).first()
    if inventory:
        inventory.quantity += qty
    else:
        inventory = Inventory(base_id=base_id, asset_id=asset_id, quantity=qty)
        db.session.add(inventory)
    
    transaction = Transaction(
        type='PURCHASE',
        asset_id=asset_id,
        to_base_id=base_id,
        quantity=qty,
        user_id=int(user_id)
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Purchase recorded"}), 201

@assets_bp.route('/transfer', methods=['POST'])
@role_required(['Admin', 'Logistics'])
def transfer_asset():
    data = request.get_json()
    # Expect: asset_id, from_base_id, to_base_id, quantity
    user_id = get_jwt_identity()
    qty = int(data['quantity'])
    asset_id = int(data['asset_id'])
    from_base_id = int(data['from_base_id'])
    to_base_id = int(data['to_base_id'])

    # Check availability
    from_inv = Inventory.query.filter_by(base_id=from_base_id, asset_id=asset_id).first()
    if not from_inv or from_inv.quantity < qty:
        return jsonify({"message": "Insufficient inventory"}), 400
    
    # Deduct
    from_inv.quantity -= qty
    
    # Add
    to_inv = Inventory.query.filter_by(base_id=to_base_id, asset_id=asset_id).first()
    if to_inv:
        to_inv.quantity += qty
    else:
        to_inv = Inventory(base_id=data['to_base_id'], asset_id=data['asset_id'], quantity=qty)
        db.session.add(to_inv)
    
    transaction = Transaction(
        type='TRANSFER',
        asset_id=asset_id,
        from_base_id=from_base_id,
        to_base_id=to_base_id,
        quantity=qty,
        user_id=int(user_id)
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transfer successful"}), 200

@assets_bp.route('/assignment', methods=['POST'])
@role_required(['Admin', 'Commander'])
def assign_asset():
    data = request.get_json()
    # Expect: asset_id, base_id, quantity, type (ASSIGNMENT or EXPENDITURE), details
    user_id = get_jwt_identity()
    qty = int(data['quantity'])
    
    inv = Inventory.query.filter_by(base_id=data['base_id'], asset_id=data['asset_id']).first()
    if not inv or inv.quantity < qty:
         return jsonify({"message": "Insufficient inventory"}), 400
    
    inv.quantity -= qty # Deduct from main inventory because it's assigned/expended out of storage
    
    transaction = Transaction(
        type=data['type'], # 'ASSIGNMENT' or 'EXPENDITURE'
        asset_id=int(data['asset_id']),
        from_base_id=int(data['base_id']), # Origin is this base
        quantity=qty,
        user_id=int(user_id),
        details=data.get('details')
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": f"{data['type']} recorded"}), 200
@assets_bp.route('/history', methods=['GET'])
@role_required(['Admin', 'Commander', 'Logistics'])
def get_history():
    # Optional filters
    type_filter = request.args.get('type') # e.g., 'PURCHASE'
    base_id = request.args.get('base_id')
    
    query = Transaction.query
    
    if type_filter:
        query = query.filter_by(type=type_filter)
    
    if base_id:
        # Show transactions involved with this base (to or from)
        query = query.filter((Transaction.to_base_id == base_id) | (Transaction.from_base_id == base_id))
        
    # Order by newest first
    transactions = query.order_by(Transaction.timestamp.desc()).limit(20).all()
    
    results = []
    for t in transactions:
        results.append({
            'id': t.id,
            'type': t.type,
            'asset_name': t.asset.name,
            'quantity': t.quantity,
            'from_base': t.from_base.name if t.from_base else None,
            'to_base': t.to_base.name if t.to_base else None,
            'timestamp': t.timestamp.isoformat(),
            'user': t.user.username
        })
        
    return jsonify(results), 200
