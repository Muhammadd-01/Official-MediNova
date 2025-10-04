"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, Pill, Clock, Volume2, X, Search, Download } from "lucide-react";
import { AuthContext, DarkModeContext } from "../App";
import axios from "axios";
import jsPDF from 'jspdf';
import useMediBotAI from "../components/MediBotAI"; // Import the AI logic

// Medicine Card Component (keep this as is)
function MedicineCard({ medicine, title }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`p-6 rounded-[40px] shadow-md overflow-hidden relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl ${darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50"}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0A3D62] to-blue-500 transform rotate-45 translate-x-12 -translate-y-12 opacity-10"></div>
      <h4 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h4>
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-4">
        <motion.div whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-[40px]">
          <img src={medicine.image} alt={medicine?.name} loading="lazy" className="w-32 h-32 object-contain border border-gray-200 dark:border-[#FDFBFB]/50 shadow-md transition-transform duration-300" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1587855726752-62b3629bd00e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"} />
        </motion.div>
        <div className="flex-1">
          <h5 className={`text-lg font-semibold ${textColor}`}>{medicine?.name}</h5>
          <p className={`text-sm ${textColor} opacity-80 mb-2`}>{medicine?.description}</p>
          <p className={`text-sm ${textColor} mb-2`}><strong>Dosage:</strong> {medicine?.dosage}</p>
          <p className={`text-sm ${textColor} mb-2`}><strong>Timing and Administration:</strong> {medicine?.timing}</p>
          <p className={`text-sm ${textColor} mb-2`}><strong>Precautions:</strong> {medicine?.precautions}</p>
          <p className={`text-sm ${textColor} mb-2`}><strong>Source:</strong> {medicine?.source}</p>
        </div>
      </div>
      <motion.div initial="collapsed" animate={isExpanded ? "expanded" : "collapsed"} variants={{ expanded: { height: "auto", opacity: 1 }, collapsed: { height: 0, opacity: 0 } }} transition={{ duration: 0.3 }} className="overflow-hidden">
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Side Effects:</h5>
        <ul className={`list-disc list-inside ${textColor} text-sm`}>
          {medicine?.sideEffects?.map((effect, index) => <li key={index}>{effect}</li>)}
        </ul>
        <h5 className={`font-semibold mt-2 ${textColor} text-sm`}>Brand Names:</h5>
        <p className={`${textColor} text-sm`}>{medicine?.brandNames?.join(", ") || "N/A"}</p>
      </motion.div>
      <motion.button className={`${textColor} hover:text-[#0A3D62] dark:hover:text-[#FDFBFB] transition-all duration-300 flex items-center text-sm mt-4`} onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-expanded={isExpanded}>
        {isExpanded ? "Show Less" : "Show More"}
        {isExpanded ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />}
      </motion.button>
    </motion.div>
  );
}

