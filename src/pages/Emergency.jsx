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
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import L from "leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Emergency Guide Component
function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full p-4 
                   bg-red-100 dark:bg-blue-800 dark:text-white 
                   rounded-lg focus:outline-none"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol className="list-decimal list-inside mt-2 p-4 
                      bg-white dark:bg-blue-900 dark:text-white 
                      rounded-lg space-y-1 text-sm">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

// Search Control
function SearchControl({ location }) {
  const map = useMap()
  useEffect(() => {
    if (!location) return
    const provider = new OpenStreetMapProvider({ params: { countrycodes: "pk" } })
    const control = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: "Search nearby hospitals/clinics...",
      autoClose: true,
      showMarker: false,
      retainZoomLevel: false,
      updateMap: false,
    })
    map.addControl(control)
    control.getContainer().addEventListener("click", () => map.scrollWheelZoom.disable())
    return () => map.removeControl(control)
  }, [map, location])
  return null
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [lockedHospital, setLockedHospital] = useState(null)

  // Track user location live
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

  // Fetch hospitals nearby
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
    { name: "Ambulance", phone: "911", icon: Ambulance },
    { name: "Emergency Room", phone: "(555) 123-4567", icon: Hospital },
    { name: "Poison Control", phone: "(800) 222-1222", icon: Phone },
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
        <motion.h1 className="text-3xl font-bold mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Emergency Services
        </motion.h1>

        <motion.p className="text-xl mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Call 911 in an emergency. Use guides & map below.
        </motion.p>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyServices.map((s, idx) => (
            <motion.div
              key={s.name}
              className={`p-6 rounded-lg shadow-md text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * idx }}
            >
              <s.icon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p><a href={`tel:${s.phone}`} className="text-blue-500 hover:underline">{s.phone}</a></p>
            </motion.div>
          ))}
        </div>

        {/* Guides */}
        <motion.h2 className="text-2xl font-semibold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Emergency Guides
        </motion.h2>
        {Object.entries(emergencyGuides).map(([k, g]) => (
          <EmergencyGuide key={k} title={g.title} steps={g.steps} />
        ))}

        {/* Map */}
        <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-2xl mb-4 text-center">Nearby Hospitals & Clinics</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {location ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              scrollWheelZoom={false}
              className="h-[450px] rounded-lg overflow-hidden shadow-lg z-0"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>Your Location</Popup>
              </Marker>

              {hospitals.map((h) => (
                <Marker
                  key={h.id}
                  position={[h.lat, h.lon]}
                  eventHandlers={{
                    dblclick: () => setLockedHospital({ lat: h.lat, lng: h.lon, name: h.tags.name || "Selected Hospital" }),
                  }}
                >
                  <Popup>{h.tags.name || "Clinic / Hospital"}</Popup>
                </Marker>
              ))}

              <SearchControl location={location} />

              {/* Direction Polyline */}
              {lockedHospital && (
                <Polyline positions={[[location.lat, location.lng], [lockedHospital.lat, lockedHospital.lng]]} color="blue" />
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
