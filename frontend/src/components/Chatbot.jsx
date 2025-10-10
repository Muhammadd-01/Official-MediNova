import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Trash2, Bot } from "lucide-react";
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
  const messagesEndRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);

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

  // Theming
  const baseGlass = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const hoverGlass = darkMode
    ? "hover:bg-[#00C2CB]/20 hover:shadow-lg hover:scale-105"
    : "hover:bg-white/30 hover:shadow-lg hover:scale-105";

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
        className={`fixed bottom-4 right-4 p-4 rounded-full backdrop-blur-2xl shadow-lg z-50 flex items-center justify-center ${baseGlass} ${hoverGlass}`}
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
            className={`fixed bottom-20 right-4 w-80 md:w-96 h-[500px] rounded-[40px] backdrop-blur-2xl ${baseGlass} shadow-xl z-50 flex flex-col overflow-hidden`}
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
                    className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass} max-w-[75%] whitespace-pre-wrap`}
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
            <form
              onSubmit={(e) => handleSubmit(e)}
              className={`p-4 flex border-t border-white/20 ${hoverGlass}`}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about health, AI form, or pharmacy..."
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;
