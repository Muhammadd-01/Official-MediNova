import React, { useState } from "react"
import { Helmet } from "react-helmet-async"

function MedicineSuggestion() {
  const [symptoms, setSymptoms] = useState("")
  const [suggestions, setSuggestions] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would call an API here
    // For this example, we'll use mock data
    setSuggestions({
      low: "Acetaminophen 500mg",
      medium: "Ibuprofen 400mg",
      high: "Naproxen 500mg",
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Medicine Suggestion</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="symptoms" className="block mb-2">
            Describe your symptoms:
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Get Suggestions
          </button>
        </form>

        {suggestions && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Suggested Medicines</h2>
            <p className="mb-2">
              <strong>Low Dosage:</strong> {suggestions.low}
            </p>
            <p className="mb-2">
              <strong>Medium Dosage:</strong> {suggestions.medium}
            </p>
            <p className="mb-2">
              <strong>High Dosage:</strong> {suggestions.high}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Please consult with a healthcare professional before taking any medication.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default MedicineSuggestion