function MediBot() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  
  // Use the AI logic custom hook
  const {
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
  } = useMediBotAI();

  // Form state
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
  
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [allergySuggestions, setAllergySuggestions] = useState([]);
  const [isFetchingSymptoms, setIsFetchingSymptoms] = useState(false);
  const [isFetchingAllergies, setIsFetchingAllergies] = useState(false);

  const symptomSearchRef = useRef(null);
  const allergySearchRef = useRef(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data) {
          const dobValue = data.dob || data.dateOfBirth || "";
          const formattedAge = dobValue ? calculateAge(dobValue) : "";

          setFormData({
            name: data.fullName || "",
            age: formattedAge,
            gender: data.gender || "",
            weight: "",
            height: "",
            bloodGroup: data.bloodGroup || "",
            symptoms: [],
            allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
            medicalHistory: data.history || "",
            currentMedications: data.medications || "",
          });

          if (data.gender === "male") {
            setIsPregnant(false);
            setIsBreastfeeding(false);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "weight" && Number(value) > 500) updatedValue = "500";
    if (name === "height" && Number(value) > 300) updatedValue = "300";

    if (name === "gender" && value === "male") {
      setIsPregnant(false);
      setIsBreastfeeding(false);
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  // Fetch suggestions for symptoms and allergies
  useEffect(() => {
    debouncedFetchSuggestions(symptomSearch, setSymptomSuggestions, false);
  }, [symptomSearch]);

  useEffect(() => {
    debouncedFetchSuggestions(allergySearch, setAllergySuggestions, true);
  }, [allergySearch]);

  // Add/remove items from symptoms and allergies
  const addItem = (item, category) => {
    const normalizedItem = item.toLowerCase();
    if (!formData[category].some(i => i.toLowerCase() === normalizedItem)) {
      setFormData((prev) => ({ ...prev, [category]: [...prev[category], item] }));
    }
    category === "symptoms" ? setSymptomSearch("") && setSymptomSuggestions([]) : setAllergySearch("") && setAllergySuggestions([]);
  };

  const removeItem = (item, category) => {
    setFormData((prev) => ({ ...prev, [category]: prev[category].filter((i) => i !== item) }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await processSymptoms(formData, isPregnant, isBreastfeeding);
  };

  // Text-to-speech handlers
  const handleSpeakText = () => {
    handleSpeak(getFullText(suggestions, formData, isPregnant, isBreastfeeding), formData, setIsSpeaking);
  };

  const handleCancelSpeakText = () => {
    handleCancelSpeak(setIsSpeaking);
  };

  // Download PDF report
  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const lineHeight = 7;
    let y = margin;

    // Colors
    const headerColor = [10, 61, 98]; // #0A3D62
    const textColor = [0, 0, 0]; // Black
    const sectionColor = [8, 37, 58]; // Darker blue #08253A

    // Header
    doc.setTextColor(...headerColor);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MediNova Medical Report", pageWidth / 2, y, { align: "center" });
    y += lineHeight * 2;

    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: "right" });
    y += lineHeight * 2;

    // Patient Information Section
    doc.setTextColor(...sectionColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", margin, y);
    y += lineHeight;

    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const patientLines = [
      `Name: ${formData.name}`,
      `Age: ${formData.age || "Not provided"}`,
      `Gender: ${formData.gender || "Not provided"}`,
      ...(formData.gender === "female" ? [`Pregnancy Status: ${isPregnant ? "Pregnant" : "Not Pregnant"}`] : []),
      ...(isPregnant ? [`Breastfeeding Status: ${isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}`] : []),
      `Weight: ${formData.weight ? `${formData.weight} kg` : "Not provided"}`,
      `Height: ${formData.height ? `${formData.height} cm` : "Not provided"}`,
      `Blood Group: ${formData.bloodGroup || "Not provided"}`,
      `Symptoms: ${formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}`,
      `Allergies: ${formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}`,
      `Medical History: ${formData.medicalHistory || "Not provided"}`,
      `Current Medications: ${formData.currentMedications || "Not provided"}`,
    ];

    patientLines.forEach((line) => {
      if (y > doc.internal.pageSize.height - margin * 2) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += lineHeight;

    doc.setDrawColor(...headerColor);
    doc.line(margin, y, pageWidth - margin, y);
    y += lineHeight;

    // Suggestions Section
    doc.setTextColor(...sectionColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Suggestions", margin, y);
    y += lineHeight;

    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    if (suggestions?.reasoning) {
      doc.setTextColor(...headerColor);
      doc.text("Reasoning:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      const reasoningLines = doc.splitTextToSize(suggestions.reasoning, pageWidth - margin * 2);
      reasoningLines.forEach((line) => {
        if (y > doc.internal.pageSize.height - margin * 2) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += lineHeight;
    }

    if (suggestions?.otcMedications?.length > 0) {
      doc.setTextColor(...headerColor);
      doc.text("OTC Medications:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      suggestions.otcMedications.forEach((med, index) => {
        const medLine = `${index + 1}. ${med.name} - Dosage: ${med.dosage} - Timing: ${med.timing} - Precautions: ${med.precautions} - Source: ${med.source}`;
        const medLines = doc.splitTextToSize(medLine, pageWidth - margin * 2);
        medLines.forEach((line) => {
          if (y > doc.internal.pageSize.height - margin * 2) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
      y += lineHeight;
    }

    if (suggestions?.homeRemedies?.length > 0) {
      doc.setTextColor(...headerColor);
      doc.text("Home Remedies / Lifestyle:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      suggestions.homeRemedies.forEach((remedy) => {
        const remedyLines = doc.splitTextToSize(remedy, pageWidth - margin * 2);
        remedyLines.forEach((line) => {
          if (y > doc.internal.pageSize.height - margin * 2) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
      y += lineHeight;
    }

    if (suggestions?.warnings?.length > 0) {
      doc.setTextColor(...headerColor);
      doc.text("Warnings / Avoid:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      suggestions.warnings.forEach((warning) => {
        const warningLines = doc.splitTextToSize(warning, pageWidth - margin * 2);
        warningLines.forEach((line) => {
          if (y > doc.internal.pageSize.height - margin * 2) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });
      y += lineHeight;
    }

    if (suggestions?.duration) {
      doc.setTextColor(...headerColor);
      doc.text("Duration Guidance:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      const durationLines = doc.splitTextToSize(suggestions.duration, pageWidth - margin * 2);
      durationLines.forEach((line) => {
        if (y > doc.internal.pageSize.height - margin * 2) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += lineHeight;
    }

    if (suggestions?.disclaimer) {
      doc.setTextColor(...headerColor);
      doc.text("Doctor Disclaimer:", margin, y);
      y += lineHeight;
      doc.setTextColor(...textColor);
      const disclaimerLines = doc.splitTextToSize(suggestions.disclaimer, pageWidth - margin * 2);
      disclaimerLines.forEach((line) => {
        if (y > doc.internal.pageSize.height - margin * 2) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += lineHeight * 2;
    }

    // Dummy Signature
    if (y > doc.internal.pageSize.height - margin * 3) {
      doc.addPage();
      y = margin;
    }
    doc.setTextColor(...sectionColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Authorized by:", margin, y);
    y += lineHeight;
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. MediNova (Dummy Signature)", margin, y);
    y += lineHeight;
    doc.text("MediNova Healthcare", margin, y);

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(...headerColor);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - margin, { align: "center" });
      doc.text("Confidential - For Patient Use Only", margin, doc.internal.pageSize.height - margin);
    }

    doc.save('medinova_report.pdf');
  };

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-gradient-to-br from-white to-gray-50";
  const inputBg = darkMode ? "bg-[#0A2A43]/80 text-[#FDFBFB] border-[#FDFBFB]/50" : "bg-gray-50 text-[#0A3D62] border-gray-200";

  return (
    <>
      <Helmet>
        <title>Medicine Suggestions - MediNova</title>
        <meta name="description" content="Receive personalized, safe, and FDA-informed OTC medication suggestions based on your symptoms." />
        <link rel="canonical" href="https://www.MediNova.com/medicine-suggestion" />
      </Helmet>

      <div className={`max-w-5xl mx-auto p-6 sm:p-8 ${textColor}`}>
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500">
          Personalized Medicine Suggestions
        </motion.h1>

        {errorMessage && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="mb-6 p-4 rounded-[40px] bg-red-100 text-red-700 shadow-md border border-red-200">
            {errorMessage}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className={`mb-10 space-y-8 p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl`}>
          {/* Form fields remain exactly the same as in your original code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-medium ${textColor}`}>Name:</label>
              <motion.input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} required aria-required="true" whileFocus={{ scale: 1.02 }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className={`block text-sm font-medium ${textColor}`}>Age:</label>
              <motion.input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} required min="0" max="120" aria-required="true" whileFocus={{ scale: 1.02 }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className={`block text-sm font-medium ${textColor}`}>Gender:</label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`} required aria-required="true">
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </motion.select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </motion.div>
            </div>
            {formData.gender === "female" && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>Pregnancy Status:</label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input type="radio" id="not-pregnant" name="pregnancyStatus" value="not-pregnant" checked={!isPregnant} onChange={() => setIsPregnant(false)} className="mr-2 accent-[#0A3D62] w-5 h-5" aria-checked={!isPregnant} />
                    <label htmlFor="not-pregnant" className={textColor}>Not Pregnant</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="pregnant" name="pregnancyStatus" value="pregnant" checked={isPregnant} onChange={() => setIsPregnant(true)} className="mr-2 accent-[#0A3D62] w-5 h-5" aria-checked={isPregnant} />
                    <label htmlFor="pregnant" className={textColor}>Pregnant</label>
                  </div>
                </div>
              </div>
            )}
            {isPregnant && (
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${textColor}`}>Breastfeeding Status:</label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input type="radio" id="not-breastfeeding" name="breastfeedingStatus" value="not-breastfeeding" checked={!isBreastfeeding} onChange={() => setIsBreastfeeding(false)} className="mr-2 accent-[#0A3D62] w-5 h-5" aria-checked={!isBreastfeeding} />
                    <label htmlFor="not-breastfeeding" className={textColor}>Not Breastfeeding</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="breastfeeding" name="breastfeedingStatus" value="breastfeeding" checked={isBreastfeeding} onChange={() => setIsBreastfeeding(true)} className="mr-2 accent-[#0A3D62] w-5 h-5" aria-checked={isBreastfeeding} />
                    <label htmlFor="breastfeeding" className={textColor}>Breastfeeding</label>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="weight" className={`block text-sm font-medium ${textColor}`}>Weight (kg):</label>
              <motion.input type="number" id="weight" name="weight" value={formData.weight} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} required min="1" max="500" aria-required="true" whileFocus={{ scale: 1.02 }} />
              {Number(formData.weight) > 500 && <p className="text-red-500 text-sm mt-1">Weight exceeds our database limit. Please consult a doctor.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className={`block text-sm font-medium ${textColor}`}>Height (cm):</label>
              <motion.input type="number" id="height" name="height" value={formData.height} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} required min="1" max="300" aria-required="true" whileFocus={{ scale: 1.02 }} />
              {Number(formData.height) > 300 && <p className="text-red-500 text-sm mt-1">Height exceeds our database limit. Please consult a doctor.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className={`block text-sm font-medium ${textColor}`}>Blood Group:</label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                <motion.select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300 appearance-none`} required aria-required="true">
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
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </motion.div>
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className={`block text-sm font-medium ${textColor}`}>Symptoms:</label>
            <div className="relative">
              <motion.input type="text" ref={symptomSearchRef} value={symptomSearch} onChange={(e) => setSymptomSearch(e.target.value)} placeholder="Type to search symptoms..." className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} whileFocus={{ scale: 1.02 }} />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {isFetchingSymptoms && <p className="text-sm text-gray-500">Fetching symptoms...</p>}
            {symptomSuggestions.length > 0 && (
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`relative z-20 mt-2 border rounded-xl shadow-lg max-h-60 overflow-y-auto ${darkMode ? "bg-[#0A2A43]/80 border-[#FDFBFB]/50" : "bg-gray-50 border-gray-200"}`}>
                {symptomSuggestions.map((sugg, index) => (
                  <motion.li key={index} className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 ${textColor} transition-all duration-200`} onClick={() => addItem(sugg, "symptoms")} whileHover={{ scale: 1.02 }}>
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.symptoms.map((symp, index) => (
                <motion.div key={index} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gray-100 dark:bg-[#0A2A43]/50 px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-[#FDFBFB]/50">
                  {symp}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(symp, "symptoms")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className={`block text-sm font-medium ${textColor}`}>Allergies:</label>
            <div className="relative">
              <motion.input type="text" ref={allergySearchRef} value={allergySearch} onChange={(e) => setAllergySearch(e.target.value)} placeholder="Type to search allergies..." className={`w-full p-4 pr-12 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} whileFocus={{ scale: 1.02 }} />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {isFetchingAllergies && <p className="text-sm text-gray-500">Fetching allergies...</p>}
            {allergySuggestions.length > 0 && (
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`relative z-20 mt-2 border rounded-xl shadow-lg max-h-60 overflow-y-auto ${darkMode ? "bg-[#0A2A43]/80 border-[#FDFBFB]/50" : "bg-gray-50 border-gray-200"}`}>
                {allergySuggestions.map((sugg, index) => (
                  <motion.li key={index} className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 ${textColor} transition-all duration-200`} onClick={() => addItem(sugg, "allergies")} whileHover={{ scale: 1.02 }}>
                    {sugg}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.allergies.map((allg, index) => (
                <motion.div key={index} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gray-100 dark:bg-[#0A2A43]/50 px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-[#FDFBFB]/50">
                  {allg}
                  <X size={16} className="cursor-pointer" onClick={() => removeItem(allg, "allergies")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="medicalHistory" className={`block text-sm font-medium ${textColor}`}>Medical History:</label>
            <motion.textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} rows="4" whileFocus={{ scale: 1.02 }} aria-label="Medical History" />
          </div>
          <div className="space-y-2">
            <label htmlFor="currentMedications" className={`block text-sm font-medium ${textColor}`}>Current Medications:</label>
            <motion.textarea id="currentMedications" name="currentMedications" value={formData.currentMedications} onChange={handleInputChange} className={`w-full p-4 border rounded-xl ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-all duration-300`} rows="4" whileFocus={{ scale: 1.02 }} aria-label="Current Medications" />
          </div>
          <motion.button type="submit" disabled={loading} className={`w-full mt-6 bg-[#0A3D62] text-[#FDFBFB] px-6 py-4 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            {loading ? "Fetching Suggestions..." : "Get Personalized Suggestions"}
          </motion.button>
        </motion.form>

        {/* Results section remains exactly the same */}
        <AnimatePresence>
          {suggestions && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className={`mt-10 p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl`}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500">
                <Pill size={28} /> Personalized Suggestions for {formData.name}
              </h2>
              {isExtreme && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="mb-6 p-4 rounded-[40px] bg-yellow-100 text-yellow-700 shadow-md border border-yellow-200 flex items-center gap-4">
                  <AlertCircle size={24} />
                  <div>
                    <p>This condition appears uncommon or extreme and requires professional consultation.</p>
                    <a href={CONSULTATION_LINK} className="bg-[#0A3D62] text-white px-4 py-2 rounded-xl mt-2 inline-block hover:bg-[#08253A] transition-all duration-300">Book Consultation</a>
                  </div>
                </motion.div>
              )}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Your Provided Information:</h3>
                <ul className="space-y-3">
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Name:</strong> {formData.name}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Age:</strong> {formData.age || "Not provided"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Gender:</strong> {formData.gender || "Not provided"}
                  </motion.li>
                  {formData.gender === "female" && (
                    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                      <strong>Pregnancy Status:</strong> {isPregnant ? "Pregnant" : "Not Pregnant"}
                    </motion.li>
                  )}
                  {isPregnant && (
                    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                      <strong>Breastfeeding Status:</strong> {isBreastfeeding ? "Breastfeeding" : "Not Breastfeeding"}
                    </motion.li>
                  )}
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : "Not provided"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Height:</strong> {formData.height ? `${formData.height} cm` : "Not provided"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Blood Group:</strong> {formData.bloodGroup || "Not provided"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Symptoms:</strong> {formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(", ") : "None selected"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Medical History:</strong> {formData.medicalHistory || "Not provided"}
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    <strong>Current Medications:</strong> {formData.currentMedications || "Not provided"}
                  </motion.li>
                </ul>
              </div>
              <div className="flex items-center mb-8 gap-4 flex-wrap">
                <motion.button onClick={handleSpeakText} disabled={isSpeaking} className={`bg-[#0A3D62] text-[#FDFBFB] px-5 py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] flex items-center gap-2`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Volume2 size={20} />
                  {isSpeaking ? "Speaking..." : "Listen"}
                </motion.button>
                {isSpeaking && (
                  <motion.button onClick={handleCancelSpeakText} className={`bg-red-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-600 hover:shadow-md transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <X size={20} />
                    Cancel Listening
                  </motion.button>
                )}
                <motion.button onClick={downloadReport} className={`bg-[#0A3D62] text-[#FDFBFB] px-5 py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] flex items-center gap-2`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Download size={20} />
                  Download Report
                </motion.button>
              </div>
              {suggestions?.reasoning && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-green-500" size={24} />
                    Reasoning
                  </h3>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    {suggestions.reasoning}
                  </motion.p>
                </div>
              )}
              {suggestions?.otcMedications?.length > 0 && (
                <div className="space-y-6 mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    OTC Medications
                  </h3>
                  {suggestions.otcMedications.slice(0, 2).map((med, index) => (
                    <MedicineCard key={index} medicine={{ name: med.name || "Generic", dosage: med.dosage || "Standard dose", timing: med.timing || "Follow standard guidelines", precautions: med.precautions || "No precautions available", source: med.source || "Available at pharmacies like CVS, Walgreens", image: med.image, description: index === 0 ? "Primary OTC medication for symptom relief" : "Alternative OTC medication for symptom relief", sideEffects: ["Consult a pharmacist for detailed side effects"], brandNames: [med.name || "Generic"] }} title={index === 0 ? "Primary Medication" : "Alternative Medication"} />
                  ))}
                </div>
              )}
              {suggestions?.homeRemedies?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Pill className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    Home Remedies / Lifestyle
                  </h3>
                  <ul className="space-y-3">
                    {suggestions.homeRemedies.map((remedy, index) => (
                      <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50 hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70 transition-all duration-300`}>
                        {remedy}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestions?.warnings?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-yellow-500" size={24} />
                    Warnings / Avoid
                  </h3>
                  <ul className="space-y-3">
                    {suggestions.warnings.map((warning, index) => (
                      <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all duration-300`}>
                        {warning}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestions?.duration && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="text-[#0A3D62] dark:text-[#FDFBFB]" size={24} />
                    Duration Guidance
                  </h3>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`p-4 rounded-xl ${darkMode ? "bg-[#0A2A43]/50" : "bg-gray-50"} shadow-sm border border-gray-200 dark:border-[#FDFBFB]/50`}>
                    {suggestions.duration}
                  </motion.p>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={24} />
                  Doctor Disclaimer
                </h3>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-700`}>
                  {suggestions.disclaimer || `Dear ${formData.name}, please consult a healthcare professional before taking any medication. This information is for educational purposes only and is not medical advice.`}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default MediBot;