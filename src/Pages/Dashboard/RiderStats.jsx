import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { 
    FaMotorcycle, FaStar, FaUserCheck, FaEnvelope, 
    FaPhone, FaSearch, FaExclamationTriangle, FaUserSlash 
} from 'react-icons/fa';

const RiderStats = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Fetching all verified riders
    const { data: riders = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['approvedRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data.filter(rider => rider.status === 'verified');
        }
    });

    // 2. Deactivate Mutation (Changes status to 'deactivated' and role back to 'user')
    const deactivateMutation = useMutation({
        mutationFn: async (rider) => {
            return await axiosSecure.patch(`/riders/${rider._id}`, {
                status: 'deactivated',
                role: 'user' 
            });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Rider Deactivated",
                text: "The rider has been removed from the active fleet.",
                icon: "success",
                confirmButtonColor: "#003d3d"
            });
            // Refresh the list
            queryClient.invalidateQueries(['approvedRiders']);
        },
        onError: () => {
            Swal.fire("Error", "Failed to deactivate rider.", "error");
        }
    });

    const handleDeactivate = (rider) => {
        Swal.fire({
            title: "Deactivate Rider?",
            text: `Revoke delivery access for ${rider.fullName}? they will be demoted to 'user'.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, Deactivate"
        }).then((result) => {
            if (result.isConfirmed) {
                deactivateMutation.mutate(rider);
            }
        });
    };

    // 3. Client-side search logic
    const filteredRiders = riders.filter(rider => 
        rider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
            <h2 className="text-xl font-bold text-[#003d3d]">Failed to load fleet data</h2>
            <button onClick={() => refetch()} className="mt-4 px-6 py-2 bg-[#003d3d] text-white rounded-xl font-bold">Retry</button>
        </div>
    );

    return (
        <div className="p-4 md:p-10 bg-gray-50/50 min-h-screen rounded-[2.5rem]">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-[#003d3d] tracking-tight">Active Rider Fleet</h1>
                    <p className="text-gray-500 mt-2">Manage and monitor your verified delivery partners</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                        <FaUserCheck /> {riders.length} Verified Partners
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search fleet..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4EF70] transition-all outline-none text-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(n => <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)}
                </div>
            ) : filteredRiders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <FaMotorcycle className="text-gray-300 text-5xl mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#003d3d]">No riders matches your search</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRiders.map((rider) => (
                        <RiderCard 
                            key={rider._id} 
                            rider={rider} 
                            onDeactivate={() => handleDeactivate(rider)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const RiderCard = ({ rider, onDeactivate }) => (
    <div className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-300 relative">
        <div className="flex items-center gap-4 mb-8">
            <img 
                src={rider.riderImage || 'https://via.placeholder.com/150'} 
                alt={rider.fullName} 
                className="w-20 h-20 object-cover rounded-[1.5rem] border-2 border-white shadow-md group-hover:border-[#D4EF70]"
            />
            <div>
                <h3 className="font-black text-[#003d3d] text-xl leading-tight">{rider.fullName}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase">{rider.district}, {rider.region}</p>
            </div>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-xl">
                <FaEnvelope className="text-[#003d3d]/30" />
                <span className="truncate">{rider.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-xl">
                <FaPhone className="text-[#003d3d]/30" />
                <span>{rider.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-xl">
                <FaMotorcycle className="text-[#003d3d]/30" />
                <span className="font-bold truncate">{rider.bikeDetails}</span>
            </div>
        </div>

        <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
                <FaStar className="text-yellow-400" />
                <span className="text-base font-black text-[#003d3d]">4.9</span>
            </div>
            {/* --- DEACTIVATE BUTTON --- */}
            <button 
                onClick={onDeactivate}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
                <FaUserSlash /> Deactivate
            </button>
        </div>
    </div>
);

export default RiderStats;