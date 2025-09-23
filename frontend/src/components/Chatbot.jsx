"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import { DarkModeContext } from "../App";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are a medical assistant chatbot for MediNova. Provide a helpful response to: "${input}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { text, sender: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, an error occurred. Please try again or contact support.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Liquid glass styles
  const baseGlass = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const hoverGlass = darkMode
    ? "hover:bg-[#0A2A43]/50"
    : "hover:bg-white/50";

  return (
    <>
      {/* Chatbot toggle button with liquid glass */}
      <motion.button
        className={`fixed bottom-4 right-4 p-4 rounded-full backdrop-blur-2xl shadow-lg z-50 flex items-center justify-center ${baseGlass} ${hoverGlass} transition-all duration-500`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 right-4 w-80 h-96 rounded-[40px] backdrop-blur-2xl ${baseGlass} shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-500`}
          >
            {/* Header */}
            <div
              className={`p-4 text-lg font-semibold rounded-t-[40px] flex justify-center items-center ${hoverGlass}`}
            >
              MediNova Chatbot
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
                  <span
                    className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass} max-w-[75%] break-words`}
                  >
                    {message.text}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <span className={`inline-block p-3 rounded-3xl ${baseGlass} ${hoverGlass}`}>
                    Thinking...
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-4 flex border-t border-white/20 ${hoverGlass}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className={`flex-grow px-3 py-2 rounded-l-2xl ${baseGlass} focus:outline-none`}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-r-2xl ${hoverGlass} ${darkMode ? "bg-cyan-500 text-white" : "bg-[#0A3D62] text-white"}`}
                disabled={isLoading}
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
