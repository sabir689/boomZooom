
import useAuth from '../../Hooks/useAuth';

const SocialLogIn = () => {
    const {signInWithGoogle} = useAuth();
    const handleGoogleSignIn = () =>{
        signInWithGoogle()
        .then (result =>{
            console.log(result.user)
        })
        .catch(error =>{
            console.error(error);
        })

    }
    return (
        <div>
            <p className='text-center text-black'>or</p>
            <button
                type="button"
                onClick={handleGoogleSignIn}
               className="btn w-full bg-[#E8EDF2] hover:bg-gray-200 border-none text-black normal-case font-medium"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-2" alt="google" />
                Login with google
            </button> 
        </div>
    );
};

export default SocialLogIn;