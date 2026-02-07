import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure'; // Using the secure hook
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaBox, FaUser, FaWallet, FaEdit, FaTrash, 
    FaCreditCard, FaParachuteBox, FaRoute, FaCopy 
} from 'react-icons/fa';

const MyParcels = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    /**
     * Fetching Parcels with TanStack Query
     * - Uses axiosSecure to automatically pass JWT
     * - enabled: Ensures we don't fetch until the user email is available
     */
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

    const handlePay = (parcel) => {
        if (parcel.status !== 'Pending') {
            Swal.fire({ 
                title: "Action Blocked", 
                text: "Only pending parcels require payment.", 
                icon: "info",
                confirmButtonColor: "#A3E635" 
            });
            return;
        }
        navigate(`/dashboard/payment/${parcel._id}`, { 
            state: { price: parcel.totalCost, parcelId: parcel._id } 
        });
    };

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
        Toast.fire({ icon: 'success', title: 'ID Copied to clipboard' });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You can only cancel parcels that are still 'Pending'.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, cancel it!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/parcels/${id}`);
                    if (res.data.deletedCount > 0) {
                        refetch(); // Instantly update the UI
                        Swal.fire({ 
                            title: "Cancelled!", 
                            text: "Your parcel booking has been removed.", 
                            icon: "success", 
                            confirmButtonColor: "#A3E635" 
                        });
                    }
                } catch (error) {
                    Swal.fire("Error", "Could not delete. It might already be processed.", "error");
                }
            }
        });
    };

    // Combine Loading States
    if (authLoading || parcelsLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <span className="loading loading-bars loading-lg text-lime-400"></span>
                <p className="text-slate-500 font-bold animate-pulse">Loading your shipments...</p>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
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
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Shipments</div>
                        </div>
                    </div>
                    {/* Abstract Decoration */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl"></div>
                </div>

                {/* Table Logic */}
                {parcels.length === 0 ? (
                    <div className="bg-white p-16 lg:p-24 rounded-[3rem] text-center shadow-sm border border-slate-100">
                        <FaParachuteBox className="text-slate-100 text-8xl mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800">No Parcels Found</h3>
                        <p className="text-slate-400 mt-2 mb-8 max-w-xs mx-auto">You haven't booked any parcels yet. Start your shipping journey today.</p>
                        <Link to="/dashboard/book-parcel" className="btn bg-lime-400 hover:bg-lime-500 border-none px-10 rounded-2xl font-black text-slate-900 shadow-lg shadow-lime-400/20 transition-all hover:-translate-y-1">
                            Book First Parcel
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-400 font-black text-left">Parcel Info</th>
                                        <th className="px-6 py-6 text-[10px] uppercase tracking-widest text-slate-400 font-black text-left">Receiver</th>
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-400 font-black text-left">Cost</th>
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-400 font-black text-center">Status</th>
                                        <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-400 font-black text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {parcels.map((parcel) => (
                                        <tr key={parcel._id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-lime-400 group-hover:text-slate-900 transition-all duration-300">
                                                        <FaBox size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm">{parcel.parcelName}</div>
                                                        <div onClick={() => copyToClipboard(parcel._id)} className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1 cursor-pointer hover:text-lime-600 transition-colors">
                                                            {parcel._id.slice(-8)} <FaCopy className="text-[8px]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{parcel.receiverName}</span>
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
                                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    parcel.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                    parcel.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
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

                                                    {/* Update Action */}
                                                    <Link to={`/dashboard/update-parcel/${parcel._id}`}>
                                                        <button 
                                                            disabled={parcel.status !== 'Pending'}
                                                            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:border-slate-900 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                                                            title="Edit Booking"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </Link>

                                                    {/* Delete Action */}
                                                    <button 
                                                        onClick={() => handleDelete(parcel._id)}
                                                        disabled={parcel.status !== 'Pending'}
                                                        className="p-3 bg-white border border-slate-200 text-red-300 rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                    {/* Pay Button */}
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