import React from 'react';
import { 
  FaTruckFast, 
  FaGlobe, 
  FaBoxOpen, 
  FaMoneyBillWave, 
  FaHandshake, 
  FaRotateLeft 
} from 'react-icons/fa6';

const Services = [
  {
    icon: <FaTruckFast size={40} />,
    title: "Express & Standard Delivery",
    description: "We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6 hours from pick-up to drop-off.",
  },
  {
    icon: <FaGlobe size={40} />,
    title: "Nationwide Delivery",
    description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.",
  },
  {
    icon: <FaBoxOpen size={40} />,
    title: "Fulfillment Solution",
    description: "We also offer customized vendors with inventory management support, online order processing, packaging, and after-sales support.",
  },
  {
    icon: <FaMoneyBillWave size={40} />,
    title: "Cash on Home Delivery",
    description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: <FaHandshake size={40} />,
    title: "Corporate Service / Contract In Logistics",
    description: "Customized corporate services which include warehouse and inventory management support.",
  },
  {
    icon: <FaRotateLeft size={40} />,
    title: "Parcel Return",
    description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-[#052120] py-20 px-6 font-sans min-h-screen flex items-center rounded-2xl mt-30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl font-bold mb-6">Our Services</h2>
          <p className="text-gray-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Enjoy fast reliable parcel delivery with real-time tracking and zero hassle, 
            from personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-10 mr-10 rounded-2xl">
          {Services.map((service, index) => (
            <div
              key={index}
              className="group bg-white hover:bg-[#bef264] transition-all duration-300 ease-in-out rounded-[2rem] p-10 flex flex-col items-center text-center cursor-pointer shadow-lg"
            >
              {/* Icon Container */}
              <div className="w-20 h-20 mb-8 rounded-full bg-[#f0fdf4] group-hover:bg-white text-[#052120] flex items-center justify-center transition-colors duration-300">
                 {service.icon}
              </div>
              
              <h3 className="text-[#052120] text-xl font-bold mb-5 leading-tight">
                {service.title}
              </h3>
              
              <p className="text-[#334155] text-sm leading-relaxed font-medium transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;