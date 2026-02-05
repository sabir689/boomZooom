import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaBox, FaUser, FaWallet, FaEdit, FaTrash, 
    FaCreditCard, FaParachuteBox, FaRoute, FaCopy 
} from 'react-icons/fa';

const MyParcels = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['parcels', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/parcels?email=${user?.email}`);
            return res.data;
        },
        enabled: !loading && !!user?.email,
    });

    const handlePay = (parcel) => {
        if (parcel.status !== 'Pending') {
            Swal.fire({ title: "Action Blocked", text: "Only pending parcels require payment.", icon: "info" });
            return;
        }
        navigate(`/dashboard/payment/${parcel._id}`, { state: { price: parcel.totalCost } });
    };

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        Swal.fire({ title: "ID Copied!", icon: "success", timer: 800, showConfirmButton: false });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Parcel?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.delete(`http://localhost:5000/parcels/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire({ title: "Removed", icon: "success", timer: 1000, showConfirmButton: false });
                }
            }
        });
    };

    if (loading || isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-bars loading-lg text-lime-400"></span>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Modern Header Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden border border-slate-800">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 justify-center md:justify-start">
                            My <span className="text-lime-400">Parcels</span>
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium">Manage, track, and secure your deliveries</p>
                    </div>
                    <div className="z-10 mt-6 md:mt-0 flex gap-4">
                        <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 text-center">
                            <div className="text-2xl font-black text-lime-400">{parcels.length}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Shipments</div>
                        </div>
                    </div>
                    <div className="absolute -left-10 -top-10 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Table */}
                {parcels.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center shadow-xl border border-slate-100">
                        <FaParachuteBox className="text-slate-200 text-7xl mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800">No Parcels Yet</h3>
                        <p className="text-slate-400 mt-2 mb-6">Ready to ship something? Start your first booking.</p>
                        <Link to="/dashboard/book-parcel" className="btn bg-lime-400 border-none px-8 rounded-xl font-bold">Book Now</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] text-lime-500 font-extrabold text-left">Parcel Details</th>
                                        <th className="px- py-6 text-[11px] uppercase tracking-[0.2em] text-lime-500 font-extrabold text-left">Receiver</th>
                                        <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] text-lime-500 font-extrabold text-left">Costing</th>
                                        <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] text-lime-500 font-extrabold text-center">Status</th>
                                        <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] text-lime-500 font-extrabold  text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {parcels.map((parcel) => (
                                        <tr key={parcel._id} className="hover:bg-slate-50/50 transition-all group">
                                            {/* Details */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-lime-400 group-hover:text-slate-900 transition-colors">
                                                        <FaBox />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 text-sm">{parcel.parcelName}</div>
                                                        <div onClick={() => copyToClipboard(parcel._id)} className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 cursor-pointer hover:text-blue-500">
                                                            ID: {parcel._id.slice(-6)}... <FaCopy />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Receiver */}
                                            <td className="px-2 py-6 text-left">
                                                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                    <FaUser className="text-slate-300 text-xs" />
                                                    {parcel.receiverName}
                                                </div>
                                            </td>

                                            {/* Cost */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-slate-900">{parcel.totalCost} <span className="text-[10px] text-slate-400">TK</span></span>
                                                    <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                                        <FaWallet className="text-[8px]" /> {parcel.status === 'Paid' ? 'Paid Online' : 'Payable'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-2 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    parcel.status === 'Pending'
                                                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                        : 'bg-lime-50 text-lime-600 border-lime-200'
                                                }`}>
                                                    {parcel.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end items-center gap-2">
                                                    
                                                    {/* Track Action - Only active if Paid/Processed */}
                                                    <Link to={`/dashboard/track/${parcel._id}`}>
                                                        <button 
                                                            className="p-3 bg-white border border-slate-200 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                            title="Track Status"
                                                        >
                                                            <FaRoute />
                                                        </button>
                                                    </Link>

                                                    <Link to={`/dashboard/update-parcel/${parcel._id}`}>
                                                        <button 
                                                            disabled={parcel.status !== 'Pending'}
                                                            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                                            title="Edit Booking"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </Link>

                                                    <button 
                                                        onClick={() => handleDelete(parcel._id)}
                                                        disabled={parcel.status !== 'Pending'}
                                                        className="p-3 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                    <button 
                                                        onClick={() => handlePay(parcel)}
                                                        disabled={parcel.status !== 'Pending'}
                                                        className="flex items-center gap-2 px-5 py-3 bg-lime-400 text-slate-900 font-black text-xs uppercase rounded-xl hover:bg-lime-500 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-lime-400/20 active:scale-95"
                                                    >
                                                        <FaCreditCard /> Pay
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyParcels;