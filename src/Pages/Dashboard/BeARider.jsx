import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import agent from '../../assets/png/agent-pending.png';
import * as z from 'zod';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2'; 
import warehouseDataRaw from '../../data/warehouses.json';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axios from 'axios'; 
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const riderSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  license: z.string().min(5, "Valid license number is required"),
  region: z.string().min(1, "Please select a region"),
  district: z.string().min(1, "Please select a district"),
  nid: z.string().min(10, "NID must be at least 10 digits"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Enter a valid 11-digit BD phone number"),
  bikeDetails: z.string().min(1, "Bike details are required"),
  bikeReg: z.string().min(1, "Bike registration is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  riderImage: z.any().refine((files) => files?.length === 1, "Profile image is required"),
});

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_upload_Key}`;

const BeARider = () => {
  const { user } = useAuth();
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [coveredAreas, setCoveredAreas] = useState([]);
  const [preview, setPreview] = useState(null); 
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
    }
  });

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");
  const riderImageFile = watch("riderImage");

  useEffect(() => {
    if (riderImageFile && riderImageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(riderImageFile[0]);
    } else {
      setPreview(null);
    }
  }, [riderImageFile]);

  useEffect(() => {
    const regions = [...new Set(warehouseDataRaw.map(item => item.region))];
    setUniqueRegions(regions);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filtered = warehouseDataRaw
        .filter(item => item.region === selectedRegion)
        .map(item => item.district);
      setAvailableDistricts(filtered);
      setValue("district", ""); 
      setCoveredAreas([]);      
    }
  }, [selectedRegion, setValue]);

  useEffect(() => {
    if (selectedDistrict) {
      const areaData = warehouseDataRaw.find(
        item => item.region === selectedRegion && item.district === selectedDistrict
      );
      setCoveredAreas(areaData ? areaData.covered_area : []);
    }
  }, [selectedDistrict, selectedRegion]);

  const onSubmit = async (data) => {
    Swal.fire({
      title: 'Processing Application...',
      text: 'Finalizing your profile...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      // 1. Upload to ImgBB using standard axios
      const formData = new FormData();
      formData.append('image', data.riderImage[0]);

      const imgRes = await axios.post(image_hosting_api, formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });

      if (imgRes.data.success) {
        const imageUrl = imgRes.data.data.display_url;

        // 2. Prepare Payload strictly matching your backend needs
        const riderPayload = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          nid: data.nid,
          region: data.region,
          district: data.district,
          license: data.license,
          bikeDetails: data.bikeDetails,
          bikeReg: data.bikeReg,
          bio: data.bio,
          riderImage: imageUrl, 
          userPhoto: user?.photoURL || '', 
          status: 'pending',
          role: 'rider',
          appliedAt: new Date().toISOString()
        };

        // 3. Post to internal DB using axiosSecure
        // If this still gives 400, it means your backend "existingApplication" check 
        // is triggering because this email already exists in the riders collection.
        const response = await axiosSecure.post('/riders', riderPayload);

        if (response.data.insertedId) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your application has been submitted.',
            confirmButtonColor: '#003d3d'
          });
          reset();
          setPreview(null);
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center p-4 md:p-10">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-12 max-w-6xl w-full flex flex-col md:flex-row gap-12">
        
        <div className="flex-[1.4]">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-[#003d3d] mb-2 tracking-tight">Be a Rider</h1>
            <p className="text-gray-500 text-sm">Join the elite fleet and start earning.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Identity Verification</h2>
              
              {preview && (
                <div className="mb-6 flex flex-col items-center md:items-start">
                  <div className="relative w-40 h-40">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl border-4 border-[#D4EF70] shadow-lg" />
                    <button 
                      type="button"
                      onClick={() => { setValue("riderImage", null); setPreview(null); }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-md"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              )}

              <div className="w-full">
                <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center ${
                  errors.riderImage ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-[#D4EF70] bg-gray-50'
                }`}>
                  <input type="file" accept="image/*" {...register("riderImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="text-center">
                    <FaCloudUploadAlt className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p className="text-sm font-bold text-[#003d3d]">{riderImageFile?.[0] ? riderImageFile[0].name : "Upload Profile Photo"}</p>
                  </div>
                </div>
                {errors.riderImage && <p className="text-[10px] text-red-500 mt-2">{errors.riderImage.message}</p>}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name" name="fullName" register={register} error={errors.fullName} />
              <InputField label="Email Address" name="email" register={register} readOnly />
              <InputField label="Phone Number" name="phone" register={register} error={errors.phone} />
              <InputField label="National ID (NID)" name="nid" register={register} error={errors.nid} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Working Region" name="region" register={register} error={errors.region} options={uniqueRegions} />
              <SelectField label="Assigned District" name="district" register={register} error={errors.district} options={availableDistricts} disabled={!selectedRegion} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="License Number" name="license" register={register} error={errors.license} />
              <InputField label="Bike Details" name="bikeDetails" register={register} error={errors.bikeDetails} />
              <div className="md:col-span-2">
                <InputField label="Bike Registration" name="bikeReg" register={register} error={errors.bikeReg} />
              </div>
            </section>

            <textarea
              {...register("bio")}
              placeholder="Bio..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm min-h-[100px] outline-none focus:border-[#D4EF70]"
            />

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#D4EF70] text-[#003d3d] font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Submit Application"}
            </button>
          </form>
        </div>

        <div className="flex-1 hidden lg:flex items-center justify-center">
          <img src={agent} alt="Rider" className="w-full max-w-sm h-auto transform -scale-x-100" />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InputField = ({ label, name, register, error, readOnly }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
    <input
      {...register(name)}
      readOnly={readOnly}
      className={`w-full border rounded-xl p-3 text-sm outline-none ${readOnly ? 'bg-gray-100' : 'border-gray-200'}`}
    />
    {error && <p className="text-[10px] text-red-500 mt-1">{error.message}</p>}
  </div>
);

const SelectField = ({ label, name, options, register, error, disabled }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
    <select {...register(name)} disabled={disabled} className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white outline-none">
      <option value="">Select {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {error && <p className="text-[10px] text-red-500 mt-1">{error.message}</p>}
  </div>
);

export default BeARider;