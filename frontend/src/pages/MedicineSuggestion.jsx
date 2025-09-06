"use client";

import { useState, useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, Pill, Clock, Globe, Volume2, X, Search } from "lucide-react";
import { DarkModeContext } from "../App";

const criticalSymptoms = [
  "Can't breathe well", "Chest hurts", "Feeling dizzy", "Throwing up",
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

const NLM_SYMPTOM_API = "https://clinicaltables.nlm.nih.gov/api/hpo/v3/search";

// Fallback lists in plain language
const fallbackSymptoms = [
  "Fever", "Cough", "Headache", "Sore throat", "Tiredness", "Nausea", "Dizziness",
  "Can't breathe well", "Muscle pain", "No taste or smell", "Runny nose",
  "Body aches", "Chills", "Diarrhea", "Throwing up", "Chest hurts", "Sneezing", "Stuffy nose",
];

const fallbackAllergies = [
  "Penicillin", "Aspirin", "Ibuprofen", "Sulfa drugs", "Latex", "Peanuts",
  "Tree nuts", "Shellfish", "Eggs", "Milk", "Soy", "Wheat", "Fish",
];

// Cache for symptom and allergy suggestions
const suggestionCache = new Map();

const simplifyMedicalTerms = (term) => {
  const termMap = {
    "Dyspnea": "Can't breathe well",
    "Thoracic pain": "Chest hurts",
    "Vertigo": "Feeling dizzy",
    "Vomiting": "Throwing up",
    "Pyrexia": "Fever",
    "Cough": "Coughing",
    "Headache": "Head hurts",
    "Nasal congestion": "Stuffy nose",
    "Fatigue": "Feeling tired",
    "Myalgia": "Muscle pain",
    "Arthralgia": "Joint pain",
    "Pharyngitis": "Sore throat",
    "Nausea": "Feeling sick to stomach",
    "Anosmia": "No smell",
    "Ageusia": "No taste",
    "Rhinorrhea": "Runny nose",
    "Chills": "Shivering",
    "Diarrhea": "Loose stools",
    "Sneezing": "Sneezing",
  };
  return termMap[term] || term.replace(/ [ (].*?[ )]/g, "").replace(/medical|syndrome|disorder|abnormality/gi, "").trim();
};

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
  const [symptomSearch, setSymptomSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [allergySuggestions, setAllergySuggestions] = useState([]);

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const hfApiKey = import.meta.env.VITE_HF_API_KEY;
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

  const fetchSuggestions = async (query, setSuggestionsFunc, isAllergy = false) => {
    if (query.trim() === "") {
      setSuggestionsFunc([]);
      return;
    }

    const cacheKey = `${isAllergy ? "allergy" : "symptom"}:${query.toLowerCase()}`;
    if (suggestionCache.has(cacheKey)) {
      setSuggestionsFunc(suggestionCache.get(cacheKey));
      return;
    }

    try {
      const apiUrl = `${NLM_SYMPTOM_API}?terms=${encodeURIComponent(query)}&maxList=50`;
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(apiUrl)}`, {
        signal: AbortSignal.timeout(2000), // Timeout after 2 seconds
      });
      if (!response.ok) {
        throw new Error("API request failed, using fallback.");
      }
      const data = await response.text();
      const parsed = JSON.parse(data);
      const labels = parsed[3] || [];
      const simplifiedLabels = labels
        .map(simplifyMedicalTerms)
        .filter(
          (label, index, self) =>
            self.indexOf(label) === index &&
            !formData[isAllergy ? "allergies" : "symptoms"].includes(label)
        );
      suggestionCache.set(cacheKey, simplifiedLabels);
      setSuggestionsFunc(simplifiedLabels);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      const fallback = isAllergy ? fallbackAllergies : fallbackSymptoms;
      const filteredFallback = fallback
        .filter(
          (item) =>
            item.toLowerCase().includes(query.toLowerCase()) &&
            !formData[isAllergy ? "allergies" : "symptoms"].includes(item)
        );
      suggestionCache.set(cacheKey, filteredFallback);
      setSuggestionsFunc(filteredFallback);
      setErrorMessage("Using fallback suggestions due to API unavailability.");
    }
  };

  // Debounced search with reduced delay (150ms)
  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(symptomSearch, setSymptomSuggestions), 150);
    return () => clearTimeout(timer);
  }, [symptomSearch]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(allergySearch, setAllergySuggestions, true), 150);
    return () => clearTimeout(timer);
  }, [allergySearch]);

  const addItem = (item, category) => {
    if (!formData[category].includes(item)) {
      setFormData((prev) => ({ ...prev, [category]: [...prev[category], item] }));
    }
    if (category === "symptoms") {
      setSymptomSearch("");
      setSymptomSuggestions([]);
    } else {
      setAllergySearch("");
      setAllergySuggestions([]);
    }
  };

  const removeItem = (item, category) => {
    setFormData((prev) => ({ ...prev, [category]: prev[category].filter((i) => i !== item) }));
  };

  const checkDrugInteractions = (medications, currentMeds) => {
    const currentMedList = currentMeds.toLowerCase().split(",").map((med) => med.trim());
    const knownInteractions = {
      ibuprofen: ["aspirin", "anticoagulants"],
      pseudoephedrine: ["maoi", "antidepressants"],
      acetaminophen: ["warfarin"],
      diphenhydramine: ["alcohol", "sedatives"],
    };

    return medications.filter((med) => {
      const medName = med.name.toLowerCase();
      const interactions = knownInteractions[medName] || [];
      return !currentMedList.some((currentMed) =>
        interactions.some((interactingDrug) => currentMed.includes(interactingDrug))
      );
    });
  };

  const sanitizeSuggestions = (medications, allergies) => {
    const seen = new Set();
    return medications.filter((med) => {
      const medName = med.split(" - ")[0].toLowerCase();
      if (seen.has(medName) || allergies.includes(medName)) {
        return false;
      }
      seen.add(medName);
      return true;
    }).slice(0, 2);
  };

  const parseAIResponse = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const parsed = {
      reasoning: "",
      otcMedications: [],
      homeRemedies: [],
      warnings: [],
      duration: "",
      disclaimer: "",
    };
    let currentSection = "";
    lines.forEach((line) => {
      if (line.startsWith("✅ Reasoning")) currentSection = "reasoning";
      else if (line.startsWith("✅ OTC Medications")) currentSection = "otcMedications";
      else if (line.startsWith("🏠 Home Remedies / Lifestyle")) currentSection = "homeRemedies";
      else if (line.startsWith("⚠️ Warnings / Avoid")) currentSection = "warnings";
      else if (line.startsWith("⏳ Duration Guidance")) currentSection = "duration";
      else if (line.startsWith("🚨 Doctor Disclaimer")) currentSection = "disclaimer";
      else if (line.trim() && currentSection) {
        if (currentSection === "otcMedications" || currentSection === "homeRemedies" || currentSection === "warnings") {
          if (!parsed[currentSection].includes(line.replace(/^- /, ""))) {
            parsed[currentSection].push(line.replace(/^- /, ""));
          }
        } else {
          parsed[currentSection] += (parsed[currentSection] ? " " : "") + line.trim();
        }
      }
    });
    return parsed;
  };

  const combineAIResponses = (openRouterText, meditronText, fdaInfo) => {
    const openRouterParsed = parseAIResponse(openRouterText);
    const meditronParsed = parseAIResponse(meditronText);

    const combined = {
      reasoning: "",
      otcMedications: [],
      homeRemedies: [],
      warnings: [],
      duration: "",
      disclaimer: "",
    };

    // Combine reasoning: Prioritize OpenRouter, append Meditron if different
    combined.reasoning = openRouterParsed.reasoning || meditronParsed.reasoning;
    if (meditronParsed.reasoning && meditronParsed.reasoning !== openRouterParsed.reasoning) {
      combined.reasoning += ` Additional perspective: ${meditronParsed.reasoning}`;
    }

    // Combine OTC medications: Take up to 2 unique, safe medications
    const allMeds = [...openRouterParsed.otcMedications, ...meditronParsed.otcMedications];
    const fdaMedNames = fdaInfo.map((item) => item.name.toLowerCase());
    combined.otcMedications = allMeds
      .filter((med) => {
        const medName = med.split(" - ")[0].toLowerCase();
        return fdaMedNames.some((fdaName) => fdaName.includes(medName)) && !formData.allergies.includes(medName);
      })
      .slice(0, 2);

    // Combine home remedies: Merge unique remedies
    combined.homeRemedies = [...new Set([...openRouterParsed.homeRemedies, ...meditronParsed.homeRemedies])];

    // Combine warnings: Merge unique warnings
    combined.warnings = [...new Set([...openRouterParsed.warnings, ...meditronParsed.warnings])];

    // Combine duration: Prioritize OpenRouter, use Meditron if empty
    combined.duration = openRouterParsed.duration || meditronParsed.duration;

    // Combine disclaimer: Use OpenRouter, append Meditron if different
    combined.disclaimer = openRouterParsed.disclaimer || meditronParsed.disclaimer;
    if (meditronParsed.disclaimer && meditronParsed.disclaimer !== openRouterParsed.disclaimer) {
      combined.disclaimer += ` Additional note: ${meditronParsed.disclaimer}`;
    }

    return combined;
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
    if (!openRouterKey || !hfApiKey) {
      setErrorMessage(
        "API key(s) missing. Please set VITE_OPENROUTER_API_KEY and VITE_HF_API_KEY in your .env file."
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

      const hasCriticalSymptom = formData.symptoms.some((symptom) =>
        criticalSymptoms.includes(symptom)
      );
      if (hasCriticalSymptom) {
        const criticalResponse = {
          reasoning: `Dear ${formData.name}, you have serious symptoms that need immediate medical attention, such as difficulty breathing or chest pain.`,
          otcMedications: [],
          homeRemedies: ["Rest and drink plenty of water."],
          warnings: ["Your symptoms are serious. Please see a doctor right away."],
          duration: "Get medical help as soon as possible.",
          disclaimer: `Dear ${formData.name}, this is not medical advice. Please consult a healthcare professional immediately.`,
        };
        setSuggestions(criticalResponse);
        setTranslatedSuggestions(criticalResponse);
        setLoading(false);
        return;
      }

      let fdaInfo = [];
      const maxRetries = 2;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const fdaFullUrl = `${fdaUrl}?search=indications_and_usage:${symptomQuery}+openfda.route:ORAL&limit=2`;
          const fdaResponse = await fetch(fdaFullUrl, { signal: AbortSignal.timeout(5000) });
          if (!fdaResponse.ok) {
            throw new Error(`FDA API error: ${fdaResponse.status}`);
          }
          const fdaData = await fdaResponse.json();
          if (fdaData?.results?.length > 0) {
            fdaInfo = fdaData.results.map((result) => ({
              name: result.openfda?.brand_name?.[0] || "Generic",
              indications: result.indications_and_usage?.[0] || "No indications available",
              dosage: result.dosage_and_administration?.[0] || "Follow standard guidelines",
              warnings: result.warnings?.[0] || "No specific warnings available",
              precautions: result.precautions?.[0] || "No precautions available",
              contraindications: result.contraindications?.[0] || "No contraindications available",
              adverse_reactions: result.adverse_reactions?.[0] || "No adverse reactions available",
              how_supplied: result.how_supplied?.[0] || "No supply information available",
              administration: result.dosage_and_administration?.[0] || "No administration details available",
              image: "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            }));
          } else {
            fdaInfo.push({
              name: "No FDA reference found",
              indications: "No details available",
              dosage: "Follow standard guidelines",
              warnings: "No specific warnings available",
              precautions: "No precautions available",
              contraindications: "No contraindications available",
              adverse_reactions: "No adverse reactions available",
              how_supplied: "No supply information available",
              administration: "No administration details available",
              image: "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            });
          }
          break;
        } catch (error) {
          if (attempt === maxRetries) {
            console.error(`FDA API failed after ${maxRetries} attempts: ${error.message}`);
            fdaInfo.push({
              name: "No FDA reference found",
              indications: "No details available",
              dosage: "Follow standard guidelines",
              warnings: "No specific warnings available",
              precautions: "No precautions available",
              contraindications: "No contraindications available",
              adverse_reactions: "No adverse reactions available",
              how_supplied: "No supply information available",
              administration: "No administration details available",
              image: "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const patientInfo = `
Patient Info:
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
      `;

      const systemPrompt = `
You are a compassionate, professional medical AI assistant acting like a human doctor, addressing the patient by name (${formData.name}). Provide safe, non-prescription (OTC) guidance based on ALL provided FDA data. NEVER prescribe medication. Always include a warning to consult a doctor. This is for educational purposes only; I am not a medical expert.

Use ALL FDA data provided to generate tailored suggestions using real FDA-approved OTC medications. Extract details like indications, dosage, administration, warnings, precautions, contraindications, adverse reactions, how supplied for accurate output. Provide reasoning based on FDA data and patient profile. Use simple, clear language that a non-medical person can understand.

Strictly format output in these sections, addressing the patient by name (${formData.name}):
✅ Reasoning (Explain in simple terms why these suggestions fit your symptoms and profile, referencing FDA indications.)
✅ OTC Medications (Provide exactly 2 distinct safe OTC options (primary and alternative) with:
- Name (use FDA brand names if available, avoid duplicates)
- Dosage (simple instructions based on age, weight, FDA dosage data)
- Timing and Administration (e.g., take in morning/evening, with food/water, based on FDA administration data)
- Precautions (simple warnings from FDA precautions, contraindications, adverse reactions)
- Source (e.g., "Available at pharmacies like CVS, Walgreens"))
🏠 Home Remedies / Lifestyle (Simple tips tailored to symptoms, age, gender, etc.)
⚠️ Warnings / Avoid (Simple warnings based on allergies, pregnancy, breastfeeding, medical history, FDA warnings/contraindications)
⏳ Duration Guidance (How long to use, when to stop, in simple terms, based on FDA data)
🚨 Doctor Disclaimer (Always consult a doctor; this is not medical advice)

Rules:
- Use ALL FDA data fields (name, indications, dosage, administration, warnings, precautions, contraindications, adverse_reactions, how_supplied) for accurate medication suggestions.
- Suggest exactly two distinct OTC medications safe for the patient's profile, excluding allergy-conflicting drugs.
- Avoid unsafe drugs (e.g., no aspirin for <18 years, no certain drugs for pregnancy/breastfeeding).
- Consider medical history and current medications for interactions.
- Use simple, non-medical language for all suggestions.
- Highlight red flags for urgent medical care (e.g., severe symptoms).
- Be empathetic, clear, and professional.
- Ensure suggestions align with FDA data provided; do not invent medication details.
      `;

      const openRouterPromise = fetch(
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
              { role: "system", content: systemPrompt },
              { role: "user", content: patientInfo },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        }
      ).then((res) => res.json()).catch((e) => ({ error: e }));

      const meditronPromise = fetch(
        "https://api-inference.huggingface.co/models/epfl-llm/meditron-7b",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `${systemPrompt}\n\n${patientInfo}`,
            parameters: { max_new_tokens: 512, return_full_text: false },
          }),
        }
      ).then((res) => res.json()).catch((e) => ({ error: e }));

      const [openRouterData, meditronData] = await Promise.all([openRouterPromise, meditronPromise]);

      let openRouterText = "";
      let meditronText = "";

      if (!openRouterData.error && openRouterData.choices?.[0]?.message?.content) {
        openRouterText = openRouterData.choices[0].message.content;
      } else {
        console.error("OpenRouter failed:", openRouterData.error);
      }

      if (!meditronData.error && meditronData[0]?.generated_text) {
        meditronText = meditronData[0].generated_text;
      } else {
        console.error("Meditron failed:", meditronData.error);
      }

      if (!openRouterText && !meditronText) {
        throw new Error("Both AI models failed to respond.");
      }

      const combinedSuggestions = combineAIResponses(openRouterText || "No response from OpenRouter.", meditronText || "No response from Meditron.", fdaInfo);
      combinedSuggestions.otcMedications = sanitizeSuggestions(combinedSuggestions.otcMedications, formData.allergies);
      combinedSuggestions.otcMedications = checkDrugInteractions(
        combinedSuggestions.otcMedications.map((med) => ({
          name: med.split(" - ")[0],
          dosage: med.split(" - ")[1] || "Follow standard guidelines",
          timing: med.split(" - ")[2] || "As needed",
          precautions: med.split(" - ")[3] || "No precautions available",
          source: med.split(" - ")[4] || "Available at pharmacies like CVS, Walgreens",
        })),
        formData.currentMedications
      ).map(
        (med) =>
          `${med.name} - ${med.dosage} - ${med.timing} - ${med.precautions} - ${med.source}`
      );

      setSuggestions(combinedSuggestions);
      setTranslatedSuggestions(combinedSuggestions);
      if (selectedLanguage !== "en") {
        await handleTranslate(combinedSuggestions);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(
        `⚠️ Failed to fetch suggestions: ${error.message}. Please verify your API keys or try again.`
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
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
                  content: `
Translate the following medical suggestions into ${
                    languages.find((lang) => lang.code === selectedLanguage)?.name || "English"
                  } with high precision, using simple, non-medical language. Preserve the exact structure, formatting, and all sections (Reasoning, OTC Medications, Home Remedies, Warnings, Duration, Disclaimer). Address the patient by name (${formData.name}). Ensure translations are culturally appropriate and maintain the original meaning.
                  `,
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
          throw new Error(`Translation API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const translatedText = aiData.choices[0]?.message.content || "Translation unavailable.";

        try {
          const parsedTranslated = JSON.parse(translatedText);
          setTranslatedSuggestions(parsedTranslated);
          break;
        } catch (error) {
          console.error("Error parsing translated JSON:", error);
          const parsedTranslated = parseAIResponse(translatedText);
          setTranslatedSuggestions(parsedTranslated);
          break;
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.error("Translation error after retries:", error);
          setErrorMessage(`Translation failed after ${maxRetries} attempts: ${error.message}. Please try again.`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setIsTranslating(false);
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.volume = 1.0;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((voice) => voice.lang.startsWith(selectedLanguage));
      utterance.voice = matchingVoice || voices[0];

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        setErrorMessage(`Speech error: ${e.error}. Try a different language or browser.`);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMessage("Text-to-speech is not supported in this browser.");
    }
  };

  const handleCancelSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getFullText = (sugs) => {
    let text = `Dear ${formData.name},\n\n`;
    if (sugs?.reasoning) text += `Reasoning:\n${sugs.reasoning}\n\n`;
    if (sugs?.otcMedications?.length > 0) text += `OTC Medications:\n${sugs.otcMedications.join("\n")}\n\n`;
    if (sugs?.homeRemedies?.length > 0) text += `Home Remedies / Lifestyle:\n${sugs.homeRemedies.join("\n")}\n\n`;
    if (sugs?.warnings?.length > 0) text += `Warnings / Avoid:\n${sugs.warnings.join("\n")}\n\n`;
    if (sugs?.duration) text += `Duration Guidance:\n${sugs.duration}\n\n`;
    if (sugs?.disclaimer) text += `Doctor Disclaimer:\n${sugs.disclaimer}`;
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
                aria-required="true"
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
                aria-required="true"
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
                  aria-required="true"
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
                      aria-checked={!isPregnant}
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
                      aria-checked={isPregnant}
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
                      aria-checked={!isBreastfeeding}
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
                      aria-checked={isBreastfeeding}
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
                aria-required="true"
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
                aria-required="true"
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
                  aria-required="true"
                >
                  <option value="" disabled>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A- ">A-</option>
                  <option value="B+">B+</option>
                  <option value="B- ">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB- ">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O- ">O-</option>
                </motion.select>
              </motion.div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${textColor}`}>
              Symptoms:
            </label>
            <div className="relative">
              <motion.input
                type="text"
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                placeholder="Type to search symptoms..."
                className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {symptomSuggestions.length > 0 && (
              <motion.ul
                className={`absolute z-10 mt-2 w-full border rounded-xl ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-200"} shadow-lg max-h-60 overflow-y-auto`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {symptomSuggestions.map((sugg, index) => (
                  <motion.li
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 ${textColor} transition-all duration-200`}
                    onClick={() => addItem(sugg, "symptoms")}
                    whileHover={{ scale: 1.02 }}
                  >
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.symptoms.map((symp, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-100 dark:bg-gray-600 px-3 py-1 rounded-full flex items-center gap-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {symp}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(symp, "symptoms")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${textColor}`}>
              Allergies:
            </label>
            <div className="relative">
              <motion.input
                type="text"
                value={allergySearch}
                onChange={(e) => setAllergySearch(e.target.value)}
                placeholder="Type to search allergies..."
                className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {allergySuggestions.length > 0 && (
              <motion.ul
                className={`absolute z-10 mt-2 w-full border rounded-xl ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-blue-200"} shadow-lg max-h-60 overflow-y-auto`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {allergySuggestions.map((sugg, index) => (
                  <motion.li
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 ${textColor} transition-all duration-200`}
                    onClick={() => addItem(sugg, "allergies")}
                    whileHover={{ scale: 1.02 }}
                  >
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.allergies.map((allg, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-100 dark:bg-gray-600 px-3 py-1 rounded-full flex items-center gap-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {allg}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(allg, "allergies")} />
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
              aria-label="Medical History"
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
              aria-label="Current Medications"
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
                    aria-label="Select Language"
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
              {(translatedSuggestions || suggestions)?.reasoning && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-green-500" size={24} />
                    Reasoning
                  </h3>
                  <motion.p
                    className={`p-4 rounded-xl ${darkMode ? "bg-green-900" : "bg-green-100"} shadow-sm`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(translatedSuggestions || suggestions).reasoning}
                  </motion.p>
                </div>
              )}
              {(translatedSuggestions || suggestions)?.otcMedications?.length > 0 && (
                <div className="space-y-6 mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-blue-500" size={24} />
                    OTC Medications
                  </h3>
                  {(translatedSuggestions || suggestions).otcMedications.slice(0, 2).map((med, index) => {
                    const [name, dosage, timing, precautions, source] = med.split(" - ");
                    return name !== "None" && (
                      <MedicineCard
                        key={index}
                        medicine={{
                          name: name || "Generic",
                          dosage: dosage || "Standard dose",
                          timing: timing || "Follow standard guidelines",
                          precautions: precautions || "No precautions available",
                          source: source || "Available at pharmacies like CVS, Walgreens",
                          image: "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                          description: index === 0 ? "Primary OTC medication for symptom relief" : "Alternative OTC medication for symptom relief",
                          sideEffects: ["Consult a pharmacist for detailed side effects"],
                          brandNames: [name || "Generic"],
                        }}
                        title={index === 0 ? "Primary Medication" : "Alternative Medication"}
                      />
                    );
                  })}
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
          src={medicine.image || "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
          alt={medicine?.name}
          loading="lazy"
          className="w-32 h-32 object-contain rounded-lg border-2 border-blue-300 shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
          }}
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
            <strong>Precautions:</strong> {medicine?.precautions}
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
        aria-expanded={isExpanded}
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