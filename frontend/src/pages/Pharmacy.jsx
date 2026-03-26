"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext, CartContext, NotificationContext } from "../App";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { Loader2 } from "lucide-react";

// Static list of Pakistani banks for bank transfer
const pakistaniBanks = [
  { name: "Habib Bank Limited (HBL)", details: "IBAN: PK60HBLT0000000012345678, SWIFT: HABBPKKA" },
  { name: "United Bank Limited (UBL)", details: "IBAN: PK70UBLP0000000023456789, SWIFT: UBPAKKAH" },
  { name: "Meezan Bank", details: "IBAN: PK36MEZAN0000000034567890, SWIFT: MEZNPKKA" },
  { name: "MCB Bank", details: "IBAN: PK40MCB0000000045678901, SWIFT: MUCBPKKA" },
  { name: "Allied Bank", details: "IBAN: PK50ABPA0000000056789012, SWIFT: ABPAPKKA" },
];

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);
  const { cartItems, addToCart: addToLocalCart, totalPrice } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [quantities, setQuantities] = useState({}); // store quantity per medicine id

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode
    ? "bg-[#0A2A43]/60 backdrop-blur-xl"
    : "bg-white/40 backdrop-blur-xl";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/60 text-[#FDFBFB] border-none backdrop-blur-xl"
    : "bg-white/40 text-[#0A3D62] border-none backdrop-blur-xl";

  // Initialize map
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([30.3753, 69.3451], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://osm.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 15);
          L.marker([latitude, longitude]).addTo(mapRef.current).bindPopup("You are here").openPopup();
          fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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
    } catch (err) {
      console.error("Pharmacy fetch error:", err);
    }
  };

  const fetchMedicines = async (query, country) => {
    if (!query) {
      setMedicines([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
        query
      )}+openfda.generic_name:${encodeURIComponent(query)}&limit=10`;
      let res = await fetch(url);
      let data = await res.json();

      if (!data.results || data.results.length === 0) {
        url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=10`;
        res = await fetch(url);
        data = await res.json();
      }

      if (data.results) {
        const enriched = data.results
          .filter((med) => (country !== "USA" ? true : med.openfda?.manufacturer_name?.[0]))
          .map((med) => ({
            id: med.id || Math.random().toString(36).slice(2),
            name: med.openfda?.brand_name?.[0] || med.openfda?.generic_name?.[0] || "Unknown",
            price: (Math.random() * 45 + 5).toFixed(2),
            quantity: 1,
            discount: Math.floor(Math.random() * 20),
            stock: Math.floor(Math.random() * 100),
            image: `https://via.placeholder.com/150?text=${med.openfda?.brand_name?.[0] || med.openfda?.generic_name?.[0] || "Medicine"}`,
            country: country,
            generic_name: med.openfda?.generic_name?.[0] || "Unknown",
            manufacturer: med.openfda?.manufacturer_name?.[0] || "Unknown",
          }));
        setMedicines(enriched);
        // Initialize quantity for each medicine
        const initialQuantities = {};
        enriched.forEach((med) => {
          initialQuantities[med.id] = 1;
        });
        setQuantities(initialQuantities);
      } else {
        setMedicines([]);
      }
    } catch (err) {
      console.error("Medicine fetch error:", err);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) fetchMedicines(searchQuery, selectedCountry);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCountry]);

  // Add to Cart + Notification with quantity
  const addToCart = async (med) => {
    const qty = quantities[med.id] || 1;
    addToLocalCart({ ...med, quantity: qty });
    showNotification(`${med.name} (x${qty}) added to cart`, "success");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fdaId: med.id,
          name: med.name,
          manufacturer: med.manufacturer,
          dosage: med.generic_name,
          quantity: qty,
          price: med.price,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add cart item");
      console.log("Added to backend cart:", data);
    } catch (err) {
      console.error("Add to cart backend error:", err);
      showNotification(`Failed to add ${med.name} to cart`, "error");
    }
  };

  return (
    <>
      <Header>
        <div className="absolute left-4 top-4">
          <motion.button
            onClick={() => setCartOpen(true)}
            whileTap={{ scale: 0.9, rotate: -5 }}
            whileHover={{ scale: 1.1 }}
            className="relative p-2 rounded-full bg-[#0A3D62]/60 text-white border border-white/20"
          >
            <FiShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItems.length}
              </span>
            )}
          </motion.button>
        </div>
      </Header>

      <div className={`min-h-screen pt-20 p-4 sm:p-6 ${textColor} max-w-7xl mx-auto`}>
        {/* Coming Soon Heading with Looping Animation */}
        <motion.h1
          className={`text-6xl sm:text-7xl font-extrabold mb-12 text-center ${textColor} tracking-tight`}
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Coming Soon
        </motion.h1>

        <motion.h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Pharmacy
        </motion.h1>

        {/* Map */}
        <motion.div className={`w-full h-[400px] rounded-[40px] shadow-md mb-6 ${bgColor} overflow-hidden`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div ref={mapContainerRef} className="w-full h-full rounded-[40px] overflow-hidden"></div>
        </motion.div>

        {/* Country Selector */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="country">Select Country</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full p-4 rounded-[40px] ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
          >
            <option value="USA">USA</option>
            <option value="Other">Other (All Available)</option>
          </select>
        </motion.div>

        {/* Search */}
        <motion.input
          type="text"
          placeholder="Search for medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-4 mb-6 rounded-[40px] ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`}
        />

        {/* Medicine Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p>Loading medicines...</p>
              </motion.div>
            ) : medicines.length === 0 && searchQuery ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No medicines found...</motion.p>
            ) : (
              medicines.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={med.image} alt={med.name} className="w-full h-32 object-cover rounded-2xl mb-3" />
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">{med.name}</h2>
                  <p className="text-sm mb-1 line-clamp-2">Generic: {med.generic_name}</p>
                  <p className="text-sm mb-1">Manufacturer: {med.manufacturer}</p>
                  <p className="text-sm mb-1">Country: {med.country}</p>
                  <p className="text-sm mb-1">Price: ${med.price} | Discount: {med.discount}% | Stock: {med.stock}</p>

                  {/* Quantity Selector + Add to Cart */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      max={med.stock}
                      value={quantities[med.id] || 1}
                      onChange={(e) => setQuantities({ ...quantities, [med.id]: parseInt(e.target.value) })}
                      className="w-16 p-2 rounded-xl border border-gray-300 text-center"
                    />
                    <button
                      onClick={() => addToCart(med)}
                      className="bg-[#0D3B66] text-white px-4 py-2 rounded-xl hover:bg-[#081F5C]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <Chatbot />
    </>
  );
}

export default Pharmacy;