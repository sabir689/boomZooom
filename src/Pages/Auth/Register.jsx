import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogIn from './SocialLogIn';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    
    const [profilePic, setProfilePic] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Image Upload Logic to ImgBB
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', image);
        
        try {
            const ImageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_upload_Key}`;
            const res = await axios.post(ImageUploadUrl, formData);
            setProfilePic(res.data.data.url);
        } catch (error) {
            console.error("Upload error", error);
            Swal.fire("Error", "Image upload failed. Please try again.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (isUploading) return;

        try {
            // 1. Create User in Firebase
            await createUser(data.email, data.password);
            
            // 2. Update Firebase Profile (Name & Photo)
            await updateUserProfile(data.name, profilePic);

            // 3. Sync with your Database (Upsert Pattern)
            const userInfo = {
                name: data.name,
                email: data.email,
                image: profilePic,
            };

            // Using PUT ensures we create the user OR update them if they exist
            // without resetting their 'role' in the backend.
            await axios.put('http://localhost:5000/users', userInfo);

            // 4. Success Feedback
            Swal.fire({
                title: "Success!",
                text: "Welcome to ZoomBoom! Redirecting...",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: '#ffffff',
                iconColor: '#D4E971',
                customClass: { popup: 'rounded-2xl' }
            });

            // 5. Navigate to Home
            navigate('/');

        } catch (error) {
            console.error("Auth Error:", error.code);
            
            // Handle specific Firebase error codes for better UX
            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use. Try logging in!";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Use at least 6 characters.";
            }

            Swal.fire({
                title: "Registration Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: '#D4E971',
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-sm p-4">
                <div className='text-left mb-4 mt-10'>
                    <h1 className="text-3xl font-bold text-black">Create an Account</h1>
                    <p className="text-gray-600 mt-1">Register with ZoomBoom</p>
                </div>

                {/* Dynamic Avatar Preview */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-[#D4E971] relative overflow-hidden">
                        {profilePic ? (
                            <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="loading loading-spinner loading-xs text-white"></span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Profile Picture Field */}
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text font-semibold text-black">Profile Picture</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="file-input file-input-bordered file-input-sm w-full focus:outline-[#D4E971]"
                        />
                    </div>

                    {/* Name Field */}
                    <div className="form-control">
                        <label className="label font-semibold text-black py-1">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: "Name is required" })}
                            className="input input-bordered w-full focus:outline-[#D4E971]"
                            placeholder="Full Name"
                        />
                        {errors.name && <span className='text-red-500 text-xs mt-1'>{errors.name.message}</span>}
                    </div>

                    {/* Email Field */}
                    <div className="form-control">
                        <label className="label font-semibold text-black py-1">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: "Email is required" })}
                            className="input input-bordered w-full focus:outline-[#D4E971]"
                            placeholder="email@example.com"
                        />
                        {errors.email && <span className='text-red-500 text-xs mt-1'>{errors.email.message}</span>}
                    </div>

                    {/* Password Field with Eye Toggle */}
                    <div className="form-control">
                        <label className="label font-semibold text-black py-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                className="input input-bordered w-full pr-10 focus:outline-[#D4E971]"
                                placeholder="••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#a8c43a]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className='text-red-500 text-xs mt-1'>{errors.password.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isUploading}
                        className="btn w-full bg-[#D4E971] hover:bg-[#c4db5f] border-none text-black font-bold mt-4 disabled:bg-gray-300"
                    >
                        {isUploading ? <span className="loading loading-spinner"></span> : "Register"}
                    </button>

                    <p className="text-sm text-center text-gray-500 pt-2">
                        Already have an account? <Link className="text-[#a8c43a] font-bold hover:underline" to="/logIn">Login</Link>
                    </p>

                    <div className="divider text-xs text-gray-400">OR</div>

                    <SocialLogIn />
                </form>
            </div>
        </div>
    );
};

export default Register;