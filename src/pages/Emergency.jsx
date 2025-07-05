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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import L from "leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// EmergencyGuide Component
function EmergencyGuide({ title, steps }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full p-4 bg-red-100 dark:bg-red-800 rounded-lg focus:outline-none"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol className="list-decimal list-inside mt-2 p-4 bg-white dark:bg-blue-900 rounded-lg space-y-1 text-sm">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

// SearchControl for GeoSearch
function SearchControl({ location }) {
  const map = useMap()

  useEffect(() => {
    if (!location) return

    const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: "PK", // Limit to Pakistan
      },
    })

    const control = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: "Search nearby hospitals...",
      autoClose: true,
      retainZoomLevel: false,
      showMarker: true,
      updateMap: true,
      keepResult: false,
    })

    map.addControl(control)

    control.getContainer().addEventListener("click", () => {
      map.scrollWheelZoom.disable()
    })

    return () => map.removeControl(control)
  }, [map, location])

  return null
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationError("Location access denied.")
      )
    } else {
      setLocationError("Geolocation not supported.")
    }
  }, [])

  const emergencyServices = [
    { name: "Ambulance", phone: "911", icon: Ambulance },
    { name: "Emergency Room", phone: "(555) 123-4567", icon: Hospital },
    { name: "Poison Control", phone: "(800) 222-1222", icon: Phone },
  ]

  const emergencyGuides = {
    cpr: {
      title: "How to Perform CPR",
      icon: Heart,
      steps: [
        "Ensure the scene is safe.",
        "Tap and shout to check responsiveness.",
        "Call 911 immediately.",
        "Check breathing: if absent, begin CPR.",
        "Give 30 chest compressions followed by 2 rescue breaths.",
        "Repeat cycles until help arrives.",
      ],
    },
    choking: {
      title: "How to Help a Choking Person",
      icon: Wind,
      steps: [
        "Ask 'Are you choking?' If yes, act immediately.",
        "Give 5 sharp back blows between shoulder blades.",
        "Then give 5 abdominal thrusts (Heimlich maneuver).",
        "Repeat until object is expelled or person faints.",
        "If unconscious, start CPR and call emergency services.",
      ],
    },
    bleeding: {
      title: "How to Stop Severe Bleeding",
      icon: Plus,
      steps: [
        "Wear gloves if available.",
        "Apply direct pressure to the wound.",
        "Do not remove soaked cloth — add layers.",
        "Elevate the injured limb above heart level.",
        "Use tourniquet only as last resort.",
        "Seek emergency medical help immediately.",
      ],
    },
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Emergency guides, nearby hospitals, search/filter, and live map." />
      </Helmet>

      <div className={`max-w-5xl mx-auto px-4 py-8 ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
        {/* Title */}
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Emergency Services
        </motion.h1>

        <motion.p
          className="text-xl mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          In an emergency, call 911 immediately.
        </motion.p>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyServices.map((s, i) => (
            <motion.div
              key={s.name}
              className={`p-6 rounded-lg shadow-md text-center ${
                darkMode ? "bg-blue-800" : "bg-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
            >
              <s.icon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p>
                <a href={`tel:${s.phone}`} className="text-blue-500 hover:underline">
                  {s.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Emergency Guides */}
        <motion.h2
          className="text-2xl font-semibold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Emergency Guides
        </motion.h2>
        <div>
          {Object.entries(emergencyGuides).map(([_, guide]) => (
            <EmergencyGuide key={guide.title} title={guide.title} steps={guide.steps} />
          ))}
        </div>

        {/* Map with Search */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Search Nearby Hospitals
          </h2>
          {locationError && <p className="text-red-500 text-center">{locationError}</p>}

          {location ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              scrollWheelZoom={false}
              className="h-[400px] rounded-lg overflow-hidden shadow-lg z-10"
            >
              <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
              <SearchControl location={location} />
            </MapContainer>
          ) : (
            <p className="text-center text-gray-500">Locating your position...</p>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency
