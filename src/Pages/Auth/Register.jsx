import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import { Link } from 'react-router';
import { FaGoogle } from 'react-icons/fa'; // Install react-icons if you haven't
import SocialLogIn from './SocialLogIn';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser } = useAuth(); // Assume you add Google to your hook

    const onSubmit = (data) => {
        createUser(data.email, data.password)
            .then(result => console.log(result.user))
            .catch(error => console.error(error));
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-sm p-4">
                {/* Header Section */}
                <div className='text-left mb-4'>
                    <h1 className="text-3xl font-bold text-black">Create an Account</h1>
                    <p className="text-gray-600 mt-1">Register with ZoomBOOm</p>
                </div>

                {/* Avatar Placeholder */}
                <div className="mb-6">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 relative">
                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200">
                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    {/* Name Field */}
                    <div className="form-control">
                        <label className="label font-semibold text-black">Name</label>
                        <input type="text" {...register('name')} className="input input-bordered w-full" placeholder="Name" />
                    </div>

                    {/* Email Field */}
                    <div className="form-control">
                        <label className="label font-semibold text-black">Email</label>
                        <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" placeholder="Email" />
                        {errors.email && <span className='text-red-500 text-xs mt-1'>Email is required</span>}
                    </div>

                    {/* Password Field */}
                    <div className="form-control">
                        <label className="label font-semibold text-black">Password</label>
                        <input type="password" {...register("password", { required: true, minLength: 6 })} className="input input-bordered w-full" placeholder="Password" />
                        {errors.password?.type === 'required' && <span className='text-red-500 text-xs mt-1'>Password is required</span>}
                        {errors.password?.type === 'minLength' && <span className='text-red-500 text-xs mt-1'>Must be at least 6 characters</span>}
                    </div>

                    {/* Register Button - Matching the lime green in your image */}
                    <button className="btn w-full bg-[#D4E971] hover:bg-[#c4db5f] border-none text-black font-bold mt-2">
                        Register
                    </button>

                    <p className="text-sm text-center text-gray-500 ">
                        Already have an account? <Link className="text-[#a8c43a] font-bold hover:underline" to="/logIn">Login</Link>
                    </p>
                    {/* Google Button */}
                    <SocialLogIn></SocialLogIn>

                </form>
            </div>
        </div>
    );
};

export default Register;