// ✅ Customized Emergency.jsx - Google Maps like features
import { useState, useContext, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Phone,
  Ambulance,
  Hospital,
  Heart,
  Wind,
  Plus,
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
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import L from "leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"

// Fix Leaflet icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full p-4 bg-red-100 dark:bg-blue-800 dark:text-white rounded-lg"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol className="list-decimal list-inside mt-2 p-4 bg-white dark:bg-blue-900 dark:text-white rounded-lg space-y-1 text-sm">
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

      <div className={`max-w-5xl mx-auto px-4 py-8 ${darkMode ? "text-white" : "text-blue-900"}`}>
        <motion.h1 className="text-3xl font-bold mb-6 text-center">Emergency Services</motion.h1>

        <motion.p className="text-xl mb-8 text-center">
          Call emergency numbers. Use guides & location map below.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyServices.map((s, idx) => (
            <motion.div key={s.name} className={`p-6 rounded-lg shadow-md text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <s.icon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p><a href={`tel:${s.phone}`} className="text-blue-500 hover:underline">{s.phone}</a></p>
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
                  <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                </LayersControl.BaseLayer>
              </LayersControl>
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>
              <Circle center={[location.lat, location.lng]} radius={500} pathOptions={{ color: "blue" }} />
              <SearchControl location={location} />
              {hospitals.map((h) => (
                <Marker key={h.id} position={[h.lat, h.lon]}>
                  <Popup>{h.tags.name || "Hospital/Clinic"}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <p className="text-center text-gray-500">Locating you...</p>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency;