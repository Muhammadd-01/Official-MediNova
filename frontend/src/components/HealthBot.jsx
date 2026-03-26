"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Constants (kept for search and TTS)
const NLM_SYMPTOM_API = "https://clinicaltables.nlm.nih.gov/api/hpo/v3/search";
const RXNAV_ALLERGY_API = "https://rxnav.nlm.nih.gov/REST/approx.json";
const CONSULTATION_LINK = "https://www.mednova.com/consultation";

const fallbackSymptoms = [
  "Fever", "Cough", "Headache", "Sore throat", "Fatigue", "Nausea", "Dizziness",
  "Shortness of breath", "Muscle pain", "Loss of taste or smell", "Runny nose",
  "Body aches", "Chills", "Diarrhea", "Vomiting", "Chest pain", "Sneezing", "Congestion",
];

const fallbackAllergies = [
  "Penicillin", "Aspirin", "Ibuprofen", "Sulfa drugs", "Latex", "Peanuts",
  "Tree nuts", "Shellfish", "Eggs", "Milk", "Soy", "Wheat", "Fish",
  "Pollen", "Dust mites", "Mold", "Pet dander",
];

// Helper functions (kept for search)
const simplifyMedicalTerms = (term) => {
  const termMap = {
    "Dyspnea": "Shortness of breath",
    "Thoracic pain": "Chest pain",
    "Vertigo": "Dizziness",
    "Vomiting": "Vomiting",
    "Pyrexia": "Fever",
    "Cough": "Cough",
    "Headache": "Headache",
    "Nasal congestion": "Congestion",
    "Fatigue": "Fatigue",
    "Myalgia": "Muscle pain",
    "Arthralgia": "Joint pain",
    "Pharyngitis": "Sore throat",
    "Nausea": "Nausea",
    "Anosmia": "Loss of smell",
    "Ageusia": "Loss of taste",
    "Rhinorrhea": "Runny nose",
    "Chills": "Chills",
    "Diarrhea": "Diarrhea",
    "Sneezing": "Sneezing",
  };
  return termMap[term] || term.replace(/ [ (].*?[ )]/g, "").replace(/medical|syndrome|disorder|abnormality/gi, "").trim();
};

