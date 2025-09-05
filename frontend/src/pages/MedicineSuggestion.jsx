"use client";

import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, Pill, Clock, Globe, Volume2, X } from "lucide-react";
import { DarkModeContext } from "../App";

const symptoms = [
  "Fever", "Cough", "Headache", "Sore throat", "Fatigue", "Nausea", "Dizziness",
  "Shortness of breath", "Muscle pain", "Loss of taste or smell", "Runny nose",
  "Body aches", "Chills", "Diarrhea", "Vomiting", "Chest pain",
];

const allergies = [
  "Penicillin", "Aspirin", "Ibuprofen", "Sulfa drugs", "Latex", "Peanuts",
  "Tree nuts", "Shellfish", "Eggs", "Milk", "Soy", "Wheat", "Fish",
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
];

const commonDiseases = {
  flu: [
    { name: "Acetaminophen", dosage: "500-1000 mg every 4-6 hours", timing: "Take with water, not to exceed 4000 mg daily", source: "Available at pharmacies like CVS, Walgreens" },
    { name: "Ibuprofen", dosage: "200-400 mg every 4-6 hours", timing: "Take with food, not to exceed 3200 mg daily", source: "Available at pharmacies like CVS, Walgreens" },
  ],
  cold: [
    { name: "Pseudoephedrine", dosage: "60 mg every 4-6 hours", timing: "Take with water, avoid late evening doses", source: "Available at pharmacies like CVS, Walgreens" },
    { name: "Guaifenesin", dosage: "200-400 mg every 4 hours", timing: "Take with water, not to exceed 2400 mg daily", source: "Available at pharmacies like CVS, Walgreens" },
  ],
  headache: [
    { name: "Ibuprofen", dosage: "200-400 mg every 4-6 hours", timing: "Take with food, not to exceed 3200 mg daily", source: "Available at pharmacies like CVS, Walgreens" },
    { name: "Acetaminophen", dosage: "500-1000 mg every 4-6 hours", timing: "Take with water, not to exceed 4000 mg daily", source: "Available at pharmacies like CVS, Walgreens" },
  ],
};

const criticalSymptoms = [
  "Shortness of breath", "Chest pain", "Dizziness", "Vomiting",
];

