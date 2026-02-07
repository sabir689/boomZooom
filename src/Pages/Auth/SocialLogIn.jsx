import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic'; 
import Swal from 'sweetalert2';

const SocialLogIn = () => {
    const { signInWithGoogle } = useAuth();
    const axiosPublic = useAxiosPublic(); 
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(async (result) => {
                const user = result.user;
                
                // 2. Map the data correctly from the Firebase 'user' object
                const userInfo = {
                    name: user?.displayName,
                    email: user?.email,
                    image: user?.photoURL,
                };

                console.log("Attempting to sync user to DB:", userInfo);

                try {
                    
                    const res = await axiosPublic.put('/users', userInfo);
                    
                    if (res.data) {
                        console.log('Database Sync Success:', res.data);
                        Swal.fire({
                            icon: "success",
                            title: "Welcome!",
                            text: `Logged in as ${user.email}`,
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        navigate(from, { replace: true });
                    }
                } catch (error) {
                    // 4. Debugging: If it fails, check this console log
                    console.error("Database sync failed. Error details:", error.response || error);
                    
                    // Force navigation so user isn't stuck, but you'll know it failed
                    navigate(from, { replace: true });
                }
            })
            .catch(error => {
                console.error("Firebase Auth Error:", error);
                Swal.fire("Error", "Google login failed", "error");
            });
    };

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn w-full bg-[#E8EDF2] hover:bg-gray-200 border-none text-black normal-case font-medium flex items-center justify-center gap-2"
            >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    className="w-5 h-5" 
                    alt="google" 
                />
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogIn;