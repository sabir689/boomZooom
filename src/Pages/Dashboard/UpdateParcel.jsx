import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { FaBox, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaWeightHanging, FaArrowLeft } from 'react-icons/fa';

const UpdateParcel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, reset } = useForm();

    const { data: parcel, isLoading } = useQuery({
        queryKey: ['parcel', id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/parcels/${id}`);
            return res.data;
        }
    });

    const weight = watch("parcelWeight");
    useEffect(() => {
        if (weight) {
            const calculatedPrice = weight <= 1 ? 50 : weight <= 2 ? 100 : 150;
            setValue("totalCost", calculatedPrice);
        }
    }, [weight, setValue]);

    useEffect(() => {
        if (parcel) reset(parcel);
    }, [parcel, reset]);

    const onSubmit = async (data) => {
        try {
            const { _id, userEmail, userName, ...updatedDoc } = data;
            const res = await axios.patch(`http://localhost:5000/parcels/${id}`, updatedDoc);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Updated!",
                    text: "Parcel details have been synchronized.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate("/dashboard/myParcels");
            } else {
                Swal.fire("No Changes", "The information is already up to date.", "info");
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong on our end.", "error");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium"
                >
                    <FaArrowLeft /> Back to My Parcels
                </button>

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
                        <h2 className="text-3xl font-bold flex justify-center items-center gap-3">
                            <FaBox className="text-blue-200" /> Update Shipment Details
                        </h2>
                        <p className="text-blue-100 mt-2">Modify your parcel information before processing begins</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* Section: Sender Info */}
                            <div className="md:col-span-2 border-b pb-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <FaUser className="text-blue-600" /> Sender Information
                                </h3>
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600">Sender Name</label>
                                <input type="text" value={parcel?.senderName || parcel?.userName || ""} disabled className="input input-bordered bg-gray-50 border-gray-200 text-gray-500 font-medium" />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600">Sender Email</label>
                                <input type="email" value={parcel?.senderEmail || parcel?.userEmail || ""} disabled className="input input-bordered bg-gray-50 border-gray-200 text-gray-500 font-medium" />
                            </div>

                            {/* Section: Parcel Details */}
                            <div className="md:col-span-2 border-b pb-2 mt-4 mb-2">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <FaBox className="text-blue-600" /> Parcel & Delivery Details
                                </h3>
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600">Parcel Type</label>
                                <input type="text" {...register("parcelType")} placeholder="e.g. Electronics" className="input input-bordered focus:ring-2 ring-blue-100 transition-all" required />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <FaWeightHanging className="text-xs" /> Weight (kg)
                                </label>
                                <input type="number" {...register("parcelWeight")} className="input input-bordered focus:ring-2 ring-blue-100" required />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600">Receiver Name</label>
                                <input type="text" {...register("receiverName")} className="input input-bordered focus:ring-2 ring-blue-100" required />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <FaPhoneAlt className="text-xs" /> Receiver Phone
                                </label>
                                <input type="text" {...register("receiverPhoneNumber")} className="input input-bordered focus:ring-2 ring-blue-100" required />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-xs" /> Delivery Address
                                </label>
                                <input type="text" {...register("deliveryAddress")} className="input input-bordered focus:ring-2 ring-blue-100" required />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <FaCalendarAlt className="text-xs" /> Delivery Date
                                </label>
                                <input type="date" {...register("deliveryDate")} className="input input-bordered focus:ring-2 ring-blue-100" required />
                            </div>

                            <div className="form-control">
                                <label className="label text-sm font-bold text-blue-700 uppercase tracking-wider">Estimated Cost</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 font-bold text-blue-600">TK</span>
                                    <input type="number" {...register("totalCost")} readOnly className="input input-bordered pl-12 w-full bg-blue-50 border-blue-200 font-extrabold text-blue-700 text-lg focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col md:flex-row gap-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                            >
                                Update Parcel Information
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateParcel;