import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // 1. Import Secure Hook
import { FaHistory, FaCheckCircle, FaHashtag, FaEnvelope, FaBox, FaCreditCard, FaClock, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";


const PaymentHistory = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure(); // 2. Initialize Secure Instance

    const { data: payments = [], isLoading, isError, error } = useQuery({
        queryKey: ["payments", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            // 3. Use axiosSecure (baseURL is already handled in the hook)
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        },
    });

    // Loading State
    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <span className="loading loading-ring loading-lg text-lime-400"></span>
        </div>
    );

    // Error State
    if (isError) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
            <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Connection Error</h2>
            <p className="text-slate-500">{error?.message || "Could not fetch payment history."}</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Card */}
                <div className="bg-slate-900 rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center shadow-2xl border border-slate-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-white flex items-center gap-3">
                            Finance <span className="text-lime-400">Hub</span>
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium">Transaction logs & payment reconciliations</p>
                    </div>
                    <div className="mt-6 md:mt-0 text-right relative z-10">
                        <div className="text-4xl font-black text-lime-400">{payments.length}</div>
                        <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total Transactions</div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl"></div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 text-left">Transaction Details</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 text-left">Associated Parcel</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 text-left">Payment Info</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 text-left">Date & Time</th>
                                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment._id} className="group hover:bg-slate-50/80 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-lime-400 shadow-lg shadow-slate-900/20">
                                                        <FaHashtag />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800 font-mono italic">
                                                            {payment.transactionId?.substring(0, 12)}...
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Stripe Intent ID</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                        <FaBox className="text-slate-400 text-xs" /> 
                                                        {payment.parcelId?.slice(-8) || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                        <FaEnvelope className="text-[10px]" /> {payment.email}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-slate-900">{payment.price} <span className="text-[10px] text-slate-400 uppercase">TK</span></span>
                                                    <span className="text-[10px] font-extrabold text-blue-500 flex items-center gap-1 uppercase">
                                                        <FaCreditCard /> VISA • Card
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {new Date(payment.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                        <FaClock className="text-lime-500" />
                                                        {new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-right">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-lime-400 text-slate-900 font-black text-[10px] uppercase shadow-md shadow-lime-400/20 active:scale-95 transition-transform cursor-default">
                                                    <FaCheckCircle className="text-sm" />
                                                    Verified
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-2xl">
                                                    <FaHistory />
                                                </div>
                                                <p className="text-slate-500 font-bold">No transactions found yet.</p>
                                                <p className="text-slate-400 text-sm">Your payment history will appear here after your first delivery.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Secure Financial Record</p>
                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;