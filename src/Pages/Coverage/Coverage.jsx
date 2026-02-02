import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiSearch, FiMapPin, FiNavigation } from 'react-icons/fi';

// Import your JSON file (adjust path as needed)
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
            map.flyTo(center, 10, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

const Coverage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mapCenter, setMapCenter] = useState([23.6850, 90.3563]);

    const filteredDistricts = warehouseData.filter(item =>
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLocationClick = (lat, lng) => {
        setMapCenter([lat, lng]);
    };

    return (
        <div className="bg-[#f8f9fa] p-4 md:p-10 min-h-screen font-sans">
            <section className="bg-white py-12 px-6 md:px-12 rounded-[40px] max-w-7xl mx-auto shadow-sm border border-gray-100">
                
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#003d29] mb-6 tracking-tight">
                        Our Delivery Network
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        Explore our active warehouses across {warehouseData.length} districts in Bangladesh.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <div className="flex items-center bg-[#f0f2f4] rounded-full p-1.5 pl-6 border border-gray-100 focus-within:ring-2 focus-within:ring-[#D4E971] transition-all">
                            <FiSearch className="text-gray-400 text-xl" />
                            <input 
                                type="text" 
                                placeholder="Search District or Region..." 
                                className="bg-transparent border-none outline-none w-full px-4 text-gray-700 font-medium py-2"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Sidebar List */}
                    <div className="lg:col-span-1 h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-[#003d29] flex items-center gap-2">
                                <FiMapPin className="text-[#D4E971]" /> Available Hubs
                            </h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold">
                                {filteredDistricts.length} Found
                            </span>
                        </div>
                        
                        <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {filteredDistricts.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleLocationClick(item.latitude, item.longitude)}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#D4E971] hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[#003d29] group-hover:text-black">{item.district}</p>
                                            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2">{item.region}</p>
                                        </div>
                                        <FiNavigation className="text-gray-300 group-hover:text-[#D4E971]" />
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {item.covered_area.slice(0, 3).map((area, i) => (
                                            <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">
                                                {area}
                                            </span>
                                        ))}
                                        {item.covered_area.length > 3 && <span className="text-[10px] text-gray-400">+{item.covered_area.length - 3} more</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Map */}
                    <div className="lg:col-span-2 h-[600px] rounded-[32px] overflow-hidden border-4 border-[#f0f2f4] z-0 shadow-inner">
                        <MapContainer 
                            center={[23.6850, 90.3563]} 
                            zoom={7} 
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer 
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
                                attribution='&copy; OpenStreetMap'
                            />
                            <MoveMap center={mapCenter} />
                            
                            {filteredDistricts.map((item, idx) => (
                                <Marker key={idx} position={[item.latitude, item.longitude]}>
                                    <Popup>
                                        <div className="min-w-[150px]">
                                            <h4 className="font-bold text-[#003d29] border-b pb-1 mb-2">{item.district} Hub</h4>
                                            <p className="text-xs text-gray-600 mb-2"><strong>Areas:</strong> {item.covered_area.join(", ")}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                <span className="text-[10px] font-bold text-green-600 uppercase">Status: {item.status}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Coverage;