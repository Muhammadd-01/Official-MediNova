import { useEffect, useState, useContext, useRef } from "react";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);

  const mapRef = useRef(null); // ✅ map instance
  const mapContainerRef = useRef(null); // ✅ DOM ref
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);

  // ✅ Initialize Map Once
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([30.3753, 69.3451], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://osm.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // ✅ Get user location
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition((pos) => {
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
      });
    }
  }, []);

  // ✅ Fetch pharmacies
  const fetchNearbyPharmacies = async (lat, lon) => {
    const query = `
      [out:json];
      node["amenity"="pharmacy"](around:3000,${lat},${lon});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
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
  };

  // ✅ Fetch medicines
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

  // ✅ Debounce medicine search
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
        className={`min-h-screen pt-20 px-4 transition-colors duration-300 ${
          darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#0A2A43]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">Pharmacy Finder</h1>

        {/* ✅ Map Section */}
        <div
          ref={mapContainerRef}
          id="pharmacy-map"
          className="w-full h-[400px] rounded-2xl shadow-md mb-8"
        ></div>

        {/* ✅ Medicine Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-[#081F5C] border-gray-700 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            }`}
          />
        </div>

        {/* ✅ Medicine Results */}
        <div className="grid gap-4 md:grid-cols-2">
          {medicines.map((med, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? "bg-[#081F5C]" : "bg-gray-50"
              }`}
            >
              <h2 className="text-lg font-semibold">
                {med.openfda?.brand_name?.[0] || "Unknown Medicine"}
              </h2>
              <p className="text-sm mt-2">
                {med.description?.slice(0, 150) || "No description available..."}
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Manufacturer: {med.openfda?.manufacturer_name?.[0] || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pharmacy;
