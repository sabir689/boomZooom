import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaUserClock, FaEye, FaIdCard, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';

const PendingRiders = () => {
    const [pendingRiders, setPendingRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRider, setSelectedRider] = useState(null); // State for Modal
    const axiosSecure = useAxiosSecure();

    const fetchPendingRiders = async () => {
        try {
            const res = await axiosSecure.get('/riders');
            const pending = res.data.filter(rider => rider.status === 'pending');
            setPendingRiders(pending);
        } catch (error) {
            console.error("Error fetching riders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRiders();
    }, []);

    const handleApprove = (rider) => {
        Swal.fire({
            title: "Approve Rider?",
            text: `Are you sure you want to approve ${rider.fullName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D4EF70",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approve!",
            color: "#003d3d"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/riders/${rider._id}`, {
                        status: 'verified',
                        role: 'rider'
                    });

                    if (res.data.modifiedCount > 0) {
                        Swal.fire("Success!", "The rider is now active.", "success");
                        setSelectedRider(null); // Close modal if open
                        fetchPendingRiders();
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

    if (loading) return <div className="p-10 text-center font-bold">Loading Applications...</div>;

    return (
        <div className="p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-screen relative">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#003d3d]">Pending Riders</h1>
                    <p className="text-gray-500 text-sm">Review and verify new rider applications</p>
                </div>
                <div className="bg-[#D4EF70]/20 text-[#003d3d] px-4 py-2 rounded-full text-xs font-black uppercase">
                    {pendingRiders.length} Applications
                </div>
            </header>

            {pendingRiders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FaUserClock size={50} className="mb-4 opacity-20" />
                    <p className="font-medium">No pending applications at the moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">Rider Info</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Documents</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRiders.map((rider) => (
                                <tr key={rider._id} className="bg-gray-50/50 hover:bg-gray-50 transition-colors rounded-2xl">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#D4EF70] rounded-xl flex items-center justify-center font-black text-[#003d3d]">
                                                {rider.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#003d3d]">{rider.fullName}</p>
                                                <p className="text-[10px] text-gray-400">{rider.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold">{rider.district}</p>
                                        <p className="text-[10px] text-gray-400">{rider.region}</p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedRider(rider)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-[#003d3d] text-[10px] font-bold rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <FaEye /> View Documents
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleApprove(rider)}
                                                className="p-2 bg-[#D4EF70] text-[#003d3d] rounded-lg hover:scale-110 transition-transform shadow-sm"
                                            >
                                                <FaCheck size={14} />
                                            </button>
                                            <button className="p-2 bg-red-100 text-red-500 rounded-lg hover:scale-110 transition-transform shadow-sm">
                                                <FaTimes size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- DOCUMENT MODAL --- */}
            {selectedRider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#003d3d] p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#D4EF70] rounded-2xl flex items-center justify-center font-black text-[#003d3d] text-xl">
                                    {selectedRider.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold leading-tight">{selectedRider.fullName}</h2>
                                    <p className="text-[#D4EF70] text-xs font-medium uppercase tracking-widest">Rider Application</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedRider(null)} className="text-white/50 hover:text-white transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Side: Personal & ID */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-100 rounded-xl text-gray-500"><FaIdCard size={20} /></div>
                                        <div>
                                            <img className="w-16
                                             object-cover  border-2 border-[#D4EF70] shadow-xl" src={selectedRider.riderImage} alt="" />
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Identification</p>
                                            <p className="text-sm font-bold text-[#003d3d]">NID: {selectedRider.nid}</p>
                                            <p className="text-sm font-bold text-[#003d3d]">License: {selectedRider.license}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-100 rounded-xl text-gray-500"><FaMapMarkerAlt size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Contact & Location</p>
                                            <p className="text-sm font-bold text-[#003d3d]">{selectedRider.phone}</p>
                                            <p className="text-sm text-gray-600">{selectedRider.district}, {selectedRider.region}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Bike Details */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-100 rounded-xl text-gray-500"><FaMotorcycle size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle Details</p>
                                            <p className="text-sm font-bold text-[#003d3d]">{selectedRider.bikeDetails}</p>
                                            <p className="text-sm text-gray-600">Reg: {selectedRider.bikeReg}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Professional Bio</p>
                                <p className="text-sm text-gray-700 leading-relaxed italic">"{selectedRider.bio}"</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => handleApprove(selectedRider)}
                                className="flex-1 bg-[#D4EF70] text-[#003d3d] font-bold py-3 rounded-xl hover:bg-[#c5e45a] transition-all shadow-lg shadow-[#D4EF70]/20"
                            >
                                Approve Application
                            </button>
                            <button className="px-6 py-3 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-all">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRiders;