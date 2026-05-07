import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, ArrowRightLeft, ClipboardList, LogOut, Shield } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${active
                        ? 'bg-slate-800 text-white border-r-4 border-green-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <Icon className="w-5 h-5 mr-3" />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-slate-900">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Shield className="w-8 h-8 text-green-500 mr-2" />
                    <span className="text-xl font-bold text-white tracking-wider">MAMS</span>
                </div>

                <nav className="flex-1 mt-6">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    {(user?.role === 'Admin' || user?.role === 'Logistics') && (
                        <>
                            <NavItem to="/purchases" icon={ShoppingCart} label="Purchases" />
                            <NavItem to="/transfers" icon={ArrowRightLeft} label="Transfers" />
                        </>
                    )}
                    {(user?.role === 'Admin' || user?.role === 'Commander') && (
                        <NavItem to="/assignments" icon={ClipboardList} label="Assignments" />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
