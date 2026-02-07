import React, { useState } from 'react'; // Added useState
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import SocialLogIn from './SocialLogIn';
import Swal from 'sweetalert2';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Added icons

const LogIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        signIn(data.email, data.password)
            .then(result => {
                console.log(result.user);
                
                Swal.fire({
                    title: "Welcome Back!",
                    text: "Login successful.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    iconColor: '#D4E971',
                });

                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Invalid email or password. Please try again.",
                    icon: "error",
                    confirmButtonColor: '#D4E971',
                });
            });
    };

    return (
        <div className='max-w-md mx-auto lg:ml-10 w-full'>
            {/* Header Section */}
            <div className='text-left mb-6'>
                <h1 className="text-4xl font-extrabold text-black tracking-tight leading-tight">Welcome Back</h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">Login with ZoomBoom</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                    <input 
                        type="email" 
                        {...register('email', { required: "Email is required" })} 
                        className="w-full text-black px-4 py-2 rounded-md border border-gray-200 focus:ring-1 focus:ring-[#D4E971] focus:border-[#D4E971] outline-none transition-all placeholder:text-gray-300 text-sm" 
                        placeholder="Email" 
                    />
                    {errors.email && <p className='text-red-500 text-[10px] mt-1'>{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
                    <div className="relative"> {/* Added relative for icon positioning */}
                        <input 
                            type={showPassword ? "text" : "password"} // Dynamic type
                            {...register("password", { 
                                required: "Password is required", 
                                minLength: { value: 6, message: "Must be at least 6 characters" } 
                            })} 
                            className="w-full px-4 py-2 text-black rounded-md border border-gray-200 focus:ring-1 focus:ring-[#D4E971] focus:border-[#D4E971] outline-none transition-all placeholder:text-gray-300 text-sm pr-10" 
                            placeholder="Password" 
                        />
                        {/* Toggle Icon Button */}
                        <span 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </span>
                    </div>
                    {errors.password && <p className='text-red-500 text-[10px] mt-1'>{errors.password.message}</p>}
                </div>

                {/* Forgot Password */}
                <div className="text-left">
                    <a className="text-gray-400 hover:text-black text-xs border-b border-gray-200 pb-0.5 cursor-pointer transition-colors inline-block">
                        Forget Password?
                    </a>
                </div>

                {/* Login Button */}
                <button 
                    type="submit"
                    className="w-full bg-[#D4E971] hover:bg-[#c4db5f] py-2.5 rounded-lg text-black font-bold text-sm transition-colors mt-2 shadow-sm"
                >
                    Login
                </button>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-6 space-y-4">
                <p className="text-gray-400 text-xs">
                    Don’t have any account? <Link className="text-[#a8c43a] font-bold hover:underline" to="/register">Register</Link>
                </p>
                
                <div className="divider text-xs text-gray-400">OR</div>

                {/* Google Login Button Component */}
                <SocialLogIn />
            </div>
        </div>
    );
};

export default LogIn;