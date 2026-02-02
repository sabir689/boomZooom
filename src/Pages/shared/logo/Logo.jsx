import React from 'react';
import logoZoom from '../../../assets/png/logo.png'
import { Link } from 'react-router-dom'; 
const Logo = () => {
    return (
        <Link to="/" className="inline-block">
            <div className='flex items-center gap-1 p-4 rounded-2xl'> 
               
                <img className='h-10 w-auto' src={logoZoom} alt="ZoomBoom Logo" />
                
                <p className='text-3xl font-extrabold text-black tracking-tight'>
                    ZoomBoom
                </p>
            </div>
        </Link>
    );
};

export default Logo;