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
              {step}
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => setLocationError("Location access denied.")
      )
    } else {
      setLocationError("Geolocation not supported.")
    }
  }, [])

  const googleMapsUrl = location
    ? `https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_API_KEY&q=hospitals&center=${location.lat},${location.lng}&zoom=14`
    : null

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
        "Tap and shout to check for responsiveness.",
        "Call 911 immediately.",
        "Check for breathing: look, listen, feel.",
        "Begin compressions: push hard and fast on the center of the chest.",
        "30 compressions followed by 2 rescue breaths.",
        "Repeat the cycle until help arrives or the person recovers."
      ],
    },
    choking: {
      title: "How to Help a Choking Person",
      icon: Wind,
      steps: [
        "Ask 'Are you choking?'.",
        "If yes, give 5 back blows between shoulder blades.",
        "If ineffective, perform Heimlich maneuver (abdominal thrusts).",
        "Alternate 5 back blows and 5 thrusts.",
        "If unconscious, begin CPR.",
        "Call emergency services."
      ],
    },
    bleeding: {
      title: "How to Stop Severe Bleeding",
      icon: FirstAid,
      steps: [
        "Wear gloves if available.",
        "Expose and inspect the wound.",
        "Apply direct pressure with a clean cloth or gauze.",
        "Elevate the injured area if possible.",
        "If bleeding doesn’t stop, add layers of cloth — don’t remove soaked ones.",
        "Use a tourniquet only if bleeding is life-threatening.",
        "Seek immediate medical attention."
      ],
    },
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta name="description" content="Access emergency services and find nearby hospitals." />
        <link rel="canonical" href="https://www.medicare.com/emergency" />
        <meta property="og:title" content="Emergency Medical Services - MediCare" />
      </Helmet>

      <div className={`max-w-4xl mx-auto ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
        <motion.h1 className="text-3xl font-bold mb-6 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Emergency Services
        </motion.h1>
        <motion.p className="text-xl mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          If you're in a medical emergency, call 911 immediately.
        </motion.p>

        {/* Emergency Services Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          {emergencyServices.map((service, index) => (
            <motion.div key={service.name} className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-800" : "bg-white"}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}>
              <service.icon className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2 text-center">{service.name}</h2>
              <p className="text-center">
                <a href={`tel:${service.phone}`} className="text-blue-500 hover:underline">
                  {service.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Emergency Guides */}
        <motion.h2 className="text-2xl font-semibold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          Emergency Guides
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
          {Object.entries(emergencyGuides).map(([key, guide]) => (
            <EmergencyGuide key={key} title={guide.title} steps={guide.steps} />
          ))}
        </motion.div>

        {/* When to Seek Emergency */}
        <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <h2 className="text-2xl font-semibold mb-4">When to Seek Emergency Care</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Chest pain or difficulty breathing</li>
            <li>Severe bleeding or head trauma</li>
            <li>Loss of consciousness</li>
            <li>Severe burns or poisoning</li>
            <li>Broken bones or dislocated joints</li>
            <li>Severe allergic reactions</li>
            <li>Sudden severe headache or vision problems</li>
            <li>Sudden weakness or numbness</li>
            <li>Seizures</li>
            <li>Severe abdominal pain</li>
          </ul>
        </motion.div>

        {/* Nearby Hospital Map */}
        <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Nearby Hospitals & Clinics</h2>
          {locationError && <p className="text-red-500 text-center">{locationError}</p>}
          {location && googleMapsUrl && (
            <div className="rounded-lg overflow-hidden shadow-md border">
              <iframe
                title="Nearby Hospitals"
                width="100%"
                height="450"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
                src={googleMapsUrl}
              ></iframe>
            </div>
          )}
          {!location && !locationError && <p className="text-center text-gray-500">Detecting your location...</p>}
        </motion.div>
      </div>
    </>
  )
}

export default Emergency
