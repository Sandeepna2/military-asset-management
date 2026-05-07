import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowRightLeft } from 'lucide-react';

const Transfers = () => {
    const [assets, setAssets] = useState([]);
    const [bases, setBases] = useState([]);
    const [formData, setFormData] = useState({
        asset_id: '',
        from_base_id: '',
        to_base_id: '',
        quantity: ''
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

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

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (formData.from_base_id === formData.to_base_id) {
            alert("Source and Destination cannot be the same.");
            return;
        }
        try {
            await api.post('/assets/transfer', formData);
            alert('Transfer successful!');
            setFormData({ asset_id: '', from_base_id: '', to_base_id: '', quantity: '' });
        } catch (e) {
            alert(e.response?.data?.message || 'Error executing transfer');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Logistics Transfer</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8 border-t-4 border-purple-500">
                <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <ArrowRightLeft className="w-5 h-5 mr-2 text-purple-500" />
                    Initiate Movement
                </h2>
                <form onSubmit={handleTransfer} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
                            <select
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                                value={formData.asset_id}
                                onChange={e => setFormData({ ...formData, asset_id: e.target.value })}
                                required
                            >
                                <option value="">Select Asset</option>
                                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Base</label>
                            <select
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                                value={formData.from_base_id}
                                onChange={e => setFormData({ ...formData, from_base_id: e.target.value })}
                                required
                            >
                                <option value="">Select Origin</option>
                                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="hidden md:flex justify-center pt-6">
                            <ArrowRightLeft className="text-slate-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To Base</label>
                            <select
                                className="w-full border-slate-300 rounded-md shadow-sm p-2 bg-slate-50 border"
                                value={formData.to_base_id}
                                onChange={e => setFormData({ ...formData, to_base_id: e.target.value })}
                                required
                            >
                                <option value="">Select Destination</option>
                                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors w-full md:w-auto">
                            Authorize Transfer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Transfers;
