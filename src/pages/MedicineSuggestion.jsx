import React, { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

const symptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Sore throat",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Shortness of breath",
  "Muscle pain",
  "Loss of taste or smell",
]

const allergies = ["Penicillin", "Aspirin", "Ibuprofen", "Sulfa drugs", "Latex"]

const medicineData = {
  Acetaminophen: {
    image: "https://www.drugs.com/images/pills/nlm/004780001.jpg",
    description: "Pain reliever and fever reducer",
    dosage: "325-650 mg every 4-6 hours as needed",
    sideEffects: ["Nausea", "Stomach pain", "Loss of appetite", "Headache"],
  },
  Ibuprofen: {
    image: "https://www.drugs.com/images/pills/nlm/006720160.jpg",
    description: "Nonsteroidal anti-inflammatory drug (NSAID)",
    dosage: "200-400 mg every 4-6 hours as needed",
    sideEffects: ["Stomach upset", "Dizziness", "Mild heartburn", "Rash"],
  },
  Loratadine: {
    image: "https://www.drugs.com/images/pills/nlm/005190858.jpg",
    description: "Antihistamine for allergy relief",
    dosage: "10 mg once daily",
    sideEffects: ["Headache", "Dry mouth", "Fatigue", "Stomach pain"],
  },
}

function MedicineSuggestion() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    symptoms: [],
    allergies: [],
    medicalHistory: "",
    currentMedications: "",
  })
  const [suggestions, setSuggestions] = useState(null)
  const { darkMode } = useContext(DarkModeContext)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [category]: checked ? [...prevData[category], value] : prevData[category].filter((item) => item !== value),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would call an API here
    // For this example, we'll use mock data
    const suggestedMedicines = Object.keys(medicineData)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)

    setSuggestions({
      primarySuggestion: suggestedMedicines[0],
      alternativeSuggestions: [suggestedMedicines[1]],
      precautions: "Take with food. Avoid alcohol consumption.",
      possibleSideEffects: medicineData[suggestedMedicines[0]].sideEffects,
    })
  }

  return (
    <>
      <Helmet>
        <title>Medicine Suggestions - MediCare</title>
        <meta
          name="description"
          content="Get personalized medicine suggestions based on your symptoms. Safe dosage recommendations for various conditions."
        />
        <link rel="canonical" href="https://www.medicare.com/medicine-suggestion" />
        <meta property="og:title" content="Personalized Medicine Suggestions - MediCare" />
        <meta
          property="og:description"
          content="Get safe and effective medicine recommendations based on your symptoms."
        />
        <meta property="og:url" content="https://www.medicare.com/medicine-suggestion" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`max-w-4xl mx-auto ${darkMode ? "text-white" : "text-gray-800"}`}>
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Medicine Suggestion
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block mb-2">
                Age:
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block mb-2">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-gray-800"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="weight" className="block mb-2">
                Weight (kg):
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="height" className="block mb-2">
                Height (cm):
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Symptoms:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptoms.map((symptom) => (
                <div key={symptom}>
                  <input
                    type="checkbox"
                    id={`symptom-${symptom}`}
                    name={`symptom-${symptom}`}
                    value={symptom}
                    checked={formData.symptoms.includes(symptom)}
                    onChange={(e) => handleCheckboxChange(e, "symptoms")}
                    className="mr-2"
                  />
                  <label htmlFor={`symptom-${symptom}`}>{symptom}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">Allergies:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allergies.map((allergy) => (
                <div key={allergy}>
                  <input
                    type="checkbox"
                    id={`allergy-${allergy}`}
                    name={`allergy-${allergy}`}
                    value={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onChange={(e) => handleCheckboxChange(e, "allergies")}
                    className="mr-2"
                  />
                  <label htmlFor={`allergy-${allergy}`}>{allergy}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="medicalHistory" className="block mb-2">
              Medical History:
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label htmlFor="currentMedications" className="block mb-2">
              Current Medications:
            </label>
            <textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-gray-800"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Get Suggestions
          </button>
        </motion.form>

        {suggestions && (
          <motion.div
            className={`bg-white p-6 rounded-lg shadow-md ${darkMode ? "text-gray-800" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Suggested Medicines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-2">
                  <strong>Primary Suggestion:</strong> {suggestions.primarySuggestion}
                </p>
                <img
                  src={medicineData[suggestions.primarySuggestion].image || "/placeholder.svg"}
                  alt={suggestions.primarySuggestion}
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                />
                <p className="mb-2">
                  <strong>Description:</strong> {medicineData[suggestions.primarySuggestion].description}
                </p>
                <p className="mb-2">
                  <strong>Dosage:</strong> {medicineData[suggestions.primarySuggestion].dosage}
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Alternative Suggestions:</strong> {suggestions.alternativeSuggestions.join(", ")}
                </p>
                <p className="mb-2">
                  <strong>Precautions:</strong> {suggestions.precautions}
                </p>
                <p className="mb-2">
                  <strong>Possible Side Effects:</strong> {suggestions.possibleSideEffects.join(", ")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Please consult with a healthcare professional before taking any medication.
            </p>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default MedicineSuggestion