function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// Custom hook for AI logic (simplified: delegates to backend)
export const useHealthBotAI = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [isExtreme, setIsExtreme] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch suggestions for symptoms/allergies (kept for search inputs)
  const fetchSuggestions = async (query, setSuggestionsFunc, isAllergy = false) => {
    if (!query.trim()) {
      setSuggestionsFunc([]);
      return;
    }

    const cacheKey = `${isAllergy ? "allergy" : "symptom"}:${query.toLowerCase()}`;
    if (suggestionCache.has(cacheKey)) {
      setSuggestionsFunc(suggestionCache.get(cacheKey));
      return;
    }

    try {
      let apiUrl = isAllergy
        ? `${RXNAV_ALLERGY_API}?term=${encodeURIComponent(query)}&maxEntries=50`
        : `${NLM_SYMPTOM_API}?terms=${encodeURIComponent(query)}&maxList=50`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();

      let simplifiedLabels = [];
      if (isAllergy) {
        const candidates = data.approxGroup?.candidate || [];
        simplifiedLabels = candidates
          .map((c) => c.name)
          .filter((label, index, self) => self.indexOf(label) === index);
      } else {
        const labels = data[3] || [];
        simplifiedLabels = labels
          .map((item) => simplifyMedicalTerms(item[1]))
          .filter((label, index, self) => self.indexOf(label) === index);
      }

      suggestionCache.set(cacheKey, simplifiedLabels);
      setSuggestionsFunc(simplifiedLabels);
    } catch (error) {
      console.error(`Error fetching ${isAllergy ? "allergies" : "symptoms"}:`, error);
      const fallback = isAllergy ? fallbackAllergies : fallbackSymptoms;
      const filteredFallback = fallback
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      suggestionCache.set(cacheKey, filteredFallback);
      setSuggestionsFunc(filteredFallback);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Main function: Process symptoms by calling backend
  const processSymptoms = async (formData, isPregnant, isBreastfeeding) => {
    if (!formData.symptoms.length) {
      setErrorMessage("Please select at least one symptom to proceed, dear " + formData.name + ".");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please provide your name to receive personalized suggestions, dear user.");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setSuggestions(null);
    setIsExtreme(false);

    try {
      const response = await axios.post("http://localhost:4000/HealthBot/analyze", { // Adjust URL if your backend port/route differs
        ...formData,
        isPregnant,
        isBreastfeeding
      }, {
        timeout: 30000 // 30s for backend processing (FDA + AI)
      });

      if (response.data.success) {
        setSuggestions(response.data.data);
        setIsExtreme(response.data.isCritical || false); // Backend flag for extreme/critical
      } else {
        setErrorMessage(response.data.error || "Failed to get suggestions.");
      }
    } catch (error) {
      console.error("Backend call error:", error);
      setErrorMessage(`Error connecting to server: ${error.message}. Please try again or consult a doctor at ${CONSULTATION_LINK}.`);
    } finally {
      setLoading(false);
    }
  };

  // Text-to-speech functions (kept as is)
  const handleSpeak = (text, formData, setIsSpeaking) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en";
      utterance.volume = 1.0;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices[0] || null;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        setErrorMessage(`Speech error: ${e.error}. Try a different language or browser, dear ${formData.name}.`);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMessage("Text-to-speech is not supported in this browser, dear " + formData.name + ".");
    }
  };

  const handleCancelSpeak = (setIsSpeaking) => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Get full text for speech/download (kept as is, adjusted for backend structure)
  const getFullText = (sugs, formData, isPregnant, isBreastfeeding) => {
    let text = `Medicine Suggestion Report\n\n`;
    text += `Patient Information:\n`;
    text += `Name: ${formData.name}\n`;
    text += `Age: ${formData.age || "Not provided"}\n`;
    text += `Gender: ${formData.gender || "Not provided"}\n`;
    if (formData.gender === "female") {
      text += `Pregnancy Status: ${isPregnant ? "Pregnant" : "Not Pregnant"}\n`;
      if (isPregnant) {
        text += `Breastfeeding Status: ${isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}\n`;
      }
    }
    text += `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}\n`;
    text += `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}\n`;
    text += `Blood Group: ${formData.bloodGroup || "Not provided"}\n`;
    text += `Symptoms: ${formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}\n`;
    text += `Allergies: ${formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}\n`;
    text += `Medical History: ${formData.medicalHistory || "Not provided"}\n`;
    text += `Current Medications: ${formData.currentMedications || "Not provided"}\n\n`;

    text += `Suggestions:\n\n`;
    if (sugs?.reasoning) text += `Reasoning:\n${sugs.reasoning}\n\n`;
    if (sugs?.otcMedications?.length > 0) text += `OTC Medications:\n${sugs.otcMedications.map(med => `${med.name} - ${med.dosage} - ${med.timing} - ${med.precautions} - ${med.source}`).join("\n")}\n\n`;
    if (sugs?.homeRemedies?.length > 0) text += `Home Remedies / Lifestyle:\n${sugs.homeRemedies.join("\n")}\n\n`;
    if (sugs?.warnings?.length > 0) text += `Warnings / Avoid:\n${sugs.warnings.join("\n")}\n\n`;
    if (sugs?.duration) text += `Duration Guidance:\n${sugs.duration}\n\n`;
    if (sugs?.disclaimer) text += `Doctor Disclaimer:\n${sugs.disclaimer}`;
    return text;
  };

  // Cache for suggestions (kept)
  const suggestionCache = useRef(new Map()).current;

  return {
    loading,
    errorMessage,
    suggestions,
    isExtreme,
    processSymptoms,
    debouncedFetchSuggestions,
    fetchSuggestions,
    handleSpeak,
    handleCancelSpeak,
    getFullText,
    calculateAge
  };
};

export default useHealthBotAI;