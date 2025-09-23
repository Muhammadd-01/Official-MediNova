import { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);
  const mapRef = useRef(null); // Map instance
  const mapContainerRef = useRef(null); // DOM ref
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-none" : "bg-gray-50 text-[#0A3D62] border-none";

  // Initialize Map Once
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([30.3753, 69.3451], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://osm.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Get user location
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 15);

          // User marker
          L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup("You are here")
            .openPopup();

          // Fetch nearby pharmacies
          fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }

    // Cleanup map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch pharmacies
  const fetchNearbyPharmacies = async (lat, lon) => {
    const query = `
      [out:json];
      node["amenity"="pharmacy"](around:3000,${lat},${lon});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.elements && mapRef.current) {
        setPharmacies(data.elements);

        data.elements.forEach((pharmacy) => {
          L.marker([pharmacy.lat, pharmacy.lon])
            .addTo(mapRef.current)
            .bindPopup(pharmacy.tags.name || "Pharmacy");
        });
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
  };

  // Fetch medicines
  const fetchMedicines = async (query) => {
    if (!query) {
      setMedicines([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}&limit=10`
      );
      const data = await res.json();
      setMedicines(data.results || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    }
  };

  // Debounce medicine search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) fetchMedicines(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <>
      <Header />
      <div
        className={`min-h-screen pt-20 p-4 sm:p-6 ${textColor} bg-transparent rounded-[40px] shadow-md transition-all duration-300 hover:shadow-xl max-w-7xl mx-auto border-none outline-none`}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Pharmacy Finder
        </motion.h1>

        {/* Map Section */}
        <motion.div
          className={`w-full h-[400px] rounded-[40px] shadow-md mb-8 transition-all duration-300 hover:shadow-xl border-none outline-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div ref={mapContainerRef} id="pharmacy-map" className="w-full h-full rounded-[40px] overflow-hidden"></div>
        </motion.div>

        {/* Medicine Search */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.input
            type="text"
            placeholder="Search for medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 sm:p-4 rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
            aria-label="Search for medicines"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        {/* Medicine Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-h-[200px]">
          <AnimatePresence mode="wait">
            {medicines.length === 0 && searchQuery ? (
              <motion.p
                className={textColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No medicines found...
              </motion.p>
            ) : (
              medicines.map((med, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, shadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-none outline-none`}
                >
                  <h2 className={`text-lg sm:text-xl font-semibold line-clamp-2 ${textColor}`}>
                    {med.openfda?.brand_name?.[0] || "Unknown Medicine"}
                  </h2>
                  <p className={`text-sm line-clamp-3 ${textColor} opacity-80 mt-2`}>
                    {med.description?.slice(0, 150) || "No description available..."}
                  </p>
                  <p className={`text-xs mt-2 ${textColor} opacity-70`}>
                    Manufacturer: {med.openfda?.manufacturer_name?.[0] || "Unknown"}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Pharmacy;