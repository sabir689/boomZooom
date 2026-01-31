import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import locationImg from '../../assets/png/location-merchant.png'
import bgTop from '../../assets/png/be-a-merchant-bg.png'

const BeMerchant = () => {
  return (
    <section className="px-6 py-12 md:px-20">
      <div className="relative overflow-hidden bg-[#022c22] rounded-[2.5rem] p-10 md:p-20 text-white flex flex-col md:flex-row items-center justify-between min-h-[450px]">
        
        {/* Background Decorative Asset */}
        <div className="absolute top-0 left-0 w-full  opacity-40 pointer-events-none">
          <img 
            src={bgTop} 
            alt="background pattern" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Content Area */}
        <div className="z-10 max-w-2xl text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
            Merchant and Customer Satisfaction is Our First Priority
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-10 leading-relaxed max-w-lg">
            We offer the lowest delivery charge with the highest value along with 
            100% safety of your product. ZoomBoom courier delivers your parcels in every 
            corner of Bangladesh right on time.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
            
            {/* Become a Merchant Button */}
            <button className="bg-[#bef264] text-[#022c22] font-bold p-4 rounded-full hover:scale-105 transition-transform active:scale-95">
              Become a Merchant
            </button>

            {/* Earn with ZapShift Button */}
            <div className="flex items-center group cursor-pointer">
              <button className="border border-[#bef264] text-white font-semibold p-4 rounded-full transition-all group-hover:bg-[#bef264]/10">
                Earn with ZoomBoom Courier
              </button>
              <div className="bg-[#1a1a1a] text-[#bef264] w-12 h-12 rounded-full flex items-center justify-center -ml-6 border-2 border-[#022c22] transition-transform group-hover:rotate-45">
                <FiArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Illustration Area - Fixed Image Rendering */}
        <div className="hidden lg:block  w-full md:w-1/2 lg:w-2/3">
          <img 
            src={locationImg} 
            alt="location and parcel illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default BeMerchant;