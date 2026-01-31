import React from 'react';
import logoZoom from '../../../assets/png/logo.png'
const Logo = () => {
    return (
        <div className='flex  items-end'>
            <img className='mb-2' src={logoZoom} alt="" />
            <p className='text-3xl -ml-3 font-extrabold'>ZoomBoom</p>
        </div>
    );
};

export default Logo;