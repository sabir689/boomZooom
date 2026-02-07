import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiSearch, FiMapPin, FiNavigation, FiCheckCircle } from 'react-icons/fi';

// Import your JSON file
import warehouseData from '../../data/warehouses.json';

// Fix for Marker Icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map animation
function MoveMap({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 11, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

const Coverage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mapCenter, setMapCenter] = useState([23.6850, 90.3563]);

    // Enhanced filter: Now searches District, Region, AND specific Covered Areas
    const filteredDistricts = warehouseData.filter(item =>
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.covered_area.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleLocationClick = (lat, lng) => {
        setMapCenter([lat, lng]);
    };

    return (
        <div className="bg-[#f8f9fa] p-4 md:p-10 min-h-screen font-sans">
            <section className="bg-white py-12 px-6 md:px-12 rounded-[40px] max-w-7xl mx-auto shadow-sm border border-gray-100">
                
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#003d29] mb-4 tracking-tight">
                        Our Delivery Network
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        Explore covered areas across {warehouseData.length} districts.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <div className="flex items-center bg-[#f0f2f4] rounded-full p-1.5 pl-6 border border-gray-100 focus-within:ring-2 focus-within:ring-[#CAEB66] transition-all">
                            <FiSearch className="text-gray-400 text-xl" />
                            <input 
                                type="text" 
                                placeholder="Search Area, District or Region..." 
                                className="bg-transparent border-none outline-none w-full px-4 text-gray-700 font-medium py-2"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Sidebar List */}
                    <div className="lg:col-span-1 h-[650px] flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-[#003d29] flex items-center gap-2">
                                <FiMapPin className="text-[#CAEB66]" /> Active Hubs
                            </h3>
                            <span className="text-xs bg-[#003d29] px-3 py-1 rounded-full text-white font-bold">
                                {filteredDistricts.length} Found
                            </span>
                        </div>
                        
                        <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {filteredDistricts.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleLocationClick(item.latitude, item.longitude)}
                                    className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#CAEB66] hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-lg text-[#003d29] group-hover:text-black">{item.district}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.region}</p>
                                        </div>
                                        <FiNavigation className="text-gray-300 group-hover:text-[#CAEB66] transition-colors" />
                                    </div>
                                    
                                    {/* Area Tags in Sidebar */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.covered_area.map((area, i) => (
                                            <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100 group-hover:bg-[#CAEB66]/10 transition-colors">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Map */}
                    <div className="lg:col-span-2 h-[650px] rounded-[32px] overflow-hidden border-8 border-[#f0f2f4] z-0 shadow-inner">
                        <MapContainer 
                            center={[23.6850, 90.3563]} 
                            zoom={7} 
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer 
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
                                attribution='© OpenStreetMap'
                            />
                            <MoveMap center={mapCenter} />
                            
                            {filteredDistricts.map((item, idx) => (
                                <Marker key={idx} position={[item.latitude, item.longitude]}>
                                    <Popup className="custom-popup">
                                        <div className="p-1 max-w-[220px]">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-[#CAEB66] flex items-center justify-center">
                                                    <FiMapPin className="text-[#003d29] text-lg" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#003d29] leading-tight">{item.district} Hub</h4>
                                                    <p className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Status: {item.status}</p>
                                                </div>
                                            </div>

                                            {/* Covered Area List in Map Popup */}
                                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mb-3">
                                                <p className="text-[11px] font-bold text-[#003d29] mb-1 flex items-center gap-1">
                                                    <FiCheckCircle className="text-green-500" /> Covered Areas:
                                                </p>
                                                <div className="text-[10px] text-gray-600 leading-relaxed max-h-[60px] overflow-y-auto pr-1">
                                                    {item.covered_area.join(", ")}
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => window.open(`https://www.google.com/maps?q=${item.latitude},${item.longitude}`)}
                                                className="w-full bg-[#003d29] text-white text-[10px] py-2 rounded-md font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                                            >
                                                <FiNavigation className="text-[12px]" /> Get Directions
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </section>

            {/* In-page style for the custom scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CAEB66;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Coverage;