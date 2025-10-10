"use client";

import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, X, Search, Download, Volume2 } from "lucide-react";
import jsPDF from "jspdf";
import * as pdfParse from "pdf-parse";
import { DarkModeContext } from "../App";

const NLM_SYMPTOM_API = "https://clinicaltables.nlm.nih.gov/api/hpo/v3/search";
const CONSULTATION_LINK = "Consultation Page";
const suggestionCache = new Map();

// Simplify medical terms
const simplifyMedicalTerms = (term) =>
  ({
    Dyspnea: "Shortness of breath",
    "Thoracic pain": "Chest pain",
    Vertigo: "Dizziness",
    Pyrexia: "Fever",
    Cough: "Cough",
    Headache: "Headache",
    "Nasal congestion": "Congestion",
    Fatigue: "Fatigue",
    Myalgia: "Muscle pain",
    Pharyngitis: "Sore throat",
  }[term] || term.replace(/ [ (].*?[ )]/g, "").replace(/medical|syndrome|disorder|abnormality/gi, "").trim());

// Error Notification Component
function ErrorNotification({ error, onClose, darkMode }) {
  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-[20px] ${darkMode ? "bg-[#0A2A43]/20 border-white/20" : "bg-white/20 border-gray-200"} border shadow-2xl`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        <div>
          <h3 className={`text-lg font-bold ${darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]"}`}>Error ⚠️</h3>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
        </div>
        <motion.button
          onClick={onClose}
          className="p-1 rounded-full bg-red-500/20 hover:bg-red-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4 text-red-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function MediBot() {
  const { darkMode } = useContext(DarkModeContext);
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
    isPregnant: false,
    isBreastfeeding: false,
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverError, setServerError] = useState(null);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-gradient-to-br from-white to-gray-50";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-[#FDFBFB]/50" : "bg-gray-50 text-[#0A3D62] border-gray-200";

  // Debounced symptom fetching
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchSymptomSuggestions = async (query) => {
    if (!query.trim()) return setSymptomSuggestions([]);
    const cacheKey = `symptom:${query.toLowerCase()}`;
    if (suggestionCache.has(cacheKey)) return setSymptomSuggestions(suggestionCache.get(cacheKey));
    try {
      const response = await fetch(`${NLM_SYMPTOM_API}?terms=${encodeURIComponent(query)}&maxList=10`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("NLM API failed");
      const data = await response.json();
      const labels = (data[3] || []).map((item) => simplifyMedicalTerms(item[1])).filter(
        (label, i, self) => self.indexOf(label) === i && !formData.symptoms.includes(label)
      );
      suggestionCache.set(cacheKey, labels);
      setSymptomSuggestions(labels);
    } catch (error) {
      console.error("Symptom fetch error:", error);
      setSymptomSuggestions([]);
    }
  };

  const debouncedFetchSymptoms = debounce(fetchSymptomSuggestions, 300);

  useEffect(() => {
    debouncedFetchSymptoms(symptomSearch);
  }, [symptomSearch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;
    if (name === "weight" && Number(value) > 500) updatedValue = "500";
    if (name === "height" && Number(value) > 300) updatedValue = "300";
    if (name === "gender" && value !== "female") {
      setFormData((prev) => ({ ...prev, isPregnant: false, isBreastfeeding: false }));
    }
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : updatedValue }));
  };

  const addItem = (item, category) => {
    if (!item.trim()) return;
    const normalizedItem = item.toLowerCase();
    if (!formData[category].some((i) => i.toLowerCase() === normalizedItem)) {
      setFormData((prev) => ({ ...prev, [category]: [...prev[category], item.trim()] }));
    }
    if (category === "symptoms") setSymptomSearch("");
  };

  const removeItem = (item, category) => {
    setFormData((prev) => ({ ...prev, [category]: prev[category].filter((i) => i !== item) }));
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = await pdfParse(arrayBuffer);
      const text = pdfData.text;
      setFormData({
        ...formData,
        name: text.match(/Name:\s*([^\n]+)/)?.[1] || formData.name,
        symptoms: text.match(/Symptoms:\s*([^\n]+)/)?.[1]?.split(", ").map((s) => s.trim()) || formData.symptoms,
        allergies: text.match(/Allergies:\s*([^\n]+)/)?.[1]?.split(", ").map((s) => s.trim()) || formData.allergies,
        medicalHistory: text.match(/Medical History:\s*([^\n]+)/)?.[1] || formData.medicalHistory,
        currentMedications: text.match(/Current Medications:\s*([^\n]+)/)?.[1] || formData.currentMedications,
      });
    } catch (err) {
      setServerError("Failed to parse PDF.");
      setTimeout(() => setServerError(null), 5000);
    }
  };

  // Clean text for speech: Remove symbols, emojis, keep English text
  const cleanTextForSpeech = (text) => {
    return text
      .replace(/[\uD800-\uDFFF]./g, "") // Remove emojis
      .replace(/[^a-zA-Z0-9\s.,!?]/g, "") // Remove non-English symbols, keep basic punctuation
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  };

  // Listen function with enhanced error handling
  const handleListen = (text) => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel(); // Clear any existing speech
        const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
        utterance.lang = "en-US";
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => {
          console.log("Speech started");
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          console.log("Speech ended");
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error("Speech error:", event.error);
          setIsSpeaking(false);
          setErrorMessage("Speech synthesis failed. Please try again or check browser settings.");
          setTimeout(() => setErrorMessage(""), 5000);
        };
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis setup error:", error);
        setErrorMessage("Failed to initialize text-to-speech. Please try again.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } else {
      console.error("SpeechSynthesis not supported");
      setErrorMessage("Text-to-speech is not supported in this browser. Try Chrome or Firefox.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Stop listening function
  const handleStopListen = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Compile full text for speech
  const getFullText = () => {
    let text = "MediBot Health Report\n\n";
    text += "Patient Information:\n";
    text += `Name: ${formData.name}\n`;
    text += `Age: ${formData.age || "Not provided"}\n`;
    text += `Gender: ${formData.gender || "Not provided"}\n`;
    if (formData.gender === "female") {
      text += `Pregnancy: ${formData.isPregnant ? "Pregnant" : "Not Pregnant"}\n`;
      if (formData.isPregnant) {
        text += `Breastfeeding: ${formData.isBreastfeeding ? "Yes" : "No"}\n`;
      }
    }
    text += `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}\n`;
    text += `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}\n`;
    text += `Blood Group: ${formData.bloodGroup || "Not provided"}\n`;
    text += `Symptoms: ${formData.symptoms.join(", ") || "None"}\n`;
    text += `Allergies: ${formData.allergies.join(", ") || "None"}\n`;
    text += `Medical History: ${formData.medicalHistory || "None"}\n`;
    text += `Current Medications: ${formData.currentMedications || "None"}\n\n`;

    text += "Suggestions:\n";
    if (suggestions.reasoning) text += `Reasoning: ${suggestions.reasoning}\n\n`;
    if (suggestions.otcMedications?.length > 0) {
      text += "OTC Medications:\n";
      suggestions.otcMedications.slice(0, 2).forEach((med, i) => {
        text += `${i + 1}. Name: ${med.name || "Not specified"}\n`;
        text += `   Dosage: ${med.dosage || "Not specified"}\n`;
        text += `   Timing: ${med.timing || "Not specified"}\n`;
        text += `   Precautions: ${med.precautions || "Not specified"}\n`;
        text += `   Source: ${med.source || "Available at pharmacies"}\n\n`;
      });
    }
    if (suggestions.homeRemedies?.length > 0) text += "Home Remedies:\n" + suggestions.homeRemedies.map((r, i) => `${i + 1}. ${r}`).join("\n") + "\n\n";
    if (suggestions.warnings?.length > 0) text += "Warnings:\n" + suggestions.warnings.map((w, i) => `${i + 1}. ${w}`).join("\n") + "\n\n";
    if (suggestions.duration) text += `Duration: ${suggestions.duration}\n\n`;
    if (suggestions.disclaimer) text += `Disclaimer: ${suggestions.disclaimer}`;
    return text;
  };

  // Enhanced parser with flexible section detection and robust medication parsing
  const parseAIResponse = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const parsed = { reasoning: "", otcMedications: [], homeRemedies: [], warnings: [], duration: "", disclaimer: "" };
    let currentSection = "";
    let currentMed = null;

    console.log("Parsing lines:", lines); // Debug: Show raw lines

    lines.forEach((line, index) => {
      // Strip markdown and normalize
      const cleanLine = line.replace(/^(###|\*\*|\*|#+\s*)/g, "").replace(/\*\*$/g, "").trim();
      console.log(`Line ${index}:`, cleanLine); // Debug: Show each cleaned line

      // Section detection (case-insensitive, flexible matching)
      if (cleanLine.toLowerCase().includes("step-by-step reasoning") || cleanLine.toLowerCase().includes("reasoning")) {
        currentSection = "reasoning";
        currentMed = null;
      } else if (
        cleanLine.toLowerCase().includes("safe otc medications") ||
        cleanLine.toLowerCase().includes("otc medications")
      ) {
        currentSection = "otcMedications";
        currentMed = null;
      } else if (
        cleanLine.toLowerCase().includes("home remedies") ||
        cleanLine.toLowerCase().includes("lifestyle suggestions")
      ) {
        currentSection = "homeRemedies";
        currentMed = null;
      } else if (cleanLine.toLowerCase().includes("warnings") || cleanLine.toLowerCase().includes("what to avoid")) {
        currentSection = "warnings";
        currentMed = null;
      } else if (
        cleanLine.toLowerCase().includes("how long to continue") ||
        cleanLine.toLowerCase().includes("duration guidance")
      ) {
        currentSection = "duration";
        currentMed = null;
      } else if (cleanLine.toLowerCase().includes("disclaimer") || cleanLine.toLowerCase().includes("doctor disclaimer")) {
        currentSection = "disclaimer";
        currentMed = null;
      } else if (cleanLine && currentSection) {
        if (currentSection === "otcMedications") {
          // Start a new medication if line matches "1. Name" or similar
          const medStartMatch = cleanLine.match(/^\d+\.\s*([^\-]+)/);
          if (medStartMatch) {
            if (currentMed) {
              // Save previous medication if complete
              if (currentMed.name) parsed.otcMedications.push(currentMed);
            }
            currentMed = { name: medStartMatch[1].trim(), dosage: "", timing: "", precautions: "", source: "" };
          } else if (currentMed) {
            // Accumulate fields for current medication
            const fieldMatch = cleanLine.match(/(Name|Dosage|Timing|Precautions|FDA Source):\s*(.+)/i);
            if (fieldMatch) {
              const field = fieldMatch[1].toLowerCase();
              const value = fieldMatch[2].trim();
              if (field === "name") currentMed.name = value;
              else if (field === "dosage") currentMed.dosage = value;
              else if (field === "timing") currentMed.timing = value;
              else if (field === "precautions") currentMed.precautions = value;
              else if (field === "fda source") currentMed.source = value || "Available at pharmacies";
            } else {
              // Fallback: Append to precautions if no specific field
              currentMed.precautions += (currentMed.precautions ? " " : "") + cleanLine;
            }
          } else {
            // Fallback: Add raw line if no medication is being built
            parsed.otcMedications.push({ raw: cleanLine });
          }
        } else if (currentSection === "homeRemedies" || currentSection === "warnings") {
          if (cleanLine.match(/^\d+\.\s*|^-\s*|^[*]\s*/)) {
            parsed[currentSection].push(cleanLine.replace(/^\d+\.\s*|^-\s*|^[*]\s*/g, "").trim());
          }
        } else {
          parsed[currentSection] += (parsed[currentSection] ? " " : "") + cleanLine;
        }
      }
    });

    // Save the last medication if exists
    if (currentMed && currentMed.name) parsed.otcMedications.push(currentMed);

    // Fallback: If reasoning is empty, look for any text before medications
    if (!parsed.reasoning) {
      const reasoningLines = lines
        .slice(0, lines.findIndex((line) => line.toLowerCase().includes("otc medications")))
        .filter((line) => !line.toLowerCase().includes("disclaimer"))
        .join(" ");
      parsed.reasoning = reasoningLines.replace(/^(###|\*\*|\*|#+\s*)/g, "").trim() || "No detailed reasoning provided.";
    }

    console.log("Final parsed suggestions:", parsed); // Debug: Show final output
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setErrorMessage("Please provide your name, dear user.");
    if (!formData.symptoms.length) return setErrorMessage(`Please select at least one symptom, dear ${formData.name}.`);
    setErrorMessage("");
    setServerError(null);
    setLoading(true);
    setSuggestions(null);

    try {
      const payload = {
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        bloodGroup: formData.bloodGroup,
        symptoms: formData.symptoms,
        allergies: formData.allergies,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
        isPregnant: formData.isPregnant,
        isBreastfeeding: formData.isBreastfeeding,
      };
      console.log("Sending payload:", payload);
      const res = await fetch("http://localhost:4000/api/medibot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.reply || "Bad Request");
      }
      const data = await res.json();
      console.log("Raw response:", data);
      if (!data.reply) throw new Error("No reply from backend.");
      const parsed = parseAIResponse(data.reply);
      setSuggestions(parsed);
    } catch (error) {
      console.error("Submit error:", error.message);
      setServerError(error.message || "Unable to fetch suggestions.");
      setErrorMessage(`Dear ${formData.name}, an error occurred. Please try again or visit ${CONSULTATION_LINK}.`);
      setTimeout(() => setServerError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let y = margin;

    // Header
    doc.setFontSize(18).setTextColor(10, 61, 98).setFont("helvetica", "bold");
    doc.text("MediBot Health Report", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: "right" });
    y += 10;

    // Patient Information
    doc.setFontSize(14).setTextColor(8, 37, 58).text("Patient Information", margin, y);
    y += 7;
    const patientLines = [
      `Name: ${formData.name}`,
      `Age: ${formData.age || "Not provided"}`,
      `Gender: ${formData.gender || "Not provided"}`,
      ...(formData.gender === "female" ? [`Pregnancy: ${formData.isPregnant ? "Pregnant" : "Not Pregnant"}`] : []),
      ...(formData.isPregnant ? [`Breastfeeding: ${formData.isBreastfeeding ? "Yes" : "No"}`] : []),
      `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}`,
      `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}`,
      `Blood Group: ${formData.bloodGroup || "Not provided"}`,
      `Symptoms: ${formData.symptoms.join(", ") || "None"}`,
      `Allergies: ${formData.allergies.join(", ") || "None"}`,
      `Medical History: ${formData.medicalHistory || "None"}`,
      `Current Medications: ${formData.currentMedications || "None"}`,
    ];
    patientLines.forEach((line) => {
      if (y > doc.internal.pageSize.height - margin * 2) {
        doc.addPage();
        y = margin;
      }
      const lines = doc.splitTextToSize(line, pageWidth - margin * 2);
      lines.forEach((l) => {
        doc.text(l, margin, y);
        y += 7;
      });
    });
    y += 7;

    doc.setDrawColor(10, 61, 98).line(margin, y, pageWidth - margin, y);
    y += 7;

    // Suggestions
    doc.setFontSize(14).setTextColor(8, 37, 58).text("Suggestions", margin, y);
    y += 7;

    const sections = [
      { title: "Reasoning", key: "reasoning", format: (item) => item },
      {
        title: "OTC Medications",
        key: "otcMedications",
        format: (item, i) => [
          `${i + 1}. ${item.name || "Not specified"}`,
          `   Dosage: ${item.dosage || "Not specified"}`,
          `   Timing: ${item.timing || "Not specified"}`,
          `   Precautions: ${item.precautions || "Not specified"}`,
          `   Source: ${item.source || "Available at pharmacies"}`,
        ],
      },
      { title: "Home Remedies & Lifestyle Suggestions", key: "homeRemedies", format: (item, i) => `${i + 1}. ${item}` },
      { title: "Warnings / What to Avoid", key: "warnings", format: (item, i) => `${i + 1}. ${item}` },
      { title: "How long to continue the treatment safely", key: "duration", format: (item) => item },
      { title: "Disclaimer", key: "disclaimer", format: (item) => item },
    ];

    sections.forEach(({ title, key, format }) => {
      if (suggestions?.[key]) {
        doc.setFontSize(12).setTextColor(10, 61, 98).text(`${title}:`, margin, y);
        y += 7;
        const items = Array.isArray(suggestions[key]) ? suggestions[key] : [suggestions[key]];
        items.forEach((item, i) => {
          const textLines = Array.isArray(format(item, i)) ? format(item, i) : [format(item, i)];
          textLines.forEach((text) => {
            const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
            lines.forEach((line) => {
              if (y > doc.internal.pageSize.height - margin * 2) {
                doc.addPage();
                y = margin;
              }
              doc.text(line, margin, y);
              y += 7;
            });
          });
        });
        y += 7;
      }
    });

    // Add page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i).setFontSize(10).setTextColor(10, 61, 98);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - margin, { align: "center" });
    }

    doc.save("medibot_report.pdf");
  };

  return (
    <>
      <Helmet>
        <title>MediBot Suggestions</title>
        <meta name="description" content="Personalized OTC medication suggestions." />
      </Helmet>

      <AnimatePresence>
        {serverError && <ErrorNotification error={serverError} onClose={() => setServerError(null)} darkMode={darkMode} />}
      </AnimatePresence>

      <div className={`max-w-5xl mx-auto p-6 ${textColor}`}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500"
        >
          MediBot Suggestions
        </motion.h1>

        {errorMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-[20px] bg-red-100 text-red-700 border border-red-200">
            {errorMessage}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`space-y-6 p-6 rounded-[20px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700`}
        >
          <div>
            <label className={`text-sm font-medium ${textColor}`}>Upload PDF</label>
            <motion.input type="file" accept="application/pdf" onChange={handlePDFUpload} className={`w-full p-3 border rounded-xl ${inputBg}`} whileFocus={{ scale: 1.02 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={`text-sm font-medium ${textColor}`}>
                Name
              </label>
              <motion.input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl ${inputBg}`}
                required
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div>
              <label htmlFor="age" className={`text-sm font-medium ${textColor}`}>
                Age
              </label>
              <motion.input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl ${inputBg}`}
                min="0"
                max="120"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div>
              <label htmlFor="gender" className={`text-sm font-medium ${textColor}`}>
                Gender
              </label>
              <motion.div className="relative">
                <motion.select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl ${inputBg} appearance-none`}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </motion.select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </motion.div>
            </div>
            {formData.gender === "female" && (
              <div className="md:col-span-2">
                <label className={`text-sm font-medium ${textColor}`}>Pregnancy</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPregnant"
                      checked={!formData.isPregnant}
                      onChange={() => setFormData({ ...formData, isPregnant: false })}
                      className="mr-2 accent-[#0A3D62]"
                    />
                    <span className={textColor}>Not Pregnant</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPregnant"
                      checked={formData.isPregnant}
                      onChange={() => setFormData({ ...formData, isPregnant: true })}
                      className="mr-2 accent-[#0A3D62]"
                    />
                    <span className={textColor}>Pregnant</span>
                  </label>
                </div>
              </div>
            )}
            {formData.isPregnant && (
              <div className="md:col-span-2">
                <label className={`text-sm font-medium ${textColor}`}>Breastfeeding</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isBreastfeeding"
                      checked={!formData.isBreastfeeding}
                      onChange={() => setFormData({ ...formData, isBreastfeeding: false })}
                      className="mr-2 accent-[#0A3D62]"
                    />
                    <span className={textColor}>No</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isBreastfeeding"
                      checked={formData.isBreastfeeding}
                      onChange={() => setFormData({ ...formData, isBreastfeeding: true })}
                      className="mr-2 accent-[#0A3D62]"
                    />
                    <span className={textColor}>Yes</span>
                  </label>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="weight" className={`text-sm font-medium ${textColor}`}>
                Weight (kg)
              </label>
              <motion.input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl ${inputBg}`}
                min="1"
                max="500"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.weight) > 500 && <p className="text-red-500 text-xs">Weight exceeds limit.</p>}
            </div>
            <div>
              <label htmlFor="height" className={`text-sm font-medium ${textColor}`}>
                Height (cm)
              </label>
              <motion.input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl ${inputBg}`}
                min="1"
                max="300"
                whileFocus={{ scale: 1.02 }}
              />
              {Number(formData.height) > 300 && <p className="text-red-500 text-xs">Height exceeds limit.</p>}
            </div>
            <div>
              <label htmlFor="bloodGroup" className={`text-sm font-medium ${textColor}`}>
                Blood Group
              </label>
              <motion.div className="relative">
                <motion.select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl ${inputBg} appearance-none`}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </motion.select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </motion.div>
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${textColor}`}>Symptoms</label>
            <div className="relative">
              <motion.input
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                placeholder="Search symptoms..."
                className={`w-full p-3 pr-10 border rounded-xl ${inputBg}`}
                onKeyDown={(e) => e.key === "Enter" && addItem(symptomSearch, "symptoms")}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {symptomSuggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-1 border rounded-xl max-h-40 overflow-y-auto ${darkMode ? "bg-[#0A2A43]/80 border-[#FDFBFB]/50" : "bg-gray-50 border-gray-200"}`}
              >
                {symptomSuggestions.map((sugg, i) => (
                  <motion.li
                    key={i}
                    className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 ${textColor}`}
                    onClick={() => addItem(sugg, "symptoms")}
                    whileHover={{ scale: 1.02 }}
                  >
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.symptoms.map((symp, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-1 rounded-xl flex items-center gap-1 border ${darkMode ? "bg-[#0A2A43]/50 border-[#FDFBFB]/50" : "bg-gray-100 border-gray-200"}`}
                >
                  {symp}
                  <X size={14} className="cursor-pointer" onClick={() => removeItem(symp, "symptoms")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium ${textColor}`}>Allergies</label>
            <div className="relative">
              <motion.input
                value={formData.allergies.join(", ")}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(",").map((a) => a.trim()).filter(Boolean) })}
                placeholder="Enter allergies (comma-separated)..."
                className={`w-full p-3 pr-10 border rounded-xl ${inputBg}`}
                whileFocus={{ scale: 1.02 }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.allergies.map((allg, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-1 rounded-xl flex items-center gap-1 border ${darkMode ? "bg-[#0A2A43]/50 border-[#FDFBFB]/50" : "bg-gray-100 border-gray-200"}`}
                >
                  {allg}
                  <X size={14} className="cursor-pointer" onClick={() => removeItem(allg, "allergies")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="medicalHistory" className={`text-sm font-medium ${textColor}`}>
              Medical History
            </label>
            <motion.textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-xl ${inputBg}`}
              rows="3"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label htmlFor="currentMedications" className={`text-sm font-medium ${textColor}`}>
              Current Medications
            </label>
            <motion.textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-xl ${inputBg}`}
              rows="3"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-[#0A3D62] text-[#FDFBFB] rounded-xl hover:bg-[#08253A] disabled:opacity-50 transition-all duration-300 backdrop-filter backdrop-blur-sm bg-opacity-70 border border-white/20`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Fetching..." : "Get Suggestions"}
          </motion.button>
        </motion.form>

        {suggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 p-6 rounded-[20px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700`}
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500 flex items-center justify-between">
              Suggestions for {formData.name}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleListen(getFullText())}
                  disabled={isSpeaking}
                  className={`p-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all duration-300 backdrop-filter backdrop-blur-sm bg-opacity-70 border border-white/20 ${
                    darkMode ? "bg-[#0A2A43]/50 text-[#FDFBFB]" : "bg-white/50 text-[#0A3D62]"
                  } hover:bg-opacity-90 hover:scale-105`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Volume2 size={18} />
                  {isSpeaking ? "Speaking..." : "Listen"}
                </motion.button>
                {isSpeaking && (
                  <motion.button
                    onClick={handleStopListen}
                    className="p-2 bg-red-500/70 text-white rounded-xl hover:bg-red-600/90 flex items-center gap-2 transition-all duration-300 backdrop-filter backdrop-blur-sm bg-opacity-70 border border-white/20 hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X size={18} />
                    Stop Listening
                  </motion.button>
                )}
                <motion.button
                  onClick={downloadReport}
                  className={`p-2 rounded-xl flex items-center gap-2 transition-all duration-300 backdrop-filter backdrop-blur-sm bg-opacity-70 border border-white/20 ${
                    darkMode ? "bg-[#0A2A43]/50 text-[#FDFBFB]" : "bg-white/50 text-[#0A3D62]"
                  } hover:bg-opacity-90 hover:scale-105`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={18} />
                  Download Report
                </motion.button>
              </div>
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Information:</h3>
              {[
                `Name: ${formData.name}`,
                `Age: ${formData.age || "Not provided"}`,
                `Gender: ${formData.gender || "Not provided"}`,
                ...(formData.gender === "female" ? [`Pregnancy: ${formData.isPregnant ? "Pregnant" : "Not Pregnant"}`] : []),
                ...(formData.isPregnant ? [`Breastfeeding: ${formData.isBreastfeeding ? "Yes" : "No"}`] : []),
                `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}`,
                `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}`,
                `Blood Group: ${formData.bloodGroup || "Not provided"}`,
                `Symptoms: ${formData.symptoms.join(", ") || "None"}`,
                `Allergies: ${formData.allergies.join(", ") || "None"}`,
                `Medical History: ${formData.medicalHistory || "None"}`,
                `Current Medications: ${formData.currentMedications || "None"}`,
              ].map((info, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-2 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} border border-gray-200 dark:border-[#FDFBFB]/50`}
                >
                  {info}
                </motion.p>
              ))}
            </div>
            {suggestions.reasoning && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-green-500" size={20} />
                  Reasoning
                </h3>
                <p className={`p-2 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} border border-gray-200 dark:border-[#FDFBFB]/50`}>
                  {suggestions.reasoning}
                </p>
              </div>
            )}
            {suggestions.otcMedications?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-[#0A3D62] dark:text-[#FDFBFB]" size={20} />
                  OTC Medications
                </h3>
                {suggestions.otcMedications.slice(0, 2).map((med, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} border border-gray-200 dark:border-[#FDFBFB]/50 mb-2`}
                  >
                    <h4 className={`font-semibold ${textColor}`}>{i === 0 ? "Primary" : "Alternative"} Medication</h4>
                    {med.raw ? (
                      <p className={textColor}>{med.raw}</p>
                    ) : (
                      <>
                        <p className={textColor}><strong>Name:</strong> {med.name || "Not specified"}</p>
                        <p className={textColor}><strong>Dosage:</strong> {med.dosage || "Not specified"}</p>
                        <p className={textColor}><strong>Timing:</strong> {med.timing || "Not specified"}</p>
                        <p className={textColor}><strong>Precautions:</strong> {med.precautions || "Not specified"}</p>
                        <p className={textColor}><strong>Source:</strong> {med.source || "Available at pharmacies"}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {suggestions.homeRemedies?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-[#0A3D62] dark:text-[#FDFBFB]" size={20} />
                  Home Remedies
                </h3>
                {suggestions.homeRemedies.map((remedy, i) => (
                  <p
                    key={i}
                    className={`p-2 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} border border-gray-200 dark:border-[#FDFBFB]/50`}
                  >
                    {i + 1}. {remedy}
                  </p>
                ))}
              </div>
            )}
            {suggestions.warnings?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-yellow-500" size={20} />
                  Warnings
                </h3>
                {suggestions.warnings.map((warning, i) => (
                  <p
                    key={i}
                    className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700"
                  >
                    {i + 1}. {warning}
                  </p>
                ))}
              </div>
            )}
            {suggestions.duration && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-[#0A3D62] dark:text-[#FDFBFB]" size={20} />
                  Duration
                </h3>
                <p className={`p-2 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} border border-gray-200 dark:border-[#FDFBFB]/50`}>
                  {suggestions.duration}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Disclaimer
              </h3>
              <p className="p-2 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700">
                {suggestions.disclaimer || `Dear ${formData.name}, consult a doctor before taking any medication. This is not medical advice.`}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default MediBot;