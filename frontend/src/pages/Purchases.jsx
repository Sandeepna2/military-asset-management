import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus } from 'lucide-react';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]); // In a real app we'd fetch history
    const [assets, setAssets] = useState([]);
    const [bases, setBases] = useState([]);
    const [formData, setFormData] = useState({
        asset_id: '',
        base_id: '',
        quantity: ''
    });

    useEffect(() => {
        fetchMetadata();
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/assets/history?type=PURCHASE');
            setPurchases(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchMetadata = async () => {
        try {
            const [assetsRes, basesRes] = await Promise.all([
                api.get('/assets/list'),
                api.get('/assets/bases')
            ]);
            setAssets(assetsRes.data);
            setBases(basesRes.data);
        } catch (e) { console.error(e); }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assets/purchase', formData);
            alert('Purchase recorded!');
            setFormData({ asset_id: '', base_id: '', quantity: '' });
            fetchHistory(); // Refresh table
        } catch (e) {
            alert('Error recording purchase');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Asset Procurement</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-green-500" />
                    New Purchase Order
                </h2>
                <form onSubmit={handlePurchase} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Base</label>
                        <select
                            className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                            value={formData.base_id}
                            onChange={e => setFormData({ ...formData, base_id: e.target.value })}
                            required
                        >
                            <option value="">Select Base</option>
                            {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
                        <select
                            className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                            value={formData.asset_id}
                            onChange={e => setFormData({ ...formData, asset_id: e.target.value })}
                            required
                        >
                            <option value="">Select Asset</option>
                            {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                            value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            required
                            min="1"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">
                            Submit Order
                        </button>
                    </div>
                </form>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Recent Purchases</h3>
                </div>
                {purchases.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 italic">
                        No recent records found.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Base</th>
                                <th className="px-6 py-3">Quantity</th>
                                <th className="px-6 py-3">Officer</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchases.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-3">{new Date(p.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 font-medium text-slate-900">{p.asset_name}</td>
                                    <td className="px-6 py-3">{p.to_base}</td>
                                    <td className="px-6 py-3 text-green-600 font-bold">+{p.quantity}</td>
                                    <td className="px-6 py-3">{p.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Purchases;
