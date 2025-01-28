import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { motion } from "framer-motion"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import MedicineSuggestion from "./pages/MedicineSuggestion"
import Consultation from "./pages/Consultation"
import Feedback from "./pages/Feedback"
import Contact from "./pages/Contact"
import Articles from "./pages/Articles"
import News from "./pages/News"

export const DarkModeContext = React.createContext()

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <HelmetProvider>
        <Router>
          <div
            className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}
          >
            <div className="fixed inset-0 z-0 pointer-events-none">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: darkMode
                    ? [
                        "radial-gradient(circle, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%)",
                        "radial-gradient(circle, rgba(30,30,30,1) 0%, rgba(15,15,15,1) 100%)",
                        "radial-gradient(circle, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%)",
                      ]
                    : [
                        "radial-gradient(circle, rgba(240,249,255,1) 0%, rgba(224,242,254,1) 100%)",
                        "radial-gradient(circle, rgba(224,242,254,1) 0%, rgba(186,230,253,1) 100%)",
                        "radial-gradient(circle, rgba(240,249,255,1) 0%, rgba(224,242,254,1) 100%)",
                      ],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
              />
              <svg className="absolute inset-0 w-full h-full">
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="100"
                  fill="none"
                  stroke={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.5)"}
                  strokeWidth="2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="70%"
                  cy="30%"
                  r="50"
                  fill="none"
                  stroke={darkMode ? "rgba(236, 72, 153, 0.2)" : "rgba(236, 72, 153, 0.5)"}
                  strokeWidth="2"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="30%"
                  cy="70%"
                  r="75"
                  fill="none"
                  stroke={darkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.5)"}
                  strokeWidth="2"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut" }}
                />
              </svg>
            </div>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/medicine-suggestion" element={<MedicineSuggestion />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/news" element={<News />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </HelmetProvider>
    </DarkModeContext.Provider>
  )
}

export default App

