import { useState, useContext, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Phone,
  Ambulance,
  Hospital,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { DarkModeContext } from "../App"
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import L from "leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// 🔸 Distance Function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(2)
}

function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { darkMode } = useContext(DarkModeContext)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex justify-between items-center w-full p-4 rounded-lg ${
          darkMode
            ? "bg-[#0A2A43] text-[#FDFBFB]"
            : "bg-red-100 text-[#1E3A8A]"
        }`}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol
          className={`list-decimal list-inside mt-2 p-4 rounded-lg space-y-1 text-sm ${
            darkMode
              ? "bg-[#0A2A43] text-[#FDFBFB]"
              : "bg-white text-[#1E3A8A]"
          }`}
        >
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

function SearchControl({ location }) {
  const map = useMap()
  useEffect(() => {
    if (!location) return
    const provider = new OpenStreetMapProvider({ params: { countrycodes: "pk" } })
    const control = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: "Search hospitals...",
      autoClose: true,
      showMarker: false,
    })
    map.addControl(control)
    return () => map.removeControl(control)
  }, [map, location])
  return null
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [selectedHospital, setSelectedHospital] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.")
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(loc)
        fetchHospitals(loc)
      },
      () => setError("Location access denied."),
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const fetchHospitals = async (loc) => {
    const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:5000,${loc.lat},${loc.lng});
  node["amenity"="clinic"](around:5000,${loc.lat},${loc.lng});
);
out body;
`
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      })
      const json = await res.json()
      setHospitals(json.elements)
    } catch {
      setError("Failed to fetch nearby hospitals.")
    }
  }

  const emergencyServices = [
    { name: "Edhi Ambulance", phone: "115", icon: Ambulance },
    { name: "Chhipa Ambulance", phone: "1020", icon: Ambulance },
    { name: "Rescue 1122", phone: "1122", icon: Hospital },
    { name: "Police Emergency", phone: "15", icon: Phone },
    { name: "Fire Brigade", phone: "16", icon: Phone },
    { name: "Bomb Disposal", phone: "1717", icon: Phone },
    { name: "Poison Control", phone: "(021) 99215718", icon: Phone },
  ]

  const emergencyGuides = {
    cpr: {
      title: "How to Perform CPR",
      steps: [
        "Ensure scene safety.",
        "Tap & shout.",
        "Call 911.",
        "Check breathing.",
        "30 compressions + 2 breaths cycles.",
      ],
    },
    choking: {
      title: "Help Choking Person",
      steps: [
        "Ask if choking.",
        "5 back blows.",
        "5 abdominal thrusts.",
        "Repeat or start CPR.",
      ],
    },
    bleeding: {
      title: "Stop Severe Bleeding",
      steps: [
        "Wear gloves.",
        "Press on wound.",
        "Add layers.",
        "Elevate limb.",
        "Tourniquet if needed.",
        "Call emergency services.",
      ],
    },
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Emergency guides & live map with nearby hospitals/clinics." />
      </Helmet>

      <div className={`max-w-5xl mx-auto px-4 py-8 ${darkMode ? "text-[#FDFBFB]" : "text-[#1E3A8A]"}`}>
        <motion.h1 className="text-3xl font-bold mb-6 text-center">Emergency Services</motion.h1>

        <motion.p className="text-xl mb-8 text-center">
          Call emergency numbers. Use guides & location map below.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyServices.map((s) => (
            <motion.div
              key={s.name}
              className={`p-6 rounded-lg shadow-md text-center ${
                darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#1E3A8A]"
              }`}
            >
              <s.icon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p>
                <a href={`tel:${s.phone}`} className="hover:underline">
                  {s.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </div>

        <motion.h2 className="text-2xl font-semibold mb-4">Emergency Guides</motion.h2>
        {Object.entries(emergencyGuides).map(([k, g]) => (
          <EmergencyGuide key={k} title={g.title} steps={g.steps} />
        ))}

        <motion.div className="mt-12">
          <h2 className="text-2xl mb-4 text-center">Nearby Hospitals & Clinics</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {location ? (
            <MapContainer center={[location.lat, location.lng]} zoom={15} className="h-[450px] rounded-lg shadow-lg">
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Standard">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>
              <Circle center={[location.lat, location.lng]} radius={500} pathOptions={{ color: "#1E3A8A" }} />
              <SearchControl location={location} />
              {hospitals.map((h) => {
                const distance = location
                  ? calculateDistance(location.lat, location.lng, h.lat, h.lon)
                  : null
                return (
                  <Marker
                    key={h.id}
                    position={[h.lat, h.lon]}
                    eventHandlers={{
                      dblclick: () => setSelectedHospital(h),
                    }}
                  >
                    <Popup>
                      <strong>{h.tags.name || "Hospital/Clinic"}</strong><br />
                      {distance && <>Distance: {distance} km<br /></>}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${h.lat},${h.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Open in Google Maps
                      </a>
                    </Popup>
                  </Marker>
                )
              })}
              {selectedHospital && (
                <>
                  <Polyline
                    positions={[
                      [location.lat, location.lng],
                      [selectedHospital.lat, selectedHospital.lon],
                    ]}
                    pathOptions={{ color: "red" }}
                  />
                  <Marker
                    position={[selectedHospital.lat, selectedHospital.lon]}
                    icon={L.divIcon({
                      className: "custom-selected-marker",
                      html: `<div style="color: white; background-color: red; border-radius: 8px; padding: 4px">Locked</div>`,
                    })}
                  />
                </>
              )}
            </MapContainer>
          ) : (
            <p className="text-center text-gray-500">Locating you...</p>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency
