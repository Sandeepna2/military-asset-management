import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList } from 'lucide-react';

const Assignments = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [bases, setBases] = useState([]);
    const [formData, setFormData] = useState({
        asset_id: '',
        base_id: user.base_id || '',
        quantity: '',
        type: 'ASSIGNMENT', // or EXPENDITURE
        details: ''
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const assetsRes = await api.get('/assets/list');
            setAssets(assetsRes.data);
            if (user.role === 'Admin') {
                const basesRes = await api.get('/assets/bases');
                setBases(basesRes.data);
            }
        } catch (e) { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assets/assignment', formData);
            alert(`${formData.type} recorded!`);
            setFormData({ ...formData, quantity: '', details: '' });
        } catch (e) {
            alert(e.response?.data?.message || 'Error processing request');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Personnel Assignment & Expenditure</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2 text-orange-500" />
                    Action Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Action Type</label>
                            <div className="flex space-x-4 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.type === 'ASSIGNMENT'}
                                        onChange={() => setFormData({ ...formData, type: 'ASSIGNMENT' })}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span>Assign to Personnel</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.type === 'EXPENDITURE'}
                                        onChange={() => setFormData({ ...formData, type: 'EXPENDITURE' })}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span>Mark as Expended</span>
                                </label>
                            </div>
                        </div>
                        {user.role === 'Admin' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Base</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.base_id}
                                    onChange={e => setFormData({ ...formData, base_id: e.target.value })}
                                >
                                    <option value="">Select Base</option>
                                    {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
                            <select
                                className="w-full border p-2 rounded"
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
                                className="w-full border p-2 rounded"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {formData.type === 'ASSIGNMENT' ? 'Assign To (Name/ID)' : 'Reason/Details'}
                        </label>
                        <textarea
                            className="w-full border p-2 rounded h-24"
                            value={formData.details}
                            onChange={e => setFormData({ ...formData, details: e.target.value })}
                            placeholder={formData.type === 'ASSIGNMENT' ? 'e.g., PVT John Doe (ID: 554-22)' : 'e.g., Training Exercise Alpha'}
                            required
                        />
                    </div>

                    <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors">
                        Confirm Action
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Assignments;
