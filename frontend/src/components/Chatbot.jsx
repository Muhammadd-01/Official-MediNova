import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Trash2, Bot } from "lucide-react";
import { DarkModeContext } from "../App";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulse, setIsPulse] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("mediNovaChat")) || [];
    if (saved.length === 0) {
      return [
        {
          text: "Assalamu alaikum! Welcome to MediNova, your online hospital. Ask about our AI medicine form, consultations, pharmacy, or health tips. Remember, ultimate healing is from Allah (Quran 26:80). How can I help?",
          sender: "bot",
        },
      ];
    }
    return saved;
  });
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState([
    { text: "Help with AI Form", action: "ai-form" },
    { text: "Book Consultation", action: "consult" },
    { text: "Pharmacy Info", action: "pharmacy" },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);

  // Gemini setup with faster free-tier model
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // MediNova context
  const mediNovaContext = `
    MediNova is a comprehensive online hospital platform. Core features:
    - AI Form: Users input symptoms, age, gender, allergies; AI suggests primary/alternative OTC medicines with dosages, precautions, and pharmacy sources (e.g., CVS, Walgreens) using FDA/open-source APIs.
    - Online Consultations: Video/audio calls with doctors for diagnoses and prescriptions.
    - Integrated Pharmacy: In-app ordering, delivery tracking, and payment (COD, card, bank).
    - Additional: Doctor search, health tips/articles, user dashboard for history, labs/reports, telemedicine.
    For queries:
    - App features: Provide step-by-step guides.
    - Medical/symptoms: Give general advice, direct to AI Form/consultations, include disclaimer. Reference Islamic tawakkul (e.g., Quran 26:80).
    - Keep responses concise, empathetic, and action-oriented. If unclear, ask for details.
  `;

  // Animation variants for toggle icon
  const chatIconVariants = {
    initial: { scale: 1, rotate: 0 },
    pulse: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, -15, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  // Persist messages and scroll
  useEffect(() => {
    localStorage.setItem("mediNovaChat", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // Reset toggle button pulse animation
  useEffect(() => {
    if (isPulse) {
      const timer = setTimeout(() => setIsPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isPulse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Quick reply handler
  const handleQuickReply = (action) => {
    let query = "";
    switch (action) {
      case "ai-form":
        query = "Guide me through the AI medicine suggestion form.";
        break;
      case "consult":
        query = "How do I book an online consultation?";
        break;
      case "pharmacy":
        query = "Tell me about the pharmacy feature and how to order meds.";
        break;
      default:
        query = "What are MediNova's main features?";
    }
    handleSubmit({ preventDefault: () => {} }, query);
  };

  // Handle form submission
  const handleSubmit = async (e, customInput = null) => {
    e?.preventDefault();
    const userInput = customInput || input;
    if (!userInput?.trim() || userInput.length > 500) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Please enter a valid message (1-500 characters).",
          sender: "bot",
        },
      ]);
      return;
    }

    setMessages([...messages, { text: userInput, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    let retries = 0;
    const maxRetries = 2;
    while (retries <= maxRetries) {
      try {
        const prompt = `
          ${mediNovaContext}
          User query: "${userInput}"
          Classify: App feature (guide steps), Medical (general advice + escalate to AI Form/consult), General (overview).
          Respond helpfully, concisely. End medical responses with disclaimer.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (userInput.toLowerCase().match(/symptom|pain|ill|sick|medicine|drug/)) {
          text += "\n\n**Important**: This is not medical advice. Use our AI Form for personalized suggestions or book a consultation. Consult a doctor for serious issues.";
        }

        setMessages((prev) => [...prev, { text, sender: "bot" }]);
        console.log("Chat Analytics:", { query: userInput, type: "medical" || "app" || "general" });
        break;
      } catch (error) {
        console.error("API Error (Retry", retries + 1, "):", error);
        retries++;
        if (retries > maxRetries) {
          setMessages((prev) => [
            ...prev,
            {
              text: "Apologies—connection issue. Try again or email support@medinova.com. May Allah ease your matters.",
              sender: "bot",
            },
          ]);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }
    setIsLoading(false);
  };

  // Clear chat with custom alert
  const clearChat = () => {
    setShowAlert(true);
  };

  const confirmClearChat = () => {
    setMessages([
      {
        text: "Chat reset. Ready to help with MediNova—ask away!",
        sender: "bot",
      },
    ]);
    setShowAlert(false);
  };

  // Styles
  const baseGlass = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const hoverGlass = darkMode
    ? "hover:bg-[#00C2CB]/20 hover:shadow-lg hover:scale-105"
    : "hover:bg-white/30 hover:shadow-lg hover:scale-105";

  return (
    <>
      {/* Custom Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 w-64 max-w-xs rounded-2xl ${baseGlass} backdrop-blur-xl shadow-xl z-50 p-4`}
          >
            <p className="text-center mb-3 text-sm">Clear chat history?</p>
            <div className="flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmClearChat}
                className={`px-3 py-1 rounded-full text-sm ${baseGlass} ${hoverGlass} bg-[#0A3D62] text-white`}
              >
                Yes, Clear
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAlert(false)}
                className={`px-3 py-1 rounded-full text-sm ${baseGlass} ${hoverGlass}`}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        className={`fixed bottom-4 right-4 p-4 rounded-full backdrop-blur-2xl shadow-lg z-50 flex items-center justify-center ${baseGlass} ${hoverGlass} transition-all duration-500`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isPulse ? "pulse" : "initial"}
        variants={chatIconVariants}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsPulse(true);
        }}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 right-4 w-80 md:w-96 h-[500px] rounded-[40px] backdrop-blur-2xl ${baseGlass} shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-500`}
          >
            {/* Header */}
            <div className={`p-4 text-lg font-semibold rounded-t-[40px] flex justify-between items-center ${hoverGlass}`}>
              <span className="flex items-center gap-2">
                <Bot size={20} /> MediNova AI Assistant
              </span>
              <button onClick={clearChat} className={`p-2 rounded-full ${hoverGlass}`} title="Clear Chat" aria-label="Clear Chat">
                <Trash2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: message.sender === "user" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass} max-w-[75%] break-words whitespace-pre-wrap`}>
                    {message.text}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
                  <span className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass}`}>
                    <span className="animate-pulse flex items-center gap-1"><Bot size={16} /> Generating response...</span>
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {!isLoading && messages.length < 3 && (
              <div className="p-4 border-t border-white/20 bg-white/10">
                <p className="text-xs mb-2 opacity-70">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => (
                    <motion.button
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs ${baseGlass} ${hoverGlass} transition-all`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleQuickReply(reply.action)}
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={(e) => handleSubmit(e)} className={`p-4 flex border-t border-white/20 ${hoverGlass}`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms or ask about MediNova..."
                className={`flex-grow px-3 py-2 rounded-l-2xl ${baseGlass} focus:outline-none resize-none h-10 max-h-20 overflow-y-auto`}
                rows={1}
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-r-2xl ${hoverGlass} ${darkMode ? "bg-cyan-500 text-white" : "bg-[#0A3D62] text-white"} disabled:opacity-50`}
                disabled={isLoading || !input.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;