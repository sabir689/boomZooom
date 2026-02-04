import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyParcels = () => {
    const { user, loading } = useAuth();

    const { data: parcels = [], isLoading, error, refetch } = useQuery({
        queryKey: ['parcels', user?.email], 
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/parcels?email=${user?.email}`);
            return res.data;
        },
        enabled: !loading && !!user?.email, 
    });

    // Handle True Delete (Database + UI removal)
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the parcel from your history!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            background: '#fff',
            customClass: { popup: 'rounded-xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Changing to axios.delete and matching the new server route
                    const res = await axios.delete(`http://localhost:5000/parcels/${id}`);
                    
                    if (res.data.deletedCount > 0) {
                        refetch(); // Removes it from the UI immediately
                        Swal.fire({
                            title: "Deleted!",
                            text: "Parcel has been removed.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                } catch (err) {
                    console.error("Delete failed", err);
                    Swal.fire("Error!", "Failed to delete the parcel.", "error");
                }
            }
        });
    };

    if (loading || isLoading) return <p className="p-10 text-center text-xl font-semibold">Loading...</p>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-2">My Parcels ({parcels.length})</h2>
            
            {parcels.length === 0 ? (
                <div className="bg-gray-50 p-10 rounded-lg text-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg italic">No parcels found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                    <table className="min-w-full text-black divide-y divide-gray-200 bg-white text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Receiver</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-700">Cost</th>
                                <th className="px-4 py-3 text-center font-bold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {parcels.map((parcel) => (
                                <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">{parcel.parcelType}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{parcel.receiverName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap font-bold text-blue-600">{parcel.totalCost} TK</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            parcel.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {parcel.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center space-x-2">
                                        
                                        {/* UPDATE BUTTON */}
                                        <Link to={`/dashboard/update-parcel/${parcel._id}`}>
                                            <button 
                                                disabled={parcel.status !== 'Pending'}
                                                className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 disabled:bg-gray-300"
                                            >
                                                Update
                                            </button>
                                        </Link>

                                        {/* DELETE BUTTON */}
                                        <button 
                                            onClick={() => handleDelete(parcel._id)}
                                            disabled={parcel.status !== 'Pending'}
                                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:bg-gray-300"
                                        >
                                            Delete
                                        </button>

                                        {/* PAY BUTTON */}
                                        <Link to={`/dashboard/payment/${parcel._id}`}>
                                            <button 
                                                disabled={parcel.status !== 'Pending'}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-300"
                                            >
                                                Pay
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyParcels;