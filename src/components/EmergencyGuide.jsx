import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const emergencyGuides = {
  cpr: {
    title: "How to Perform CPR",
    steps: [
      "Check the scene for safety",
      "Check for responsiveness",
      "Call for help (911 or local emergency number)",
      "Open the airway",
      "Check for breathing",
      "Begin chest compressions",
      "Give rescue breaths",
      "Continue CPR until help arrives",
    ],
  },
  choking: {
    title: "How to Help a Choking Person",
    steps: [
      "Encourage them to cough",
      "Bend them forward",
      "Give 5 back blows",
      "Give 5 abdominal thrusts (Heimlich maneuver)",
      "Alternate between back blows and abdominal thrusts",
      "If the person becomes unconscious, start CPR",
    ],
  },
  bleeding: {
    title: "How to Stop Severe Bleeding",
    steps: [
      "Apply direct pressure to the wound",
      "Use a clean cloth or sterile gauze",
      "Maintain pressure for 15 minutes",
      "Elevate the injured area if possible",
      "Add more cloth if blood soaks through",
      "Secure the dressing with a bandage",
      "Seek medical attention",
    ],
  },
}

function EmergencyGuide() {
  const [selectedGuide, setSelectedGuide] = useState(null)

  return (
    <div className="bg-red-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-800">Emergency Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {Object.keys(emergencyGuides).map((guide) => (
          <button
            key={guide}
            onClick={() => setSelectedGuide(guide)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            {emergencyGuides[guide].title}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{emergencyGuides[selectedGuide].title}</h3>
            <ol className="list-decimal list-inside">
              {emergencyGuides[selectedGuide].steps.map((step, index) => (
                <li key={index} className="mb-2">
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmergencyGuide

