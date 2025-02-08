import { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
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
  const [selectedGuide, setSelectedGuide] = useState(null)

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
        "Check the scene for safety",
        "Check for responsiveness by tapping the person and shouting 'Are you okay?'",
        "If unresponsive, call 911 or ask someone else to do it",
        "Check for breathing: look for chest movement, listen for breath sounds, and feel for air from the nose or mouth",
        "If not breathing normally, begin chest compressions:",
        "- Place the heel of one hand on the center of the chest",
        "- Place the other hand on top and interlock fingers",
        "- Keep arms straight and position shoulders directly above hands",
        "- Push hard and fast at a rate of 100-120 compressions per minute",
        "- Allow the chest to fully recoil between compressions",
        "After 30 compressions, give 2 rescue breaths:",
        "- Tilt the head back and lift the chin",
        "- Pinch the nose shut and create a seal over the mouth",
        "- Give 2 breaths, each lasting about 1 second",
        "Continue cycles of 30 compressions and 2 breaths until help arrives or the person starts breathing normally",
      ],
    },
    choking: {
      title: "How to Help a Choking Person",
      icon: Wind,
      steps: [
        "Recognize signs of choking: inability to speak, cough, or breathe",
        "Ask the person 'Are you choking?' If they nod yes, take action",
        "Stand behind the person and slightly to one side",
        "Support their chest with one hand and lean them forward",
        "Give up to 5 sharp back blows between the shoulder blades with the heel of your hand",
        "If back blows don't work, perform abdominal thrusts (Heimlich maneuver):",
        "- Stand behind the person and wrap your arms around their waist",
        "- Make a fist with one hand and place it just above the navel",
        "- Grasp your fist with the other hand",
        "- Press hard into the abdomen with quick, upward thrusts",
        "Alternate between 5 back blows and 5 abdominal thrusts",
        "If the person becomes unconscious, lower them to the ground and begin CPR",
        "Continue until the object is expelled or emergency help arrives",
      ],
    },
    bleeding: {
      title: "How to Stop Severe Bleeding",
      icon: FirstAid,
      steps: [
        "Ensure your own safety and wear protective gloves if available",
        "Expose the wound by removing or cutting away clothing",
        "Apply direct pressure to the wound using a clean cloth or sterile gauze",
        "If blood soaks through, add more layers without removing the original dressing",
        "Elevate the injured area above the heart if possible",
        "For limb injuries, locate the pressure point above the wound (e.g., inside of the upper arm for arm wounds)",
        "Apply firm pressure to the pressure point while maintaining direct pressure on the wound",
        "If bleeding is life-threatening, consider applying a tourniquet as a last resort:",
        "- Place the tourniquet 2-3 inches above the wound, not on a joint",
        "- Tighten until bleeding stops",
        "- Note the time of application",
        "Secure the dressing with a bandage",
        "Keep the person calm and lying down",
        "Monitor for signs of shock (pale, cool, clammy skin; rapid breathing; weakness)",
        "Seek immediate medical attention or call emergency services",
      ],
    },
  }

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta
          name="description"
          content="Access emergency medical services, important contact information, and step-by-step guides for common emergencies. Available 24/7 for your safety."
        />
        <link rel="canonical" href="https://www.medicare.com/emergency" />
        <meta property="og:title" content="Emergency Medical Services - MediCare" />
        <meta
          property="og:description"
          content="Quick access to emergency services, contact information, and guides for immediate medical assistance."
        />
        <meta property="og:url" content="https://www.medicare.com/emergency" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`max-w-4xl mx-auto ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Emergency Services
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          If you are experiencing a medical emergency, please call 911 immediately.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {emergencyServices.map((service, index) => (
            <motion.div
              key={service.name}
              className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-800" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
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

        <motion.h2
          className="text-2xl font-semibold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Emergency Guides
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
          {Object.entries(emergencyGuides).map(([key, guide]) => (
            <EmergencyGuide key={key} title={guide.title} steps={guide.steps} />
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 ${
                darkMode ? "text-blue-100" : "text-blue-900"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-4">{emergencyGuides[selectedGuide].title}</h3>
              <ol className="list-decimal list-inside space-y-2">
                {emergencyGuides[selectedGuide].steps.map((step, index) => (
                  <li key={index} className="mb-2">
                    {step.startsWith("-") ? <span className="ml-4">{step.substring(1).trim()}</span> : step}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4">When to Seek Emergency Care</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Chest pain or difficulty breathing</li>
            <li>Severe bleeding or head trauma</li>
            <li>Loss of consciousness</li>
            <li>Severe burns or poisoning</li>
            <li>Broken bones or dislocated joints</li>
            <li>Severe allergic reactions</li>
            <li>Sudden severe headache or vision problems</li>
            <li>Sudden weakness or numbness, especially on one side of the body</li>
            <li>Seizures</li>
            <li>Severe abdominal pain</li>
          </ul>
        </motion.div>
      </div>
    </>
  )
}

export default Emergency