function MedicineSuggestion() {
  const [formData, setFormData] = useState({
    name: "",
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
  const [translatedSuggestions, setTranslatedSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode } = useContext(DarkModeContext);
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const fdaUrl = import.meta.env.VITE_FDA_API_URL || "https://api.fda.gov/drug/label.json";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.symptoms.length) {
      setErrorMessage("Please select at least one symptom.");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!openRouterKey) {
      setErrorMessage(
        "OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in your .env file."
      );
      return;
    }
    setErrorMessage("");
    setLoading(true);
    setSuggestions(null);
    setTranslatedSuggestions(null);

    try {
      const symptomQuery = encodeURIComponent(formData.symptoms.join(", ").trim());
      if (!symptomQuery) throw new Error("No symptoms provided.");

      // Check for critical symptoms
      const hasCriticalSymptom = formData.symptoms.some(symptom => criticalSymptoms.includes(symptom));
      if (hasCriticalSymptom) {
        setSuggestions({
          otcMedications: [],
          homeRemedies: ["Rest and stay hydrated."],
          warnings: ["Your symptoms include serious conditions. Please consult a doctor immediately."],
          duration: "Seek medical attention as soon as possible.",
          disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a healthcare professional immediately.`,
        });
        setTranslatedSuggestions({
          otcMedications: [],
          homeRemedies: ["Rest and stay hydrated."],
          warnings: ["Your symptoms include serious conditions. Please consult a doctor immediately."],
          duration: "Seek medical attention as soon as possible.",
          disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a healthcare professional immediately.`,
        });
        setLoading(false);
        return;
      }

      // Map symptoms to common diseases
      let matchedDisease = null;
      const symptomLower = formData.symptoms.map(s => s.toLowerCase());
      if (symptomLower.includes("fever") || symptomLower.includes("body aches") || symptomLower.includes("chills")) {
        matchedDisease = "flu";
      } else if (symptomLower.includes("cough") || symptomLower.includes("sore throat") || symptomLower.includes("runny nose")) {
        matchedDisease = "cold";
      } else if (symptomLower.includes("headache")) {
        matchedDisease = "headache";
      }

      if (matchedDisease && commonDiseases[matchedDisease]) {
        let primaryMed = commonDiseases[matchedDisease][0];
        let alternativeMed = commonDiseases[matchedDisease][1];

        // Check for allergies
        if (formData.allergies.includes(primaryMed.name)) {
          primaryMed = alternativeMed;
          alternativeMed = { name: "None", dosage: "N/A", timing: "N/A", source: "N/A" };
        }
        if (formData.allergies.includes(alternativeMed.name)) {
          alternativeMed = { name: "None", dosage: "N/A", timing: "N/A", source: "N/A" };
        }

        // Adjust for age (no Ibuprofen or Aspirin for <18 years)
        if (formData.age && Number(formData.age) < 18) {
          if (primaryMed.name === "Ibuprofen" || primaryMed.name === "Aspirin") {
            primaryMed = { name: "Acetaminophen", dosage: "10-15 mg/kg every 4-6 hours", timing: "Take with water, not to exceed 75 mg/kg daily", source: "Available at pharmacies like CVS, Walgreens" };
          }
          if (alternativeMed.name === "Ibuprofen" || alternativeMed.name === "Aspirin") {
            alternativeMed = { name: "None", dosage: "N/A", timing: "N/A", source: "N/A" };
          }
        }

        setSuggestions({
          otcMedications: [
            `${primaryMed.name} - ${primaryMed.dosage} - ${primaryMed.timing} - ${primaryMed.source}`,
            `${alternativeMed.name} - ${alternativeMed.dosage} - ${alternativeMed.timing} - ${alternativeMed.source}`,
          ],
          homeRemedies: [
            "Stay hydrated by drinking plenty of water.",
            "Rest adequately to support recovery.",
            "Use a humidifier to ease respiratory symptoms.",
          ],
          warnings: [
            `Avoid if allergic to ${primaryMed.name}${alternativeMed.name !== "None" ? ` or ${alternativeMed.name}` : ""}.`,
            "Do not exceed recommended dosage.",
            isPregnant ? "Consult a doctor before taking any medication due to pregnancy." : "",
            isBreastfeeding ? "Consult a doctor before taking any medication due to breastfeeding." : "",
            Number(formData.age) < 18 ? "Avoid aspirin or ibuprofen for children under 18 unless advised by a doctor." : "",
          ].filter(Boolean),
          duration: "Use for up to 3-5 days. Stop and consult a doctor if symptoms persist.",
          disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a healthcare professional before taking any medication.`,
        });
        setTranslatedSuggestions({
          otcMedications: [
            `${primaryMed.name} - ${primaryMed.dosage} - ${primaryMed.timing} - ${primaryMed.source}`,
            `${alternativeMed.name} - ${alternativeMed.dosage} - ${alternativeMed.timing} - ${alternativeMed.source}`,
          ],
          homeRemedies: [
            "Stay hydrated by drinking plenty of water.",
            "Rest adequately to support recovery.",
            "Use a humidifier to ease respiratory symptoms.",
          ],
          warnings: [
            `Avoid if allergic to ${primaryMed.name}${alternativeMed.name !== "None" ? ` or ${alternativeMed.name}` : ""}.`,
            "Do not exceed recommended dosage.",
            isPregnant ? "Consult a doctor before taking any medication due to pregnancy." : "",
            isBreastfeeding ? "Consult a doctor before taking any medication due to breastfeeding." : "",
            Number(formData.age) < 18 ? "Avoid aspirin or ibuprofen for children under 18 unless advised by a doctor." : "",
          ].filter(Boolean),
          duration: "Use for up to 3-5 days. Stop and consult a doctor if symptoms persist.",
          disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a healthcare professional before taking any medication.`,
        });
        if (selectedLanguage !== "en") {
          await handleTranslate();
        }
        setLoading(false);
        return;
      }

      // Fallback to FDA API
      const fdaFullUrl = `${fdaUrl}?search=indications_and_usage:${symptomQuery}&limit=2`;
      const fdaResponse = await fetch(fdaFullUrl);
      if (!fdaResponse.ok) {
        throw new Error(`FDA API error: ${fdaResponse.status}`);
      }
      const fdaData = await fdaResponse.json();

      let fdaInfo = [];
      if (fdaData?.results?.length > 0) {
        fdaInfo = fdaData.results.map(result => ({
          name: result.openfda?.brand_name?.[0] || "Generic",
          indications: result.indications_and_usage?.[0] || "No indications available",
          dosage: result.dosage_and_administration?.[0] || "Follow standard guidelines",
          warnings: result.warnings?.[0] || "No specific warnings available",
        }));
      } else {
        fdaInfo.push({ name: "No FDA reference found", indications: "No details available", dosage: "", warnings: "" });
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
            model: "meta-llama/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content: `
You are a compassionate, professional medical AI assistant acting like a human doctor, addressing the patient by name (${formData.name}) and providing safe, non-prescription (OTC) guidance based on FDA data. NEVER prescribe medication. Always include a warning to consult a doctor. This is for educational purposes only; I am not a medical expert.

Analyze patient inputs and FDA data to generate tailored suggestions:
- Name: ${formData.name}
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

FDA Data:
${JSON.stringify(fdaInfo, null, 2)}

Strictly format output in these sections, addressing the patient by name (${formData.name}):
✅ OTC Medications (Provide 2 safe OTC options (primary and alternative) with:
- Name (use FDA brand names if available)
- Dosage (tailored to age, weight, from FDA data or general guidelines)
- Timing and Administration (specific times like 8 AM/8 PM, with food/water)
- Source (e.g., "Available at pharmacies like CVS, Walgreens"))
🏠 Home Remedies / Lifestyle (Tailored to symptoms, age, gender, etc.)
⚠️ Warnings / Avoid (Based on allergies, pregnancy, breastfeeding, medical history, FDA warnings)
⏳ Duration Guidance (How long to use, when to stop)
🚨 Doctor Disclaimer (Always consult a doctor; this is not medical advice)

Rules:
- Use FDA data for accurate medication names, dosages, and warnings.
- Suggest exactly two OTC medications (primary and alternative) safe for the patient's profile, excluding allergy-conflicting drugs.
- Avoid unsafe drugs (e.g., no aspirin for <18 years).
- Consider medical history and current medications for interactions.
- Specify administration times and sources.
- Highlight red flags for urgent medical care (e.g., severe symptoms).
- Be empathetic, clear, and professional.
                `,
              },
              {
                role: "user",
                content: `Patient Info:
- Name: ${formData.name}
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

FDA Data:
${JSON.stringify(fdaInfo, null, 2)}
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
      const aiText = aiData?.choices?.[0]?.message?.content || "No AI suggestion available.";

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
      setTranslatedSuggestions(parsedSuggestions);
      if (selectedLanguage !== "en") {
        await handleTranslate(parsedSuggestions);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(
        `⚠️ Failed to fetch suggestions: ${error.message}. Please verify your OpenRouter API key or try again.`
      );
      setSuggestions(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (sugs = suggestions) => {
    if (!sugs || selectedLanguage === "en") {
      setTranslatedSuggestions(sugs);
      return;
    }

    setIsTranslating(true);
    try {
      const aiResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content: `Translate the following medical suggestions into ${languages.find(lang => lang.code === selectedLanguage)?.name || "English"}. Ensure precise medical terminology, preserve the exact structure and formatting, address the patient by name (${formData.name}), and maintain all sections (OTC Medications, Home Remedies, Warnings, Duration, Disclaimer).`
              },
              {
                role: "user",
                content: JSON.stringify(sugs, null, 2),
              },
            ],
          }),
        }
      );

      if (!aiResponse.ok) {
        throw new Error(`Translation failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const translatedText = aiData.choices[0]?.message.content || "Translation unavailable.";

      try {
        const parsedTranslated = JSON.parse(translatedText);
        setTranslatedSuggestions(parsedTranslated);
      } catch (error) {
        console.error("Error parsing translated JSON:", error);
        const lines = translatedText.split("\n").filter((line) => line.trim());
        const parsedTranslated = {
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
              parsedTranslated[currentSection].push(line.replace(/^- /, ""));
            } else {
              parsedTranslated[currentSection] += (parsedTranslated[currentSection] ? " " : "") + line.trim();
            }
          }
        });
        setTranslatedSuggestions(parsedTranslated);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setErrorMessage(`Translation failed: ${error.message}. Please try again.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMessage("Text-to-speech is not supported in this browser.");
    }
  };

  const handleCancelSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getFullText = (sugs) => {
    let text = `Dear ${formData.name},\n\n`;
    if (sugs?.otcMedications?.length > 0) {
      text += "OTC Medications:\n" + sugs.otcMedications.join("\n") + "\n\n";
    }
    if (sugs?.homeRemedies?.length > 0) {
      text += "Home Remedies / Lifestyle:\n" + sugs.homeRemedies.join("\n") + "\n\n";
    }
    if (sugs?.warnings?.length > 0) {
      text += "Warnings / Avoid:\n" + sugs.warnings.join("\n") + "\n\n";
    }
    if (sugs?.duration) {
      text += "Duration Guidance:\n" + sugs.duration + "\n\n";
    }
    if (sugs?.disclaimer) {
      text += "Doctor Disclaimer:\n" + sugs.disclaimer;
    }
    return text;
  };

  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";
  const bgColor = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-white to-blue-50";
  const inputBg = darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-[#0D3B66] border-blue-200";

  return (
    <>
      <Helmet>
        <title>Medicine Suggestions - MediNova</title>
        <meta
          name="description"
          content="Get personalized, doctor-like medicine suggestions with safe dosage and administration guidance."
        />
        <link
          rel="canonical"
          href="https://www.MediNova.com/medicine-suggestion"
        />
      </Helmet>

      <div className={`max-w-5xl mx-auto p-6 ${textColor}`}>
        <motion.h1
          className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0D3B66] to-blue-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Medicine Suggestion
        </motion.h1>

        {errorMessage && (
          <motion.div
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className={`mb-10 space-y-8 p-8 rounded-2xl shadow-xl ${bgColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>
                Name:
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                required
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className={`block text-sm font-medium ${textColor}`}>
                Age:
              </label>
              <motion.input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                required
                min="0"
                max="120"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>
                Gender:
              </label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300 appearance-none bg-no-repeat bg-[length:24px] bg-[right_8px_center] ${darkMode ? 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%23ffffff%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]' : 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%230D3B66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]'}`}
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </motion.select>
              </motion.div>
            </div>
            {formData.gender === "female" && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>
                  Pregnancy Status:
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="not-pregnant"
                      name="pregnancyStatus"
                      value="not-pregnant"
                      checked={!isPregnant}
                      onChange={() => setIsPregnant(false)}
                      className="mr-2 accent-blue-500 w-5 h-5"
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
                      className="mr-2 accent-blue-500 w-5 h-5"
                    />
                    <label htmlFor="pregnant" className={textColor}>Pregnant</label>
                  </div>
                </div>
              </div>
            )}
            {isPregnant && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>
                  Breastfeeding Status:
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="not-breastfeeding"
                      name="breastfeedingStatus"
                      value="not-breastfeeding"
                      checked={!isBreastfeeding}
                      onChange={() => setIsBreastfeeding(false)}
                      className="mr-2 accent-blue-500 w-5 h-5"
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
                      className="mr-2 accent-blue-500 w-5 h-5"
                    />
                    <label htmlFor="breastfeeding" className={textColor}>Breastfeeding</label>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="weight" className={`block text-sm font-medium ${textColor}`}>
                Weight (kg):
              </label>
              <motion.input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                required
                min="1"
                max="500"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.weight) > 500 && (
                <p className="text-red-500 text-sm mt-1">
                  Weight exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className={`block text-sm font-medium ${textColor}`}>
                Height (cm):
              </label>
              <motion.input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                required
                min="1"
                max="300"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.height) > 300 && (
                <p className="text-red-500 text-sm mt-1">
                  Height exceeds our database limit. Please consult a doctor.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className={`block text-sm font-medium ${textColor}`}>
                Blood Group:
              </label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300 appearance-none bg-no-repeat bg-[length:24px] bg-[right_8px_center] ${darkMode ? 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%23ffffff%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]' : 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%230D3B66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]'}`}
                  required
                >
                  <option value="" disabled>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </motion.select>
              </motion.div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${textColor}`}>
              Symptoms:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {symptoms.map((symptom) => (
                <motion.div
                  key={symptom}
                  className={`flex items-center p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm ${formData.symptoms.includes(symptom) ? "bg-blue-100 dark:bg-gray-600" : ""}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <input
                    type="checkbox"
                    id={`symptom-${symptom}`}
                    name={`symptom-${symptom}`}
                    value={symptom}
                    checked={formData.symptoms.includes(symptom)}
                    onChange={(e) => handleCheckboxChange(e, "symptoms")}
                    className="mr-3 accent-blue-500 w-5 h-5 rounded"
                  />
                  <label htmlFor={`symptom-${symptom}`} className={`${textColor} cursor-pointer text-sm`}>{symptom}</label>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${textColor}`}>
              Allergies:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allergies.map((allergy) => (
                <motion.div
                  key={allergy}
                  className={`flex items-center p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm ${formData.allergies.includes(allergy) ? "bg-blue-100 dark:bg-gray-600" : ""}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <input
                    type="checkbox"
                    id={`allergy-${allergy}`}
                    name={`allergy-${allergy}`}
                    value={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onChange={(e) => handleCheckboxChange(e, "allergies")}
                    className="mr-3 accent-blue-500 w-5 h-5 rounded"
                  />
                  <label htmlFor={`allergy-${allergy}`} className={`${textColor} cursor-pointer text-sm`}>{allergy}</label>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="medicalHistory" className={`block text-sm font-medium ${textColor}`}>
              Medical History:
            </label>
            <motion.textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
              rows="4"
              whileFocus={{ scale: 1.02 }}
            ></motion.textarea>
          </div>
          <div className="space-y-2">
            <label htmlFor="currentMedications" className={`block text-sm font-medium ${textColor}`}>
              Current Medications:
            </label>
            <motion.textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
              rows="4"
              whileFocus={{ scale: 1.02 }}
            ></motion.textarea>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-gradient-to-r from-[#0D3B66] to-blue-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 text-lg font-semibold shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Fetching..." : "Get Personalized Suggestions"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {suggestions && (
            <motion.div
              className={`mt-10 p-10 rounded-2xl shadow-2xl ${bgColor}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0D3B66] to-blue-500">
                <Pill size={28} /> Personalized Suggestions for {formData.name}
              </h2>
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Here’s what you provided:</h3>
                <ul className="space-y-3">
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <strong>Name:</strong> {formData.name}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <strong>Age:</strong> {formData.age || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <strong>Gender:</strong> {formData.gender || "Not provided"}
                  </motion.li>
                  {formData.gender === "female" && (
                    <motion.li
                      className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <strong>Pregnancy Status:</strong> {isPregnant ? "Pregnant" : "Not Pregnant"}
                    </motion.li>
                  )}
                  {isPregnant && (
                    <motion.li
                      className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <strong>Breastfeeding Status:</strong> {isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}
                    </motion.li>
                  )}
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <strong>Height:</strong> {formData.height ? `${formData.height} cm` : "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <strong>Blood Group:</strong> {formData.bloodGroup || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <strong>Symptoms:</strong> {formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <strong>Medical History:</strong> {formData.medicalHistory || "Not provided"}
                  </motion.li>
                  <motion.li
                    className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <strong>Current Medications:</strong> {formData.currentMedications || "Not provided"}
                  </motion.li>
                </ul>
              </div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0D3B66] to-blue-500">
                <Pill size={28} /> Personalized Suggestions for {formData.name}
              </h2>
              <div className="flex items-center mb-8 gap-4 flex-wrap">
                <Globe className="text-blue-500" size={24} />
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <motion.select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      handleTranslate();
                    }}
                    className={`w-48 p-4 pr-10 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300 appearance-none bg-no-repeat bg-[length:24px] bg-[right_8px_center] ${darkMode ? 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%23ffffff%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]' : 'bg-[url(data:image/svg+xml,%3Csvg%20fill%3D%22%230D3B66%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E)]'}`}
                  >
                    <option value="" disabled>Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>
                <motion.button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </motion.button>
                <motion.button
                  onClick={() => handleSpeak(getFullText(translatedSuggestions || suggestions))}
                  disabled={isSpeaking}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Volume2 size={20} />
                  {isSpeaking ? "Speaking..." : "Listen"}
                </motion.button>
                {isSpeaking && (
                  <motion.button
                    onClick={handleCancelSpeak}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                    Cancel Listening
                  </motion.button>
                )}
              </div>
              {(translatedSuggestions || suggestions)?.otcMedications?.length > 0 && (
                <div className="space-y-6 mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-blue-500" size={24} />
                    OTC Medications
                  </h3>
                  {(translatedSuggestions || suggestions).otcMedications.slice(0, 2).map((med, index) => (
                    med.split(' - ')[0] !== "None" && (
                      <MedicineCard
                        key={index}
                        medicine={{
                          name: med.split(' - ')[0] || "Generic",
                          dosage: med.split(' - ')[1] || "Standard dose",
                          timing: med.split(' - ')[2] || "Follow standard guidelines",
                          source: med.split(' - ')[3] || "Available at pharmacies like CVS, Walgreens",
                          description: index === 0 ? "Primary OTC medication for symptom relief" : "Alternative OTC medication for symptom relief",
                          sideEffects: ["Consult a pharmacist for detailed side effects"],
                          brandNames: [med.split(' - ')[0] || "Generic"],
                        }}
                        title={index === 0 ? "Primary Medication" : "Alternative Medication"}
                      />
                    )
                  ))}
                </div>
              )}
              {(translatedSuggestions || suggestions)?.homeRemedies?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-blue-500" size={24} />
                    Home Remedies / Lifestyle
                  </h3>
                  <ul className="space-y-3">
                    {(translatedSuggestions || suggestions).homeRemedies.map((remedy, index) => (
                      <motion.li
                        key={index}
                        className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-sm hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {remedy}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.warnings?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-yellow-500" size={24} />
                    Warnings / Avoid
                  </h3>
                  <ul className="space-y-3">
                    {(translatedSuggestions || suggestions).warnings.map((warning, index) => (
                      <motion.li
                        key={index}
                        className={`p-4 rounded-xl ${darkMode ? "bg-yellow-900" : "bg-yellow-100"} text-yellow-600 dark:text-yellow-400 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {warning}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.duration && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="text-purple-500" size={24} />
                    Duration Guidance
                  </h3>
                  <motion.p
                    className={`p-4 rounded-xl ${darkMode ? "bg-purple-900" : "bg-purple-100"} shadow-sm`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(translatedSuggestions || suggestions).duration}
                  </motion.p>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={24} />
                  Doctor Disclaimer
                </h3>
                <motion.p
                  className={`p-4 rounded-xl ${darkMode ? "bg-red-900" : "bg-red-100"} text-red-600 dark:text-red-400 shadow-sm`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(translatedSuggestions || suggestions).disclaimer || `Please consult a healthcare professional before taking any medication, ${formData.name}. This is not medical advice.`}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function MedicineCard({ medicine, title }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";

  const medicineImages = {
    Acetaminophen: "https://images.unsplash.com/photo-1587855702092-4e4e3a9e3c91",
    Ibuprofen: "https://images.unsplash.com/photo-1607619056574-6c3f8037f14a",
    Pseudoephedrine: "https://images.unsplash.com/photo-1584010918310-07f73a1883e0",
    Guaifenesin: "https://images.unsplash.com/photo-1584010918310-07f73a1883e0",
    Generic: "https://images.unsplash.com/photo-1584010918310-07f73a1883e0",
  };
  const imageSrc = medicineImages[medicine.name] || medicineImages.Generic;

  return (
    <motion.div
      className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden relative border border-blue-200 dark:border-gray-600`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0D3B66] to-blue-500 transform rotate-45 translate-x-12 -translate-y-12 opacity-30"></div>
      <h4 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h4>
      <div className="flex items-start gap-6 mb-4">
        <motion.img
          src={imageSrc}
          alt={medicine?.name}
          className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300 shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onError={(e) => { e.target.src = medicineImages.Generic; }}
        />
        <div className="flex-1">
          <h5 className={`text-lg font-semibold ${textColor}`}>{medicine?.name}</h5>
          <p className={`text-sm ${textColor} opacity-80 mb-2`}>{medicine?.description}</p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Dosage:</strong> {medicine?.dosage}
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Timing and Administration:</strong> {medicine?.timing}
          </p>
          <p className={`text-sm ${textColor} mb-2`}>
            <strong>Source:</strong> {medicine?.source}
          </p>
        </div>
      </div>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          expanded: { height: "auto", opacity: 1 },
          collapsed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Side Effects:</h5>
        <ul className={`list-disc list-inside ${textColor} text-sm`}>
          {medicine?.sideEffects?.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Brand Names:</h5>
        <p className={`${textColor} text-sm`}>{medicine?.brandNames?.join(", ") || "N/A"}</p>
      </motion.div>
      <motion.button
        className={`${textColor} hover:text-blue-500 transition-all duration-300 flex items-center text-sm mt-4`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? "Show Less" : "Show More"}
        {isExpanded ? (
          <ChevronUp className="ml-1" size={16} />
        ) : (
          <ChevronDown className="ml-1" size={16} />
        )}
      </motion.button>
    </motion.div>
  );
}

export default MedicineSuggestion;