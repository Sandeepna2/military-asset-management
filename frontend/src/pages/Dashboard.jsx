import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Truck, ArrowUpRight, TrendingUp, X } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext); // Destructure logout
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [showNetModal, setShowNetModal] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        setError(null);
        try {
            const params = {};
            if (user.role !== 'Admin') {
                params.base_id = user.base_id;
            }
            const res = await api.get('/dashboard/stats', { params });
            setStats(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load dashboard data. Please try logging out and back in.");
            if (err.response && (err.response.status === 401 || err.response.status === 422)) {
                // Optional: Auto logout could go here
            }
        }
    };

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Sign Out & Retry
                </button>
            </div>
        );
    }

    if (!stats) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading tactical data...</div>;

    const cards = [
        { title: 'Opening Balance', value: stats.opening_balance, icon: Package, color: 'bg-blue-500' },
        { title: 'Net Movement', value: stats.net_movement, icon: TrendingUp, color: 'bg-purple-500', onClick: () => setShowNetModal(true) },
        { title: 'Closing Balance', value: stats.closing_balance, icon: Package, color: 'bg-green-500' },
        { title: 'Assigned / Expended', value: stats.assigned + stats.expended, icon: ArrowUpRight, color: 'bg-orange-500' },
    ];

    // Mock data for charts - in real app, fetch historical series
    const data = [
        { name: 'Jan', purchases: 40, transfers: 24, amt: 2400 },
        { name: 'Feb', purchases: 30, transfers: 13, amt: 2210 },
        { name: 'Mar', purchases: 20, transfers: 98, amt: 2290 },
        { name: 'Apr', purchases: 27, transfers: 39, amt: 2000 },
        { name: 'May', purchases: 18, transfers: 48, amt: 2181 },
        { name: 'Jun', purchases: 23, transfers: 38, amt: 2500 },
        { name: 'Jul', purchases: 34, transfers: 43, amt: 2100 },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Command Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`bg-white rounded-lg shadow p-6 border-l-4 ${card.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                        style={{ borderLeftColor: card.color.replace('bg-', '') }} // Hack for dynamic border color, better use specific classes
                        onClick={card.onClick}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{card.title}</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-full ${card.color} bg-opacity-10`}>
                                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        {card.onClick && <p className="text-xs text-blue-500 mt-2 font-semibold">View Details &rarr;</p>}
                    </div>
                ))}
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Movement Trends</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
                                <Bar dataKey="transfers" fill="#8b5cf6" name="Transfers" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Asset Usage</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showNetModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Net Movement Breakdown</h3>
                            <button
                                onClick={() => setShowNetModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                <span className="font-medium text-blue-900">Purchases</span>
                                <span className="font-bold text-blue-700">+{stats.purchases}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                <span className="font-medium text-purple-900">Transfers In</span>
                                <span className="font-bold text-purple-700">+{stats.transfers_in}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                <span className="font-medium text-red-900">Transfers Out</span>
                                <span className="font-bold text-red-700">-{stats.transfers_out}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-slate-800">Net Total</span>
                                <span className={`font-bold ${stats.net_movement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.net_movement > 0 ? '+' : ''}{stats.net_movement}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
