import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../App";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Header and Footer
import Header from "../components/Header";
import Footer from "../components/Footer";

function Pharmacy() {
  const { darkMode } = useContext(DarkModeContext);

  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);

  // Initialize Map
  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("pharmacy-map").setView([30.3753, 69.3451], 13); // Pakistan default

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://osm.org">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      setMap(mapInstance);
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        map?.setView([latitude, longitude], 15);

        // User marker
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        // Fetch nearby pharmacies
        fetchNearbyPharmacies(latitude, longitude);
      });
    }
  }, [map]);

  // Fetch nearby pharmacies from Overpass API
  const fetchNearbyPharmacies = async (lat, lon) => {
    const query = `
      [out:json];
      node["amenity"="pharmacy"](around:3000,${lat},${lon});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.elements) {
      setPharmacies(data.elements);

      data.elements.forEach((pharmacy) => {
        if (map) {
          L.marker([pharmacy.lat, pharmacy.lon])
            .addTo(map)
            .bindPopup(pharmacy.tags.name || "Pharmacy");
        }
      });
    }
  };

  // Search medicines from FDA API
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
      {/* Header */}
      <Header />

      <div
        className={`min-h-screen pt-24 px-4 transition-colors duration-300 ${
          darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#0A2A43]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">Pharmacy Finder</h1>

        {/* Map Section */}
        <div id="pharmacy-map" className="w-full h-[400px] rounded-2xl shadow-md mb-8"></div>

        {/* Medicine Search */}
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

        {/* Medicine Results */}
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

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Pharmacy;
