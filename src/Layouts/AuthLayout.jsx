import React, { useState } from 'react'; // Added hook
import Logo from '../Pages/shared/logo/logo';
import authImg from '../assets/png/authImage.png';

const AuthLayout = () => {
    // State to hold form values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Submitting:", { email, password });
        // Add your authentication logic here
    };

    return (
        <div className="flex h-screen w-full font-sans bg-white">
            {/* Left Section: Form */}
            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-2 relative">

                {/* Logo Section */}
                <div className="flex items-center mb-14"><Logo></Logo></div>

                {/* Form Container */}
                <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 mb-10 text-sm">Login with ZoomBoom</p>

                    <form onSubmit={handleLogin} className="space-y-2">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-200 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-200 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <button type="button" className="text-1xl text-gray-400 hover:text-gray-600 transition-colors underline decoration-gray-300  underline-offset-4">
                            Forget Password?
                        </button>

                        <button type="submit" className="w-full py-3 bg-[#D4E96D] hover:bg-[#c3d95a] transition-all font-bold rounded-md text-gray-800 shadow-sm">
                            Login
                        </button>
                    </form>

                    <div className="mt-4  space-y-4">
                        <p className="text-sm text-gray-500">
                            Don't have any account? <a href="#" className="text-[#A3B93C] font-bold hover:underline">Register</a>
                        </p>

                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink  text-black text-xs">Or</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => console.log("Google login triggered")}
                            className="w-full flex items-center justify-center gap-3 py-3 bg-[#E9EDF2] hover:bg-[#dee3e9] transition-colors rounded-md text-sm font-semibold text-gray-700"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="G" className="w-5 h-5" />
                            Login with google
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section: Illustration Background */}
            <div className="hidden md:flex w-1/2 bg-[#F9FFF2] items-center justify-center p-12">
                <div className="max-w-lg">
                    <img
                        src={authImg}
                        alt="Delivery Illustration"
                        className="w-full h-auto drop-shadow-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;