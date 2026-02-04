import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiPackage, FiTruck, FiAlertCircle } from 'react-icons/fi';
import warehouseData from '../../data/warehouses.json';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const SendParcelForm = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            parcelType: 'document',
            parcelWeight: 1
        }
    });

    const [districts, setDistricts] = useState([]);

    // Watchers for real-time cost and logic
    const watchedType = watch("parcelType");
    const watchedWeight = watch("parcelWeight");
    const watchedSenderDistrict = watch("senderDistrict");
    const watchedReceiverDistrict = watch("receiverDistrict");
    const watchedSenderArea = watch("senderArea");
    const watchedReceiverArea = watch("receiverArea");

    useEffect(() => {
        if (warehouseData) {
            const sorted = [...warehouseData].sort((a, b) =>
                a.district.localeCompare(b.district)
            );
            setDistricts(sorted);
        }
    }, []);

    // --- Pricing Logic ---
    const calculateCost = () => {
        if (!watchedSenderDistrict || !watchedReceiverDistrict) return 0;
        const isWithinCity = watchedSenderDistrict === watchedReceiverDistrict;
        const weight = parseFloat(watchedWeight) || 0;
        let total = 0;

        if (watchedType === 'document') {
            total = isWithinCity ? 60 : 80;
        } else {
            const basePrice = isWithinCity ? 110 : 150;
            total = basePrice;
            if (weight > 3) {
                const extraWeight = Math.ceil(weight - 3);
                total += (extraWeight * 40);
                if (!isWithinCity) total += 40;
            }
        }
        return total;
    };

    const deliveryFee = calculateCost();

    const getCoveredAreas = (districtName) => {
        const districtObj = districts.find(d => d.district === districtName);
        return districtObj ? districtObj.covered_area : [];
    };

    const isSameLocation = watchedSenderArea && watchedReceiverArea && (watchedSenderArea === watchedReceiverArea);

    // --- Submission Logic ---
    const onSubmit = (data) => {
        if (isSameLocation) {
            Swal.fire({
                icon: 'error',
                title: 'Location Error',
                text: 'Pickup and Delivery cannot be in the same area.',
                confirmButtonColor: '#003D3D'
            });
            return;
        }

        // Generate a Unique ID for this parcel (Frontend Temporary)
        const parcelId = `PRCL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const isWithinCity = watchedSenderDistrict === watchedReceiverDistrict;
        const basePrice = (watchedType === 'document') ? (isWithinCity ? 60 : 80) : (isWithinCity ? 110 : 150);
        const weightExtra = deliveryFee - basePrice;

        Swal.fire({
            title: '<span style="color: #003D3D; font-size: 1.5rem;">Confirm Booking</span>',
            html: `
                <div style="text-align: left; font-family: 'Segoe UI', sans-serif;">
                    <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; color: #166534; font-size: 0.8rem;">TRACKING ID (TEMP)</p>
                        <p style="margin: 0; font-weight: bold; font-family: monospace;">${parcelId}</p>
                    </div>
                    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;">Base Fare</td><td style="text-align: right;">৳${basePrice}</td></tr>
                        ${weightExtra > 0 ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0;">Extra Weight Fee</td><td style="text-align: right;">৳${weightExtra}</td></tr>` : ''}
                        <tr style="font-weight: bold; font-size: 1.2rem; color: #003D3D;"><td style="padding-top: 10px;">Total Pay</td><td style="padding-top: 10px; text-align: right;">৳${deliveryFee}</td></tr>
                    </table>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#003D3D',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm & Place Order',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const finalSubmission = {
                    ...data,
                    parcelId, // Added the unique ID
                    userEmail: user?.email,
                    totalCost: deliveryFee,
                    status: "Pending",
                    bookedAt: new Date().toISOString()
                };

                console.log("Saving to Database:", finalSubmission);

                axiosSecure.post('/parcels', finalSubmission)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.insertedId) {
                            Swal.fire({
                                title: 'Booked Successfully!',
                                text: `Your Tracking ID is: ${parcelId}`,
                                icon: 'success',
                                confirmButtonColor: '#003D3D'
                            });
                        }
                    })



                reset(); // Clears form without page refresh
            }
        });
    };

    // UI Styles
    const inputStyle = "w-full p-3 border border-gray-200 rounded-md bg-white text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-all";
    const labelStyle = "block text-black text-sm font-bold mb-2";
    const sectionTitle = "font-bold text-[#003D3D] border-b border-gray-100 pb-2 mb-4 uppercase text-xs tracking-wider flex items-center gap-2";

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white shadow-2xl rounded-3xl my-10 border border-gray-100">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-lime-400 tracking-tight">Enter your parcel details</h1>
                    <p className="text-gray-500 font-medium">Safe & secure delivery for your goods.</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl border-l-4 border-[#CAEB66]">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total Cost</p>
                    <p className="text-3xl font-black text-[#003D3D]">৳{deliveryFee}</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* 1. Parcel Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl">
                    <div>
                        <label className={labelStyle}>Parcel Type</label>
                        <select {...register("parcelType")} className={inputStyle}>
                            <option value="document">Document</option>
                            <option value="not-document">Box / Goods</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelStyle}>Parcel Name</label>
                        <input {...register("parcelName", { required: true })} placeholder="Ex: Laptop, Files" className={inputStyle} />
                        {errors.parcelName && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className={labelStyle}>Weight (KG)</label>
                        <input type="number" step="0.1" {...register("parcelWeight", { required: true, min: 0.1 })} className={inputStyle} />
                    </div>
                </div>

                {/* 2. Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* FROM */}
                    <div className="space-y-4">
                        <h3 className={sectionTitle}><FiTruck /> Pickup Details</h3>
                        <input {...register("senderName", { required: true })} placeholder="Sender Name" className={inputStyle} />
                        <input {...register("senderPhone", { required: true })} placeholder="Sender Phone" className={inputStyle} />
                        <select {...register("senderDistrict", { required: true })} className={inputStyle}>
                            <option value="">Select District</option>
                            {districts.map((d, i) => <option key={i} value={d.district}>{d.district}</option>)}
                        </select>
                        <select {...register("senderArea", { required: true })} className={inputStyle} disabled={!watchedSenderDistrict}>
                            <option value="">Select Area</option>
                            {getCoveredAreas(watchedSenderDistrict).map((area, i) => <option key={i} value={area}>{area}</option>)}
                        </select>
                        <textarea {...register("senderAddress", { required: true })} placeholder="Pickup Address" className={inputStyle}></textarea>
                    </div>

                    {/* TO */}
                    <div className="space-y-4">
                        <h3 className={sectionTitle}><FiPackage /> Receiver Details</h3>
                        <input {...register("receiverName", { required: true })} placeholder="Receiver Name" className={inputStyle} />
                        <input {...register("receiverPhone", { required: true })} placeholder="Receiver Phone" className={inputStyle} />
                        <select {...register("receiverDistrict", { required: true })} className={inputStyle}>
                            <option value="">Select District</option>
                            {districts.map((d, i) => <option key={i} value={d.district}>{d.district}</option>)}
                        </select>
                        <select {...register("receiverArea", { required: true })} className={inputStyle} disabled={!watchedReceiverDistrict}>
                            <option value="">Select Area</option>
                            {getCoveredAreas(watchedReceiverDistrict).map((area, i) => <option key={i} value={area}>{area}</option>)}
                        </select>
                        <textarea {...register("receiverAddress", { required: true })} placeholder="Delivery Address" className={inputStyle}></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xl text-lime-400 italic">PickUp Time 4pm-7pm Approx.</p>
                    <button
                        type="submit"
                        disabled={isSameLocation}
                        className="w-full md:w-auto bg-lime-400 text-white font-bold py-4 px-16 rounded-xl hover:bg-black transition-all disabled:opacity-30"
                    >
                        Review & Book Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendParcelForm;