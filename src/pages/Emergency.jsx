// ✅ Emergency.jsx (Full Refactored with Google Maps-like Leaflet UI + Smart Search + Directions)

import { useState, useContext, useEffect, useRef } from "react"
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

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
        <ol className="list-decimal mt-2 p-4 bg-white dark:bg-blue-900 dark:text-white rounded-lg space-y-1 text-sm">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.")
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
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
out body;`

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      })
      const json = await res.json()
      setHospitals(json.elements)
    } catch (e) {
      setError("Failed to fetch nearby hospitals.")
    }
  }

  const getRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    const data = await res.json()
    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
    setRouteCoords(coords)
  }

  const filteredHospitals = hospitals.filter((h) => {
    const name = h.tags?.name?.toLowerCase() || ""
    return name.includes(searchTerm.toLowerCase())
  })

  const emergencyServices = [
    { name: "Edhi Ambulance", phone: "115", icon: Ambulance },
    { name: "Chhipa Ambulance", phone: "1020", icon: Ambulance },
    { name: "Rescue 1122", phone: "1122", icon: Hospital },
    { name: "Police Emergency", phone: "15", icon: Phone },
    { name: "Fire Brigade", phone: "16", icon: Phone },
    { name: "Terrorism / Bomb Squad", phone: "1717", icon: Phone },
  ]

  const emergencyGuides = {
    cpr: {
      title: "How to Perform CPR",
      steps: [
        "Ensure scene safety.",
        "Tap & shout.",
        "Call 911.",
        "Check breathing.",
        "30 compressions + 2 breaths.",
      ],
    },
    choking: {
      title: "Help Choking Person",
      steps: ["Ask if choking.", "5 back blows.", "5 abdominal thrusts.", "Repeat or start CPR."],
    },
    bleeding: {
      title: "Stop Severe Bleeding",
      steps: [
        "Wear gloves.",
        "Press on wound.",
        "Add cloth layers.",
        "Elevate limb.",
        "Use tourniquet if needed.",
      ],
    },
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${darkMode ? "text-white" : "text-blue-900"}`}>
      <Helmet>
        <title>Emergency Services - MediCare</title>
      </Helmet>

      <motion.h1 className="text-3xl font-bold mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Emergency Services
      </motion.h1>

      <motion.p className="text-lg mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        Call trusted services. Use the live location map below.
      </motion.p>

      {/* Emergency Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {emergencyServices.map((s, i) => (
          <motion.div
            key={s.name}
            className={`p-5 rounded-xl text-center shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
          >
            <s.icon className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <a href={`tel:${s.phone}`} className="text-blue-500 hover:underline">
              {s.phone}
            </a>
          </motion.div>
        ))}
      </div>

      {/* Guides */}
      <h2 className="text-xl font-semibold mb-3">Emergency Guides</h2>
      {Object.entries(emergencyGuides).map(([k, g]) => (
        <EmergencyGuide key={k} title={g.title} steps={g.steps} />
      ))}

      {/* Search Input */}
      <div className="my-4 text-center">
        <input
          type="text"
          placeholder="Search hospital or clinic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-full border w-full max-w-md shadow"
        />
      </div>

      {/* Live Map */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2 text-center">Live Hospital Map</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {location ? (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            scrollWheelZoom={true}
            className="h-[500px] rounded-xl shadow-xl z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="© OpenStreetMap, © CartoDB"
            />
            <Circle center={location} radius={100} color="blue" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            {filteredHospitals.map((h) => (
              <Marker
                key={h.id}
                position={[h.lat, h.lon]}
                eventHandlers={{
                  click: () => {
                    setSelectedHospital(h)
                    getRoute(location, h)
                  },
                }}
              >
                <Popup>{h.tags.name || "Unnamed Clinic/Hospital"}</Popup>
              </Marker>
            ))}
            {routeCoords.length > 0 && <Polyline positions={routeCoords} color="red" />}
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">Fetching location...</p>
        )}
      </div>
    </div>
  )
}

export default Emergency
