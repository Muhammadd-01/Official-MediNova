import { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext, CartContext } from "../App";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);
  const { cartItems, addToCart } = useContext(CartContext);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode
    ? "bg-[#0A2A43]/60 backdrop-blur-xl"
    : "bg-white/40 backdrop-blur-xl";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/60 text-[#FDFBFB] border-none backdrop-blur-xl"
    : "bg-white/40 text-[#0A3D62] border-none backdrop-blur-xl";

  // Initialize Map
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

          L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup("You are here")
            .openPopup();

          fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => console.error(error)
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
      console.error(err);
    }
  };

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
      if (data.results) {
        const enriched = data.results.map((med) => ({
          ...med,
          price: (Math.random() * 45 + 5).toFixed(2),
          discount: Math.floor(Math.random() * 20),
          stock: Math.floor(Math.random() * 100),
          image: `https://via.placeholder.com/150?text=${med.openfda?.brand_name?.[0] || "Medicine"}`,
        }));
        setMedicines(enriched);
      } else setMedicines([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) fetchMedicines(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.qty * item.price * (1 - item.discount / 100), 0)
    .toFixed(2);

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
              <span className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItems.length}
              </span>
            )}
          </motion.button>
        </div>
      </Header>

      <div className={`min-h-screen pt-20 p-4 sm:p-6 ${textColor} max-w-7xl mx-auto`}>
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Pharmacy
        </motion.h1>

        {/* Map */}
        <motion.div
          className={`w-full h-[400px] rounded-[40px] shadow-md mb-6 ${bgColor} overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div ref={mapContainerRef} className="w-full h-full rounded-[40px] overflow-hidden"></div>
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
            {medicines.length === 0 && searchQuery ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                No medicines found...
              </motion.p>
            ) : (
              medicines.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={med.image}
                    alt={med.openfda?.brand_name?.[0] || "Medicine"}
                    className="w-full h-32 object-cover rounded-2xl mb-3"
                  />
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {med.openfda?.brand_name?.[0] || "Unknown"}
                  </h2>
                  <p className="text-sm mb-1 line-clamp-2">
                    Generic: {med.openfda?.generic_name?.[0] || "Unknown"}
                  </p>
                  <p className="text-sm mb-1">
                    Manufacturer: {med.openfda?.manufacturer_name?.[0] || "Unknown"}
                  </p>
                  <p className="text-sm mb-1">
                    Price: ${med.price} | Discount: {med.discount}% | Stock: {med.stock}
                  </p>
                  <button
                    onClick={() => addToCart({ ...med, qty: 1 })}
                    className="mt-2 px-4 py-2 rounded-[40px] bg-[#0A3D62] text-white hover:bg-[#08253A] hover:shadow-lg transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`fixed top-0 right-0 w-80 h-full ${bgColor} p-6 shadow-xl backdrop-blur-xl rounded-l-3xl z-50 overflow-y-auto`}
            >
              <button
                onClick={() => setCartOpen(false)}
                className="mb-4 text-xl font-bold"
              >
                Close
              </button>
              <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p>Cart is empty</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-3 rounded-2xl bg-white/20 dark:bg-[#0A2A43]/50 backdrop-blur-xl"
                  >
                    <p className="font-semibold">{item.openfda?.brand_name?.[0]}</p>
                    <p className="text-sm">
                      Qty: {item.qty}
                    </p>
                    <p className="text-sm">
                      Price: ${(item.price * item.qty * (1 - item.discount / 100)).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
              {cartItems.length > 0 && (
                <p className="font-bold mt-4">Total: ${totalPrice}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chatbot behind cart */}
      <div className={`${cartOpen ? "z-0" : "z-50"} relative`}>
        <Chatbot />
      </div>
    </>
  );
}

export default Pharmacy;
