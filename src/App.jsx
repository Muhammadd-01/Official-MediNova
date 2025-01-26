import React from "react"
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import MedicineSuggestion from "./pages/MedicineSuggestion"
import Consultation from "./pages/Consultation"
import Feedback from "./pages/Feedback"
import Contact from "./pages/Contact"
import Articles from "./pages/Articles"
import News from "./pages/News"

function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <nav className="text-sm breadcrumbs">
      <ul className="flex">
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`
          const isLast = index === pathnames.length - 1
          return (
            <li key={name}>
              <span className="mx-2">/</span>
              {isLast ? <span className="font-semibold">{name}</span> : <Link to={routeTo}>{name}</Link>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 to-white text-gray-800">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<Home />} />
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
  )
}

export default App

