"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send } from "lucide-react"
import { DarkModeContext } from "../App"

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const { darkMode } = useContext(DarkModeContext)
  const [isLoading, setIsLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return

    setMessages([...messages, { text: input, sender: "user" }])
    setInput("")
    setIsLoading(true)

    // Simulate a bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Thank you for your message. This is a placeholder response.", sender: "bot" },
      ])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <motion.button
        className={`fixed bottom-4 right-4 p-4 rounded-full ${
          darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
        } shadow-lg z-50`}
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
              <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-500"} text-white`}>
                <h3 className="text-lg font-semibold">MediCare Chatbot</h3>
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message.sender === "user"
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
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
                    className={`px-4 py-2 rounded-r-md ${
                      darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    }`}
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

