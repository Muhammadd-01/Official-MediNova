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
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: darkMode
                    ? [
                        "radial-gradient(circle at 20% 20%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
                        "radial-gradient(circle at 80% 80%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
                        "radial-gradient(circle at 20% 20%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
                      ]
                    : [
                        "radial-gradient(circle at 20% 20%, rgba(240, 249, 255, 1) 0%, rgba(224, 242, 254, 1) 100%)",
                        "radial-gradient(circle at 80% 80%, rgba(224, 242, 254, 1) 0%, rgba(186, 230, 253, 1) 100%)",
                        "radial-gradient(circle at 20% 20%, rgba(240, 249, 255, 1) 0%, rgba(224, 242, 254, 1) 100%)",
                      ],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
              />
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    background: darkMode
                      ? `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 200}, 0.1)`
                      : `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 200}, ${Math.random() * 50 + 200}, 0.1)`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1],
                    x: [0, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
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

