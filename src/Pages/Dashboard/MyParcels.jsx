import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaBox, FaCreditCard, FaParachuteBox, FaRoute, 
    FaCopy, FaEdit, FaTrash, FaInfoCircle
} from 'react-icons/fa';




const MyParcels = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const {
        data: parcels = [],
        isLoading: parcelsLoading,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['parcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        },
        enabled: !authLoading && !!user?.email,
    });

    // Handle Payment Navigation
    const handlePay = (parcel) => {
        if (parcel.status !== 'Pending') {
            Swal.fire({
                title: "Already Processed",
                text: `This parcel is currently ${parcel.status}.`,
                icon: "info",
                confirmButtonColor: "#A3E635"
            });
            return;
        }
        navigate(`/dashboard/payment/${parcel._id}`, {
            state: { price: parcel.totalCost, parcelId: parcel._id }
        });
    };

    // Copy ID to Clipboard
    const copyToClipboard = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            Toast.fire({ icon: 'success', title: 'ID Copied' });
        } catch (error) {
            console.error("Failed to copy!", error);
        }
    };

    // Handle Cancel/Delete
    const handleDelete = (parcel) => {
        const isPaid = parcel.status === 'Paid';
        
        Swal.fire({
            title: "Are you sure?",
            text: isPaid 
                ? "This parcel is PAID. Cancelling will trigger a refund request to the admin." 
                : "You are about to cancel this booking.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, cancel it!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/parcels/${parcel._id}`);
                    if (res.data.deletedCount > 0) {
                        refetch();
                        Swal.fire({
                            title: "Cancelled!",
                            text: isPaid 
                                ? "Booking removed. Your refund is being processed." 
                                : "Your booking has been removed.",
                            icon: "success",
                            confirmButtonColor: "#A3E635"
                        });
                    }
                } catch (error) {
                    Swal.fire(
                        "Error",
                        error.response?.data?.message || "Action failed. The parcel might be in transit.",
                        "error"
                    );
                }
            }
        });
    };

    if (authLoading || parcelsLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-slate-50">
                <span className="loading loading-bars loading-lg text-lime-500"></span>
                <p className="text-slate-500 font-bold animate-pulse">Syncing with logistics...</p>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Dashboard Header */}
                <div className="bg-slate-900 rounded-[2rem] p-6 lg:p-10 mb-10 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            My <span className="text-lime-400">Parcels</span>
                            {isFetching && <span className="loading loading-spinner loading-xs text-lime-400"></span>}
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium">Manage and track your delivery ecosystem</p>
                    </div>
                    <div className="z-10 mt-6 md:mt-0 flex gap-4">
                        <div className="bg-slate-800/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700/50 text-center">
                            <div className="text-2xl font-black text-lime-400">{parcels.length}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Shipments</div>
                        </div>
                    </div>
                </div>

                {parcels.length === 0 ? (
                    <div className="bg-white p-16 lg:p-24 rounded-[3rem] text-center shadow-sm border border-slate-100">
                        <FaParachuteBox className="text-slate-100 text-8xl mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800">No Parcels Found</h3>
                        <p className="text-slate-400 mt-2 mb-8 max-w-xs mx-auto">Your shipping history is empty. Ready to send something?</p>
                        <Link to="/dashboard/book-parcel" className="btn bg-lime-400 hover:bg-lime-500 border-none px-10 rounded-2xl font-black text-slate-900 shadow-lg shadow-lime-400/20 transition-all hover:-translate-y-1">
                            Book Now
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-800 font-black text-left">Parcel Info</th>
                                        <th className="px-6 py-6 text-[10px] uppercase tracking-widest text-slate-800 font-black text-left">Receiver</th>
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-800 font-black text-left">Cost</th>
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-800 font-black text-center">Status</th>
                                        <th className="px-8 py-6 text-center text-[10px] uppercase tracking-widest text-slate-800 font-black ">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {parcels.map((parcel) => (
                                        <tr key={parcel._id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-lime-400 group-hover:text-slate-900 transition-all duration-300">
                                                        <FaBox size={18} />
                                                    </div>
                                                    <div>
                                                         <div className="font-bold text-slate-800 text-sm">{parcel.parcelName}</div>
                                                        <div className="font-bold text-lime-800 text-sm">{parcel.parcelType}</div>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{parcel.receiverName}
                                                     <div onClick={() => copyToClipboard(parcel._id)} className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1 cursor-pointer hover:text-lime-600">
                                                            ID: {parcel._id.slice(-8)} <FaCopy className="text-[8px]" />
                                                        </div>   
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{parcel.receiverPhone}</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-slate-900">{parcel.totalCost} <span className="text-[10px] text-slate-400 uppercase">Tk</span></span>
                                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${parcel.status === 'Paid' ? 'text-lime-600' : 'text-orange-500'}`}>
                                                        {parcel.status === 'Paid' ? 'Payment Verified' : 'Awaiting Payment'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                    parcel.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    parcel.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    parcel.status === 'Paid' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-lime-50 text-lime-600 border-lime-100'
                                                }`}>
                                                    {parcel.status}
                                                </span>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex justify-end items-center gap-2">
                                                    {/* Track Action */}
                                                    <Link to={`/dashboard/track/${parcel._id}`} title="Track Parcel">
                                                        <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:border-lime-400 hover:text-lime-600 transition-all shadow-sm">
                                                            <FaRoute />
                                                        </button>
                                                    </Link>

                                                    {/* Update Action: Only allowed if Pending */}
                                                    <Link to={`/dashboard/update-parcel/${parcel._id}`}>
                                                        <button
                                                            disabled={parcel.status !== 'Pending'}
                                                            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:border-slate-900 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                                                            title="Edit Details"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </Link>

                                                    {/* Delete Action: Allowed if Pending OR Paid */}
                                                    <button
                                                        onClick={() => handleDelete(parcel)}
                                                        disabled={parcel.status !== 'Pending' && parcel.status !== 'Paid'}
                                                        className="p-3 bg-white border border-slate-200 text-red-300 rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                                                        title="Cancel Shipment"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                    {/* Pay Button: Only if Pending */}
                                                    <button
                                                        onClick={() => handlePay(parcel)}
                                                        disabled={parcel.status !== 'Pending'}
                                                        className="ml-2 flex items-center gap-2 px-6 py-3 bg-slate-900 text-lime-400 font-black text-[10px] uppercase rounded-xl hover:bg-black disabled:bg-slate-50 disabled:text-slate-200 transition-all shadow-xl active:scale-95"
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