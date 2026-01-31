import React from 'react';

import trackingImg from '../../assets/png/live-tracking.png';
import safeImg from '../../assets/png/safe-delivery.png';
import supportImg from '../../assets/png/safe-delivery.png';

const features = [
  {
    title: "Live Parcel Tracking",
    description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    img: trackingImg 
  },
  {
    title: "100% Safe Delivery",
    description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    img: safeImg
  },
  {
    title: "24/7 Call Center Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    img: supportImg
  }
];

const FeatureSection = () => {
  return (
    <section className="bg-[#eef2f3] py-16 px-6 flex flex-col items-center gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-white w-full max-w-5xl rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm transition-transform hover:scale-[1.01]"
        >
          {/* Image Container */}
          <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
            <img 
              src={feature.img} 
              alt={feature.title} 
              className="max-h-full object-contain"
            />
          </div>

          {/* Vertical Dashed Divider (Visible on Desktop) */}
          <div className="hidden md:block h-24 border-l-2 border-dashed border-gray-300 mx-4" />

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-[#022c22] text-2xl font-bold mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;