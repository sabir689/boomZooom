import { Outlet } from 'react-router';
import authImage from '../assets/png/authImage.png';
import Logo from '../Pages/shared/logo/logo';


const AuthLayout = () => {
    // The specific pale green color you requested
    const bgColor = 'rgba(250, 253, 240, 1)';

    return (
        <div 
            className="min-h-screen w-full"
            style={{ 
                /* This creates the 50/50 split across the whole screen */
                background: `linear-gradient(to right, #ffffff 50%, ${bgColor} 50%)` 
            }}
        >
            {/* Main Container */}
            <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
                
                {/* Logo Section */}
                <div className="ml-5 p-2 -mb-10">
                    <Logo></Logo>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 items-center">
                    
                    {/* Left Side: Form/Outlet (White Background Area) */}
                    <div className="flex-1 px-8 lg:px-16">
                        <Outlet />
                    </div>

                    {/* Right Side: Image (Pale Green Background Area) */}
                    <div className="flex-1 flex justify-center items-center p-8">
                        <img 
                            src={authImage} 
                            alt="Authentication Illustration" 
                            className="max-w-full h-auto object-contain max-h-[80vh]"
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;