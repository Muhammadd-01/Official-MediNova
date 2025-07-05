import { useState, useContext, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Phone,
  Ambulance,
  Hospital,
  Heart,
  Wind,
  AmbulanceIcon as FirstAid,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { DarkModeContext } from "../App"

const EmergencyGuide = ({ title, steps }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full p-4 bg-red-100 rounded-lg focus:outline-none"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <ol className="list-decimal list-inside mt-2 p-4 bg-white rounded-lg">
          {steps.map((step, index) => (
            <li key={index} className="mb-2">
              {step.startsWith("-") ? <span className="ml-4">{step.substring(1).trim()}</span> : step}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
      },
      () => setLocationError("Location access denied or not supported.")
    )
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
        "Check the scene for safety.",
        "Tap the person and shout to check for responsiveness.",
        "Call 911 or ask someone to do it.",
        "Check for breathing: look, listen, feel.",
        "Begin chest compressions:",
        "- Hands in center of chest, interlocked.",
        "- Push 2 inches deep at 100–120 per minute.",
        "After 30 compressions, give 2 rescue breaths:",
        "- Tilt head, pinch nose, seal mouth, give 2 slow breaths.",
        "Repeat cycles until help arrives or person revives."
      ]
    },
    choking: {
      title: "How to Help a Choking Person",
      icon: Wind,
      steps: [
        "Confirm they’re choking: can’t breathe or talk.",
        "Give 5 back blows between shoulders.",
        "Then 5 abdominal thrusts (Heimlich):",
        "- Fist above navel, grab with other hand.",
        "- Thrust inward and upward.",
        "Alternate until object is expelled or person faints.",
        "Start CPR if unconscious."
      ]
    },
    bleeding: {
      title: "How to Stop Severe Bleeding",
      icon: FirstAid,
      steps: [
        "Put on gloves if available.",
        "Expose and inspect the wound.",
        "Apply direct pressure with cloth/gauze.",
        "Don’t remove soaked dressing—add layers.",
        "Raise limb above heart if possible.",
        "If bleeding is extreme, apply tourniquet:",
        "- 2–3 inches above wound, not on joint.",
        "- Note time applied.",
        "Keep person calm and still.",
        "Call for emergency help."
      ]
    }
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Emergency services, CPR guides, and live nearby hospital map." />
        <link rel="canonical" href="https://www.medicare.com/emergency" />
      </Helmet>

      <div className={`max-w-4xl mx-auto px-4 ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
        <motion.h1 className="text-3xl font-bold mb-6 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Emergency Services
        </motion.h1>

        <motion.p className="text-xl mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          If you're facing a real medical emergency, call 911 immediately.
        </motion.p>

        {/* Services */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          {emergencyServices.map((service, i) => (
            <motion.div
              key={service.name}
              className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-800" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
            >
              <service.icon className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2 text-center">{service.name}</h2>
              <p className="text-center">
                <a href={`tel:${service.phone}`} className="text-blue-500 hover:underline">{service.phone}</a>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Guides */}
        <motion.h2 className="text-2xl font-semibold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          Emergency Guides
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
          {Object.entries(emergencyGuides).map(([key, guide]) => (
            <EmergencyGuide key={key} title={guide.title} steps={guide.steps} />
          ))}
        </motion.div>

        {/* Map */}
        <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Nearby Hospitals & Clinics</h2>
          {locationError && <p className="text-red-500 text-center">{locationError}</p>}
          {location && (
            <div className="rounded-lg overflow-hidden shadow-md border">
              <MapContainer center={location} zoom={14} style={{ height: "400px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={location}>
                  <Popup>You are here</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
          {!location && !locationError && <p className="text-center text-gray-500">Detecting your location...</p>}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency
