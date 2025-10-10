import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Trash2, Bot, Mic, Volume2, VolumeX, StopCircle } from "lucide-react";
import { DarkModeContext } from "../App";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulse, setIsPulse] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("mediNovaChat")) || [];
    if (saved.length === 0) {
      return [
        {
          text: "Assalamu alaikum! 🌿 Welcome to MediNova — your online hospital. You can ask about our AI medicine form, consultations, pharmacy, or general health advice. Remember: *Ultimate healing is from Allah (Quran 26:80)*. How can I assist you today?",
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  // Context prompt for AI
  const mediNovaContext = `
    You are MediNova AI, a compassionate medical assistant.
    Platform overview:
    - AI Form: Suggests medicines based on symptoms, age, gender, allergies.
    - Consultations: Lets users book video/audio calls with doctors.
    - Pharmacy: Allows medicine ordering and tracking.
    Rules:
    - Be clear, respectful, and concise.
    - For any medical issues, include disclaimer: "Not medical advice. Please consult a doctor."
    - Use empathetic tone with Islamic reflection where suitable.
  `;

  // Animation variants for icon pulse
  const chatIconVariants = {
    initial: { scale: 1, rotate: 0 },
    pulse: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, -15, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  // Persist chat + auto scroll
  useEffect(() => {
    localStorage.setItem("mediNovaChat", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset icon pulse
  useEffect(() => {
    if (isPulse) {
      const timer = setTimeout(() => setIsPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isPulse]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSubmit({ preventDefault: () => {} }, transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
          setMessages((prev) => [
            ...prev,
            {
              text: "⚠️ Voice recognition failed. Please try again or type your query.",
              sender: "bot",
            },
          ]);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Speak bot's latest response when speech is enabled
  useEffect(() => {
    if (
      isSpeechEnabled &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "bot" &&
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      const latestMessage = messages[messages.length - 1].text;
      const cleanText = latestMessage.replace(/[\*⚠️🚨🌿🌙🤍⚕️]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isSpeechEnabled]);

  // Handle quick replies
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
        query = "Tell me about the pharmacy and ordering process.";
        break;
      default:
        query = "What are MediNova’s main features?";
    }
    handleSubmit({ preventDefault: () => {} }, query);
  };

  // Handle user input submission
  const handleSubmit = async (e, customInput = null) => {
    e?.preventDefault();
    const userInput = customInput || input.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${mediNovaContext}\nUser query: "${userInput}"`,
        }),
      });

      const data = await res.json();
      let reply =
        data.reply ||
        "⚠️ The AI didn't respond. Please try again or rephrase your question.";

      // Add disclaimer for medical-related queries
      if (userInput.toLowerCase().match(/symptom|pain|ill|sick|medicine|drug/)) {
        reply +=
          "\n\n⚕️ *Note:* This is not medical advice. Use our AI Form or consult a certified doctor for proper diagnosis.";
      }

      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    } catch (err) {
      console.error("Chatbot Frontend Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "🚨 Connection issue. Please retry later or contact support@medinova.com. May Allah ease your matters 🤍",
          sender: "bot",
        },
      ]);
    }

    setIsLoading(false);
  };

  // Handle Enter key for submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Voice input is not supported in this browser. Please type your query.",
          sender: "bot",
        },
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Toggle speech output
  const toggleSpeechOutput = () => {
    if (!window.speechSynthesis) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Speech output is not supported in this browser.",
          sender: "bot",
        },
      ]);
      return;
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  // Speak specific message
  const speakMessage = (text) => {
    if (!window.speechSynthesis) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Speech output is not supported in this browser.",
          sender: "bot",
        },
      ]);
      return;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = text.replace(/[\*⚠️🚨🌿🌙🤍⚕️]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Cancel speech
  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Clear chat alert logic
  const clearChat = () => setShowAlert(true);
  const confirmClearChat = () => {
    setMessages([
      {
        text: "Chat reset. Ready to assist you with MediNova again! 🌙",
        sender: "bot",
      },
    ]);
    setShowAlert(false);
  };

  // Enhanced liquid glass theming
  const baseGlass = darkMode
    ? "bg-gradient-to-br from-[#0A2A43]/50 to-[#1A3A63]/50 border border-white/20 text-[#FDFBFB] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    : "bg-gradient-to-br from-white/50 to-[#E6F0FA]/50 border border-[#0A3D62]/20 text-[#0A3D62] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]";
  const hoverGlass = darkMode
    ? "hover:bg-gradient-to-br hover:from-[#00C2CB]/40 hover:to-[#1A3A63]/60 hover:shadow-[0_6px_30px_rgba(0,194,203,0.3)] hover:scale-105 transition-all duration-300"
    : "hover:bg-gradient-to-br hover:from-white/60 hover:to-[#B3D4E5]/60 hover:shadow-[0_6px_30px_rgba(10,61,98,0.2)] hover:scale-105 transition-all duration-300";

  return (
    <>
      {/* Alert */}
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
                className={`px-3 py-1 rounded-full text-sm ${baseGlass} ${hoverGlass}`}
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
        className={`fixed bottom-4 right-4 p-4 rounded-full ${baseGlass} ${hoverGlass} z-50 flex items-center justify-center`}
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
            className={`fixed bottom-20 right-4 w-80 md:w-96 h-[500px] rounded-[40px] ${baseGlass} shadow-xl z-50 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div
              className={`p-4 text-lg font-semibold rounded-t-[40px] flex justify-between items-center ${hoverGlass}`}
            >
              <span className="flex items-center gap-2">
                <Bot size={20} /> MediNova AI Assistant
              </span>
              <button
                onClick={clearChat}
                className={`p-2 rounded-full ${hoverGlass}`}
                title="Clear Chat"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.sender === "user" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    onClick={() => m.sender === "bot" && speakMessage(m.text)}
                    className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass} max-w-[75%] whitespace-pre-wrap ${
                      m.sender === "bot" ? "cursor-pointer" : ""
                    }`}
                  >
                    {m.text}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <span
                    className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass}`}
                  >
                    <span className="animate-pulse flex items-center gap-1">
                      <Bot size={16} /> Generating response...
                    </span>
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
                  {quickReplies.map((r, i) => (
                    <motion.button
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs ${baseGlass} ${hoverGlass}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleQuickReply(r.action)}
                    >
                      {r.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t border-white/20 ${hoverGlass}`}>
              <div className="flex items-center gap-2 mb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-full ${baseGlass} ${hoverGlass} ${
                    isListening ? "bg-red-500 text-white" : ""
                  }`}
                  title={isListening ? "Stop Voice Input" : "Start Voice Input"}
                >
                  <Mic size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSpeechOutput}
                  className={`p-2 rounded-full ${baseGlass} ${hoverGlass}`}
                  title={isSpeechEnabled ? "Disable Speech" : "Enable Speech"}
                >
                  {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelSpeech}
                  className={`p-2 rounded-full ${baseGlass} ${hoverGlass}`}
                  title="Cancel Speech"
                >
                  <StopCircle size={20} />
                </motion.button>
              </div>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about health, AI form, or pharmacy... (Press Enter to send)"
                  className={`flex-grow px-3 py-2 rounded-l-2xl ${baseGlass} focus:outline-none resize-none h-10 max-h-20 overflow-y-auto`}
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-r-2xl ${hoverGlass} ${
                    darkMode ? "bg-cyan-500 text-white" : "bg-[#0A3D62] text-white"
                  } disabled:opacity-50`}
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;