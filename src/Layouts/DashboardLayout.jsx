import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import {
    LayoutDashboard,
    Package,
    History,
    Truck,
    Users,
    Settings,
    Lock,
    HelpCircle,
    LogOut,
    PlusCircle,
    Bell,
    AlertTriangle,
    Bike, 
    Activity
} from 'lucide-react';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open bg-base-300">
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />

            {/* CONTENT AREA */}
            <div className="drawer-content flex flex-col min-h-screen">

                {/* NAVBAR */}
                <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>

                    <div className="flex-1 px-2">
                        <h1 className="text-lg font-bold lg:text-xl text-slate-700">Dashboard Overview</h1>
                    </div>

                    {/* TOP RIGHT ACTIONS */}
                    <div className="flex-none gap-2">
                        <Link to='/sendParcel'>
                            <button className="btn btn-sm md:btn-md bg-[#B9FF66] hover:bg-[#a5e65b] border-none text-black gap-2">
                                <PlusCircle size={18} />
                                <span className="hidden sm:inline">Send Parcel</span>
                            </button>
                        </Link>

                        <button className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <Bell size={20} />
                                <span className="badge badge-xs badge-primary indicator-item"></span>
                            </div>
                        </button>

                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar online">
                                <div className="w-10 rounded-full ring ring-lime-400 ring-offset-base-100 ring-offset-2">
                                    <img src="https://ui-avatars.com/api/?name=User&background=random" alt="avatar" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li><a>Profile</a></li>
                                <li><a>Settings</a></li>
                                <li><a className="text-red-500">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* MAIN DASHBOARD CONTENT */}
                <main className="p-4 lg:p-8 space-y-6">

                    {/* 1. STATS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard title="To Pick" value="129" color="border-lime-400" />
                        <StatCard title="Pending" value="1,325" color="border-lime-400" />
                        <StatCard title="In Transit" value="50" color="border-lime-400" />
                        <StatCard title="Returns" value="12" color="border-lime-400" />
                        <StatCard title="Delivered" value="2,450" color="border-lime-400" />
                    </div>

                    {/* 3. DYNAMIC CONTENT */}
                    <div className="bg-base-100 rounded-2xl shadow-sm min-h-[400px]">
                        <Outlet />
                    </div>

                    {/* 4. BOTTOM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        <div className="card bg-base-100 p-6 shadow-sm border border-base-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <History size={18} className="text-slate-500" /> Late Invoices
                                </h3>
                                <button className="btn btn-link btn-xs text-lime-600 no-underline">View All</button>
                            </div>
                            <div className="divide-y divide-base-200">
                                <InvoiceItem id="INV-10243" price="$120.00" />
                                <InvoiceItem id="INV-10244" price="$85.50" />
                            </div>
                        </div>

                        <div className="card bg-base-100 p-6 shadow-sm border border-base-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-red-500" /> Shipment Alerts
                                </h3>
                                <button className="btn btn-link btn-xs text-lime-600 no-underline">View All</button>
                            </div>
                            <div className="alert bg-red-50 border-none flex items-start gap-3">
                                <AlertTriangle className="text-red-600" size={24} />
                                <div>
                                    <h4 className="font-bold text-sm text-red-800">Damaged Package</h4>
                                    <p className="text-xs text-red-600">Shipment #A23 - Reported 2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* SIDEBAR (Drawer) */}
            <div className="drawer-side z-50">
                <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex flex-col w-72 min-h-full bg-slate-900 text-slate-300 p-4">

                    {/* Brand */}
                    <Link to='/' className="flex items-center justify-center gap-2 px-2 mb-8 mt-4">
                        <div className="bg-[#B9FF66] p-1.5 rounded-lg text-black">
                            <Package size={24} strokeWidth={3} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">ZoomBoom</span>
                    </Link>

                    {/* Navigation Items */}
                    <ul className="menu menu-md gap-1 p-0">
                        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" end />
                        <NavItem to="myParcels" icon={<Package size={20} />} label="My Parcel" />
                        <NavItem to="/dashboard/payment-history" icon={<History size={20} />} label="Payment History" />
                        <NavItem to="/beARider" icon={<Truck size={20} />} label="BE  A Rider" />
                        <NavItem to="/dashboard/delivery-men" icon={<Users size={20} />} label="Delivery Men" />

                        <div className="divider opacity-20 my-4">General</div>

                        <NavItem to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                        <NavItem to="/dashboard/rider-statistics" icon={<Bike size={20} />} label="Rider Stats" />
                        <NavItem to="/dashboard/pendingRiders" icon={<Activity size={20} />} label="Application Status" />
                        <NavItem to="/dashboard/password" icon={<Lock size={20} />} label="Password" />
                        <NavItem to="/dashboard/help" icon={<HelpCircle size={20} />} label="Help Center" />

                        <li className="mt-4">
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400">
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components for Cleanliness ---

const NavItem = ({ to, icon, label, end = false }) => (
    <li>
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? "bg-[#B9FF66] text-black font-bold shadow-lg shadow-lime-400/10"
                    : "hover:bg-slate-800 hover:text-white"
                }`
            }
        >
            {icon}
            <span className="font-medium">{label}</span>
        </NavLink>
    </li>
);

const StatCard = ({ title, value, color }) => (
    <div className={`stat bg-base-100 rounded-xl shadow-sm border-l-4 ${color}`}>
        <div className="stat-title text-xs font-semibold uppercase tracking-wider">{title}</div>
        <div className="stat-value text-2xl text-slate-700">{value}</div>
    </div>
);

const InvoiceItem = ({ id, price }) => (
    <div className="py-3 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">{id}</span>
        <span className="font-bold text-slate-800">{price}</span>
    </div>
);

export default DashboardLayout;