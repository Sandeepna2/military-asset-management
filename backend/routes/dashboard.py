from flask import Blueprint, request, jsonify
from backend.extensions import db
from backend.models import Inventory, Transaction, Asset, Base
from backend.utils import role_required
from sqlalchemy import func, case

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@role_required(['Admin', 'Commander', 'Logistics'])
def get_stats():
    base_id = request.args.get('base_id')
    asset_type = request.args.get('type')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # Basic Inventory Query (Closing Balance)
    inv_query = db.session.query(
        func.sum(Inventory.quantity).label('closing_balance')
    )

    if base_id:
        inv_query = inv_query.filter(Inventory.base_id == base_id)
    
    if asset_type:
        inv_query = inv_query.join(Asset).filter(Asset.type == asset_type)

    closing_balance = inv_query.scalar() or 0

    # Net Movement Query
    filters = []
    if start_date:
        filters.append(Transaction.timestamp >= start_date)
    if end_date:
        filters.append(Transaction.timestamp <= end_date)
    if asset_type:
        # Optimization: Join if performance needed
        pass

    query = Transaction.query
    if asset_type:
            query = query.join(Asset).filter(Asset.type == asset_type)

    for f in filters:
        query = query.filter(f)
    
    transactions = query.all()
    
    purchases = 0
    transfers_in = 0
    transfers_out = 0
    assigned = 0
    expended = 0

    for t in transactions:
        if base_id:
            bid = int(base_id)
            if t.type == 'PURCHASE' and t.to_base_id == bid:
                purchases += t.quantity
            elif t.type == 'TRANSFER':
                if t.to_base_id == bid:
                    transfers_in += t.quantity
                if t.from_base_id == bid:
                    transfers_out += t.quantity
            elif t.type == 'ASSIGNMENT' and t.from_base_id == bid:
                    assigned += t.quantity
            elif t.type == 'EXPENDITURE' and t.from_base_id == bid:
                    expended += t.quantity
        else:
            # Aggregate global
            if t.type == 'PURCHASE': purchases += t.quantity
            if t.type == 'TRANSFER': 
                transfers_in += t.quantity 
                transfers_out += t.quantity
            if t.type == 'ASSIGNMENT': assigned += t.quantity
            if t.type == 'EXPENDITURE': expended += t.quantity

    net_movement = purchases + transfers_in - transfers_out
    
    opening_balance = closing_balance - net_movement + assigned + expended

    return jsonify({
        'opening_balance': opening_balance,
        'closing_balance': closing_balance,
        'net_movement': net_movement,
        'purchases': purchases,
        'transfers_in': transfers_in,
        'transfers_out': transfers_out,
        'assigned': assigned,
        'expended': expended
    }), 200
