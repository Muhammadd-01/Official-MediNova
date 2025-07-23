"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send } from "lucide-react"
import { DarkModeContext } from "../App"
import { GoogleGenerativeAI } from "@google/generative-ai"

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const { darkMode } = useContext(DarkModeContext)
  const [isLoading, setIsLoading] = useState(false)

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messagesEndRef])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return

    setMessages([...messages, { text: input, sender: "user" }])
    setInput("")
    setIsLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const prompt = `You are a medical assistant chatbot for MediNova, a trusted medical resource website. Please provide a helpful and informative response to the following user query: "${input}"`
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      setMessages((prevMessages) => [...prevMessages, { text: text, sender: "bot" }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
          sender: "bot",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 p-4 rounded-full bg-[#072D5F] text-white shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 right-4 w-80 h-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } rounded-lg shadow-xl overflow-hidden z-50`}
          >
            <div className="flex flex-col h-full">
              <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-[#072D5F]"} text-white`}>
                <h3 className="text-lg font-semibold">MediNova Chatbot</h3>
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-[#072D5F] text-white"
                          : darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left">
                    <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-grow px-3 py-2 rounded-l-md ${
                      darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
                    } focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-r-md bg-[#072D5F] text-white"
                    disabled={isLoading}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot
