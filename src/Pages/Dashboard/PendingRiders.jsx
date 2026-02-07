import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaUserClock, FaEye, FaIdCard, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';

const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedRider, setSelectedRider] = useState(null);

    // 1. Fetch Pending Riders
    const { data: pendingRiders = [], isLoading } = useQuery({
        queryKey: ['pendingRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            // Ensure we only show those with 'pending' status
            return res.data.filter(rider => rider.status === 'pending');
        }
    });

    // 2. Approve Mutation (Updates Status to Verified & Role to Rider)
    const approveMutation = useMutation({
        mutationFn: async (rider) => {
            return await axiosSecure.patch(`/riders/${rider._id}`, {
                status: 'verified',
                role: 'rider'
            });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Rider Verified!",
                text: "User role updated to Rider successfully.",
                icon: "success",
                confirmButtonColor: "#003d3d"
            });
            setSelectedRider(null);
            queryClient.invalidateQueries(['pendingRiders']);
            queryClient.invalidateQueries(['approvedRiders']);
        },
        onError: (err) => {
            Swal.fire("Error", err.response?.data?.message || "Failed to approve", "error");
        }
    });

    // 3. Reject Mutation (Deletes record so user can apply again)
    const rejectMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosSecure.delete(`/riders/${id}`);
        },
        onSuccess: () => {
            Swal.fire("Application Rejected", "The record has been cleared.", "success");
            setSelectedRider(null);
            queryClient.invalidateQueries(['pendingRiders']);
        },
        onError: () => {
            Swal.fire("Error", "Could not complete rejection.", "error");
        }
    });

    // --- Handlers ---
    const handleApprove = (rider) => {
        Swal.fire({
            title: "Confirm Approval",
            text: `Authorize ${rider.fullName} as an official rider?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#003d3d",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approve"
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate(rider);
            }
        });
    };

    const handleReject = (rider) => {
        Swal.fire({
            title: "Reject Application?",
            text: "This will delete the application and allow them to apply again later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Yes, Reject",
        }).then((result) => {
            if (result.isConfirmed) {
                rejectMutation.mutate(rider._id);
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-dots loading-lg text-[#003d3d]"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#003d3d]">Pending Riders</h1>
                    <p className="text-gray-500 text-sm">Review and onboard new delivery partners</p>
                </div>
                <div className="bg-[#D4EF70] text-[#003d3d] px-4 py-2 rounded-full text-xs font-black">
                    {pendingRiders.length} NEW APPLICATIONS
                </div>
            </header>

            {pendingRiders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                    <FaUserClock size={60} className="mb-4 opacity-10" />
                    <p className="font-bold">No applications pending at the moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-2">Rider Profile</th>
                                <th className="px-6 py-2">Location</th>
                                <th className="px-6 py-2">Documents</th>
                                <th className="px-6 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRiders.map((rider) => (
                                <tr key={rider._id} className="bg-gray-50/50 hover:bg-gray-100 transition-all group">
                                    <td className="px-6 py-4 rounded-l-2xl">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={rider.riderImage}
                                                className="w-10 h-10 object-cover rounded-xl shadow-sm"
                                                alt={rider.fullName}
                                            />
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
                                            className="text-[10px] font-bold text-[#003d3d] flex items-center gap-1 hover:underline"
                                        >
                                            <FaEye /> VIEW FULL PROFILE
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 rounded-r-2xl text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleApprove(rider)}
                                                title="Approve"
                                                className="p-2 bg-[#D4EF70] text-[#003d3d] rounded-lg hover:scale-110 transition-transform"
                                            >
                                                <FaCheck size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(rider)}
                                                title="Reject"
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            >
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

            {/* --- DOCUMENT & DETAILS MODAL --- */}
            {selectedRider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#003d3d]/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">

                        {/* Modal Header Image */}
                        <div className="relative h-44 bg-[#003d3d]">
                            <img
                                src={selectedRider.riderImage}
                                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                                alt=""
                            />
                            <button
                                onClick={() => setSelectedRider(null)}
                                className="absolute top-6 right-6 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition-all"
                            >
                                <FaTimes size={18} />
                            </button>

                            <div className="absolute -bottom-12 left-10 flex items-end gap-5">
                                <img
                                    src={selectedRider.riderImage}
                                    className="w-32 h-32 object-cover rounded-[2rem] border-4 border-white shadow-xl"
                                    alt="Rider avatar"
                                />
                                <div className="mb-4">
                                    <h2 className="text-2xl font-black text-white drop-shadow-md">{selectedRider.fullName}</h2>
                                    <p className="text-[#D4EF70] text-[10px] font-bold uppercase tracking-widest">Verification Pending</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-16 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <FaIdCard className="text-gray-300 mb-2" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Documents</p>
                                    <p className="text-xs font-bold text-[#003d3d]">NID: {selectedRider.nid}</p>
                                    <p className="text-[10px] text-gray-500">License: {selectedRider.license}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <FaMotorcycle className="text-gray-300 mb-2" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle Info</p>
                                    <p className="text-xs font-bold text-[#003d3d] truncate">{selectedRider.bikeDetails}</p>
                                    <p className="text-[10px] text-gray-500">Reg: {selectedRider.bikeReg}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#D4EF70]/10 rounded-2xl">
                                <FaMapMarkerAlt className="text-[#003d3d]" />
                                <div>
                                    <p className="text-[10px] font-black text-[#003d3d] uppercase opacity-60">Service Region</p>
                                    <p className="text-sm font-bold text-[#003d3d]">{selectedRider.district}, {selectedRider.region}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Self Statement</p>
                                <p className="text-sm text-gray-600 italic leading-relaxed">"{selectedRider.bio}"</p>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => handleApprove(selectedRider)}
                                    className="flex-1 bg-[#003d3d] text-[#D4EF70] font-black py-4 rounded-2xl hover:brightness-110 transition-all"
                                >
                                    Approve Rider
                                </button>
                                <button
                                    onClick={() => handleReject(selectedRider)}
                                    className="px-6 py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRiders;