import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const DashboardLayout = () => {

    // You can fetch your data here and map it below
    // const [data, setData] = React.useState(null);

    return (
        <div className="drawer lg:drawer-open bg-base-300">
            {/* The checkbox that controls the drawer state */}
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />

            {/* CONTENT AREA */}
            <div className="drawer-content flex flex-col min-h-screen">

                {/* NAVBAR */}
                <div className="navbar bg-base-100 shadow-sm px-4">
                    {/* MOBILE HAMBURGER BUTTON (Visible only < 1024px) */}
                    <div className="flex-none lg:hidden">
                        <label htmlFor="main-drawer" className=" drawer-button">
                            <svg
                                className="swap-off fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 512 512">
                                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                            </svg>
                        </label>
                    </div>

                    <div className="flex-1 px-2">
                        <h1 className="text-lg font-bold lg:text-xl">Dashboard Overview</h1>
                    </div>

                    {/* TOP RIGHT ACTIONS */}
                    <div className="flex-none   ">
                        <Link to='/sendParcel'> <button className="btn mr-5 btn-sm md:btn-md bg-[#B9FF66] hover:bg-[#a5e65b] border-none text-black">
                            <span className="hidden sm:inline">Send Parcel</span>
                            <span className="sm:hidden">+</span>
                        </button></Link>
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src="https://ui-avatars.com/api/?name=User" alt="avatar" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* MAIN DASHBOARD CONTENT */}
                <main className="p-4 lg:p-8 space-y-6">

                    {/* 1. STATS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* {serverData.stats.map((item) => (...))} */}
                        <div className="stat bg-base-100 rounded-xl shadow-sm">
                            <div className="stat-title text-xs">To Pick</div>
                            <div className="stat-value text-2xl">129</div>
                        </div>
                        <div className="stat bg-base-100 rounded-xl shadow-sm border-l-4 border-lime-400">
                            <div className="stat-title text-xs">Pending</div>
                            <div className="stat-value text-2xl">1,325</div>
                        </div>
                        <div className="stat bg-base-100 rounded-xl shadow-sm">
                            <div className="stat-title text-xs">In Transit</div>
                            <div className="stat-value text-2xl">50</div>
                        </div>
                        <div className="stat bg-base-100 rounded-xl shadow-sm">
                            <div className="stat-title text-xs">Returns</div>
                            <div className="stat-value text-2xl">50</div>
                        </div>
                        <div className="stat bg-base-100 rounded-xl shadow-sm">
                            <div className="stat-title text-xs">Delivered</div>
                            <div className="stat-value text-2xl">50</div>
                        </div>
                    </div>

                    {/* 3. SHIPPING REPORTS TABLE */}
                    <Outlet></Outlet>

                    {/* 4. BOTTOM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        <div className="card bg-base-100 p-6 shadow-sm">
                            <div className="flex justify-between mb-4"><h3 className="font-bold">Late Invoices</h3><button className="btn btn-link btn-xs text-lime-600">View All</button></div>
                            <div className="divide-y">
                                {/* List Items from Server */}
                                <div className="py-3 flex justify-between"><span className="text-sm">INV-10243</span><span className="font-bold">$120.00</span></div>
                            </div>
                        </div>
                        <div className="card bg-base-100 p-6 shadow-sm">
                            <div className="flex justify-between mb-4"><h3 className="font-bold">Shipment Alerts</h3><button className="btn btn-link btn-xs text-lime-600">View All</button></div>
                            <div className="alert bg-red-50 border-none flex items-start gap-2">
                                <span className="text-xl">⚠️</span>
                                <div><h4 className="font-bold text-xs text-red-800">Damaged</h4><p className="text-[10px] text-red-600">Shipment #A23 - 2 hours ago</p></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* SIDEBAR (Drawer) */}
            <div className="drawer-side z-50">
                <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content">
                    {/* Brand */}

                    <Link to='/'> <p className=' p-2 text-center text-white mb-5 border-2 rounded-2xl hover:bg-lime-400 text-2xl font-extrabold  tracking-tight'>
                        ZoomBoom
                    </p></Link>


                    {/* Navigation Items */}
                    {/* Navigation Items */}
                    <li>
                        <NavLink
                            to="/dashboard"
                            end /* 'end' ensures this is only active on /dashboard, not child routes */
                            className={({ isActive }) =>
                                `hover:bg-lime-400 hover:text-black transition-colors ${isActive ? " text-white  font-bold" : ""}`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="myParcels"
                            className={({ isActive }) =>
                                `hover:bg-lime-400 hover:text-black transition-colors ${isActive ? "bg-lime-400 text-black font-semibold" : ""}`
                            }
                        >
                            My Parcel
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/"
                            className="hover:bg-lime-400 hover:text-black transition-colors"
                        >
                            Home
                        </NavLink>
                    </li>

                    <li><a className="hover:bg-lime-400 hover:text-black transition-colors">Drivers</a></li>
                    <li><a className="hover:bg-lime-400 hover:text-black transition-colors">Delivery Men</a></li>

                    <div className="divider text-xs uppercase opacity-40">General</div>

                    <li><a className="hover:bg-lime-400 hover:text-black transition-colors">Settings</a></li>
                    <li><a className="hover:bg-lime-400 hover:text-black transition-colors">Change Password</a></li>
                    <li><a className="hover:bg-lime-400 hover:text-black transition-colors">Help</a></li>
                    <li><a className="hover:bg-red-500 hover:text-white transition-colors">Logout</a></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;