import React from 'react';
import Banner from './banner/Banner';
import truck from '../../assets/png/bookingIcon.png'
    ;
import ServicesSection from './ServicesSection';
import TrustedBy from './TrustedBy';
import FeatureSection from './FeatureSection';

const homepage = () => {
    return (
        <div>
            <Banner></Banner>
            <section id='howItWorks' className='p-10 mt-20'>
                <h1 className='text-3xl font-bold mb-10 text-center md:text-left'>How it Works</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className='shadow-2xl rounded-2xl p-10 bg-white text-black'>
                        <img className='mb-4' src={truck} alt="" />
                        <h3 className='mb-2 font-bold'>Booking Pick & Drop</h3>
                        <p>From personal packages to business shipments — we deliver on time, every time.</p>
                    </div>
                    <div className='shadow-2xl rounded-2xl p-10 bg-white text-black'>
                        <img className='mb-4' src={truck} alt="" />
                        <h3 className='mb-2 font-bold'>Cash on delivery</h3>
                        <p>From personal packages to business shipments — we deliver on time, every time.</p>
                    </div>
                    <div className='shadow-2xl rounded-2xl p-10 bg-white text-black'>
                        <img className='mb-4' src={truck} alt="" />
                        <h3 className='mb-2 font-bold'>Delivery Hub</h3>
                        <p>From personal packages to business shipments — we deliver on time, every time.</p>
                    </div>
                    <div className='shadow-2xl rounded-2xl p-10 bg-white text-black'>
                        <img className='mb-4' src={truck} alt="" />
                        <h3 className='mb-2 font-bold'>Booking SME & Corporate</h3>
                        <p>From personal packages to business shipments — we deliver on time, every time.</p>
                    </div>
                </div>
            </section>
            <ServicesSection></ServicesSection>
            <TrustedBy></TrustedBy>
            <FeatureSection></FeatureSection>
            
        </div>
    );
};

export default homepage;