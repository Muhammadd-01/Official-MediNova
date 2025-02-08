import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
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
import Login from "./pages/Login"
import Register from "./pages/Register"
import Emergency from "./pages/Emergency"
import BloodStreamBackground from "./components/BackgroundAnimation"
import Chatbot from "./components/Chatbot"
import GoToTop from "./components/GoToTop"

export const DarkModeContext = React.createContext()
export const AuthContext = React.createContext()

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const login = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <HelmetProvider>
          <Router>
            <div className="flex flex-col min-h-screen relative">
              <BloodStreamBackground />
              <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/medicine-suggestion" element={<MedicineSuggestion />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/emergency" element={<Emergency />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Chatbot />
              <GoToTop />

            </div>
          </Router>
        </HelmetProvider>
      </DarkModeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App

