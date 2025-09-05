"use client";

import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { DarkModeContext } from "../App";

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
  "Runny nose",
  "Body aches",
  "Chills",
  "Diarrhea",
  "Vomiting",
  "Chest pain",
];

const allergies = [
  "Penicillin",
  "Aspirin",
  "Ibuprofen",
  "Sulfa drugs",
  "Latex",
  "Peanuts",
  "Tree nuts",
  "Shellfish",
  "Eggs",
  "Milk",
  "Soy",
  "Wheat",
  "Fish",
];

function MedicineSuggestion() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    bloodGroup: "",
    symptoms: [],
    allergies: [],
    medicalHistory: "",
    currentMedications: "",
  });
  const [suggestions, setSuggestions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isRareDisease, setIsRareDisease] = useState(false);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const fdaUrl = import.meta.env.VITE_FDA_API_URL;

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "weight" && Number(value) > 500) {
      updatedValue = "500";
    } else if (name === "height" && Number(value) > 300) {
      updatedValue = "300";
    }

    if (name === "gender" && value === "male") {
      setIsPregnant(false);
      setIsBreastfeeding(false);
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [category]: checked
        ? [...prevData[category], value]
        : prevData[category].filter((item) => item !== value),
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      setLoading(true);
      try {
        const symptomQuery = encodeURIComponent(searchTerm.trim());
        const fdaResponse = await fetch(
          `${fdaUrl}?search=indications_and_usage:${symptomQuery}&limit=1`
        );
        const fdaData = await fdaResponse.json();

        let fdaInfo = "No FDA reference found.";
        if (fdaData?.results?.length > 0) {
          fdaInfo = fdaData.results[0].indications_and_usage || "No details available.";
        }

        setSearchResult({ description: fdaInfo, medicines: [] });
        setIsRareDisease(!fdaData?.results?.length);
      } catch (error) {
        console.error("Error fetching FDA data:", error);
        setSearchResult(null);
        setIsRareDisease(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestions(null);

    try {
      const symptomQuery = encodeURIComponent(formData.symptoms.join(", "));
      const fdaResponse = await fetch(
        `${fdaUrl}?search=indications_and_usage:${symptomQuery}&limit=1`
      );
      const fdaData = await fdaResponse.json();

      let fdaInfo = "No FDA reference found.";
      if (fdaData?.results?.length > 0) {
        fdaInfo = fdaData.results[0].indications_and_usage || "No details available.";
      }

      const aiResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3-70b-instruct",
            messages: [
              {
                role: "system",
                content: `
You are a safe medical AI assistant. 
Only provide general, well-established, non-prescription (OTC) guidance. 
NEVER prescribe. Always warn user to see a doctor.

Strictly format output in these sections:
✅ OTC Medications
🏠 Home Remedies / Lifestyle
⚠️ Warnings / Avoid
⏳ Duration Guidance
🚨 Doctor Disclaimer

Rules:
- Exclude any medication that conflicts with listed allergies: ${formData.allergies.join(", ") || "None"}.
- Avoid unsafe drugs for patient's age group (e.g., no aspirin for <18 years).
- Consider pregnancy status: ${isPregnant ? "Pregnant" : "Not pregnant"}.
- Consider breastfeeding status: ${isBreastfeeding ? "Breastfeeding" : "Not breastfeeding"}.
- Include FDA reference only if relevant.
- Highlight red flags for when to seek urgent medical care.
- Keep it concise and professional.
                `,
              },
              {
                role: "user",
                content: `Patient Info:
- Age: ${formData.age}
- Gender: ${formData.gender}
- Weight: ${formData.weight} kg
- Height: ${formData.height} cm
- Blood Group: ${formData.bloodGroup}
- Symptoms: ${formData.symptoms.join(", ") || "None"}
- Allergies: ${formData.allergies.join(", ") || "None"}
- Medical History: ${formData.medicalHistory || "None"}
- Current Medications: ${formData.currentMedications || "None"}
- Pregnancy Status: ${isPregnant ? "Pregnant" : "Not pregnant"}
- Breastfeeding Status: ${isBreastfeeding ? "Breastfeeding" : "Not breastfeeding"}

FDA Reference Info:
${fdaInfo}
                `,
              },
            ],
          }),
        }
      );

      if (!aiResponse.ok) {
        throw new Error(`OpenRouter API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const aiText =
        aiData?.choices?.[0]?.message?.content ||
        "No AI suggestion available at the moment.";

      // Parse AI response to extract structured data
      const lines = aiText.split("\n").filter((line) => line.trim());
      const parsedSuggestions = {
        otcMedications: [],
        homeRemedies: [],
        warnings: [],
        duration: "",
        disclaimer: "",
      };
      let currentSection = "";
      lines.forEach((line) => {
        if (line.startsWith("✅ OTC Medications")) currentSection = "otcMedications";
        else if (line.startsWith("🏠 Home Remedies / Lifestyle")) currentSection = "homeRemedies";
        else if (line.startsWith("⚠️ Warnings / Avoid")) currentSection = "warnings";
        else if (line.startsWith("⏳ Duration Guidance")) currentSection = "duration";
        else if (line.startsWith("🚨 Doctor Disclaimer")) currentSection = "disclaimer";
        else if (line.trim() && currentSection) {
          if (currentSection === "otcMedications" || currentSection === "homeRemedies" || currentSection === "warnings") {
            parsedSuggestions[currentSection].push(line.replace(/^- /, ""));
          } else {
            parsedSuggestions[currentSection] += (parsedSuggestions[currentSection] ? " " : "") + line.trim();
          }
        }
      });

      setSuggestions(parsedSuggestions);
    } catch (error) {
      console.error(error);
      setSuggestions({
        disclaimer: "⚠️ Something went wrong while fetching suggestions. Please try again or consult a doctor directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";

  return (
    <>
      <Helmet>
        <title>Medicine Suggestions - MediNova</title>
        <meta
          name="description"
          content="Get personalized medicine suggestions based on your symptoms or search for common diseases. Safe dosage recommendations for various conditions."
        />
        <link
          rel="canonical"
          href="https://www.MediNova.com/medicine-suggestion"
        />
      </Helmet>

      <div className={`max-w-4xl mx-auto ${textColor}`}>
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Medicine Suggestion
        </motion.h1>

        <motion.div
          className={`mb-8 p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a disease..."
              className={`flex-grow p-2 border rounded-l-md placeholder:${textColor} ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0D3B66] text-white p-2 rounded-r-md hover:bg-[#0F1E52] transition-colors duration-300 disabled:opacity-50"
            >
              <Search size={24} />
            </button>
          </form>
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Recent Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-[#0D3B66]"
                    } hover:bg-[#0D3B66] hover:text-white transition-colors duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {searchResult && (
              <motion.div
                className={`mt-4 p-4 rounded-lg ${
                  darkMode ? "bg-[#0D3B66]" : "bg-gray-100"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-2">{searchTerm}</h2>
                <p className="mb-2">{searchResult.description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isRareDisease && (
              <motion.div
                className={`mt-4 p-4 rounded-lg ${
                  darkMode ? "bg-yellow-900" : "bg-yellow-100"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-2">
                  <AlertCircle className="mr-2 text-yellow-600 dark:text-yellow-400" />
                  <h2 className="text-xl font-semibold">
                    Rare or Uncommon Disease
                  </h2>
                </div>
                <p>
                  This disease is not commonly searched. Please fill out the
                  detailed form below for a personalized suggestion.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className={`mb-8 space-y-6 p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className={`block mb-2 font-medium ${textColor}`}>
                Age:
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
                }`}
                required
                min="0"
                max="120"
              />
            </div>
            <div>
              <label htmlFor="gender" className={`block mb-2 font-medium ${textColor}`}>
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
                }`}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {formData.gender === "female" && (
              <div className="mt-4">
                <label className={`block mb-2 font-medium ${textColor}`}>
                  Pregnancy Status:
                </label>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="not-pregnant"
                    name="pregnancyStatus"
                    value="not-pregnant"
                    checked={!isPregnant}
                    onChange={() => setIsPregnant(false)}
                    className="mr-2"
                  />
                  <label htmlFor="not-pregnant" className={textColor}>Not Pregnant</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="pregnant"
                    name="pregnancyStatus"
                    value="pregnant"
                    checked={isPregnant}
                    onChange={() => setIsPregnant(true)}
                    className="mr-2"
                  />
                  <label htmlFor="pregnant" className={textColor}>Pregnant</label>
                </div>
              </div>
            )}
            {isPregnant && (
              <div className="mt-4">
                <label className={`block mb-2 font-medium ${textColor}`}>
                  Breastfeeding Status:
                </label>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="not-breastfeeding"
                    name="breastfeedingStatus"
                    value="not-breastfeeding"
                    checked={!isBreastfeeding}
                    onChange={() => setIsBreastfeeding(false)}
                    className="mr-2"
                  />
                  <label htmlFor="not-breastfeeding" className={textColor}>Not Breastfeeding</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="breastfeeding"
                    name="breastfeedingStatus"
                    value="breastfeeding"
                    checked={isBreastfeeding}
                    onChange={() => setIsBreastfeeding(true)}
                    className="mr-2"
                  />
                  <label htmlFor="breastfeeding" className={textColor}>Breastfeeding</label>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="weight" className={`block mb-2 font-medium ${textColor}`}>
                Weight (kg):
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
                }`}
                required
                min="1"
                max="500"
              />
              {formData.weight > 500 && (
                <p className="text-red-500 text-sm mt-1">
                  Weight exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="height" className={`block mb-2 font-medium ${textColor}`}>
                Height (cm):
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
                }`}
                required
                min="1"
                max="300"
              />
              {Number(formData.height) > 300 && (
                <p className="text-red-500 text-sm mt-1">
                  Height exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="bloodGroup" className={`block mb-2 font-medium ${textColor}`}>
              Blood Group:
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
              }`}
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${textColor}`}>
              Symptoms:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`symptom-${symptom}`}
                    name={`symptom-${symptom}`}
                    value={symptom}
                    checked={formData.symptoms.includes(symptom)}
                    onChange={(e) => handleCheckboxChange(e, "symptoms")}
                    className="mr-2"
                  />
                  <label htmlFor={`symptom-${symptom}`} className={textColor}>{symptom}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className={`block mb-2 font-medium ${textColor}`}>
              Allergies:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allergies.map((allergy) => (
                <div key={allergy} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`allergy-${allergy}`}
                    name={`allergy-${allergy}`}
                    value={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onChange={(e) => handleCheckboxChange(e, "allergies")}
                    className="mr-2"
                  />
                  <label htmlFor={`allergy-${allergy}`} className={textColor}>{allergy}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="medicalHistory" className={`block mb-2 font-medium ${textColor}`}>
              Medical History:
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
              }`}
              rows="4"
            ></textarea>
          </div>
          <div>
            <label htmlFor="currentMedications" className={`block mb-2 font-medium ${textColor}`}>
              Current Medications:
            </label>
            <textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-[#0D3B66]"
              }`}
              rows="4"
            ></textarea>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-[#0D3B66] text-white px-4 py-2 rounded hover:bg-[#0F1E52] transition-colors duration-300 disabled:opacity-50`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Fetching..." : "Get Personalized Suggestions"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {suggestions && (
            <motion.div
              className={`p-6 rounded-lg shadow-md ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-[#0D3B66]"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Personalized Suggestions
              </h2>
              {suggestions.otcMedications?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Primary Suggestion
                    </h3>
                    <MedicineCard
                      medicine={{
                        name: suggestions.otcMedications[0],
                        description: "OTC medication for symptom relief",
                        dosage: "Follow package instructions",
                        sideEffects: ["Consult package for side effects"],
                        brandNames: ["Generic"],
                      }}
                    />
                  </div>
                  {suggestions.otcMedications[1] && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Alternative Suggestion
                      </h3>
                      <MedicineCard
                        medicine={{
                          name: suggestions.otcMedications[1],
                          description: "Alternative OTC medication",
                          dosage: "Follow package instructions",
                          sideEffects: ["Consult package for side effects"],
                          brandNames: ["Generic"],
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {suggestions.homeRemedies?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Home Remedies / Lifestyle</h3>
                  <ul className="list-disc list-inside">
                    {suggestions.homeRemedies.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestions.warnings?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Warnings / Avoid</h3>
                  <ul className="list-disc list-inside">
                    {suggestions.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestions.duration && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Duration Guidance</h3>
                  <p>{suggestions.duration}</p>
                </div>
              )}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Doctor Disclaimer</h3>
                <p>{suggestions.disclaimer || "Please consult with a healthcare professional before taking any medication."}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function MedicineCard({ medicine }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md ${
        darkMode ? "bg-gray-700" : "bg-gray-100"
      } overflow-hidden relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#0D3B66] transform rotate-45 translate-x-8 -translate-y-8"></div>
      <div className="flex items-center mb-4">
        <img
          src={medicine?.image || "/placeholder.svg"}
          alt={medicine?.name}
          className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-[#A5B4FC]"
        />
        <h4 className={`text-lg font-semibold ${textColor}`}>{medicine?.name}</h4>
      </div>
      <p className={`mb-2 ${textColor}`}>{medicine?.description}</p>
      <p className={`mb-2 ${textColor}`}>
        <strong>Dosage:</strong> {medicine?.dosage}
      </p>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          expanded: { height: "auto" },
          collapsed: { height: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <h5 className={`font-semibold mt-2 ${textColor}`}>Side Effects:</h5>
        <ul className={`list-disc list-inside ${textColor}`}>
          {medicine?.sideEffects?.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
        <h5 className={`font-semibold mt-2 ${textColor}`}>Brand Names:</h5>
        <p className={textColor}>{medicine?.brandNames?.join(", ") || "N/A"}</p>
      </motion.div>
      <button
        className={`${textColor} hover:text-[#0D3B66] transition-colors duration-300 flex items-center`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Show More"}
        {isExpanded ? (
          <ChevronUp className="ml-1" />
        ) : (
          <ChevronDown className="ml-1" />
        )}
      </button>
    </motion.div>
  );
}

export default MedicineSuggestion;