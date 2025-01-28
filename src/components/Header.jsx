import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Moon, Sun } from "lucide-react"
import { DarkModeContext } from "../App"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { darkMode, setDarkMode } = useContext(DarkModeContext)

  return (
    <header
      className={`${darkMode ? "bg-gray-900" : "bg-blue-900"} text-white shadow-lg transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            MediCare
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-300 transition duration-300">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-300 transition duration-300">
              About
            </Link>
            <Link to="/medicine-suggestion" className="hover:text-blue-300 transition duration-300">
              Medicine Suggestion
            </Link>
            <Link to="/consultation" className="hover:text-blue-300 transition duration-300">
              Consultation
            </Link>
            <Link to="/articles" className="hover:text-blue-300 transition duration-300">
              Articles
            </Link>
            <Link to="/news" className="hover:text-blue-300 transition duration-300">
              News
            </Link>
            <Link to="/feedback" className="hover:text-blue-300 transition duration-300">
              Feedback
            </Link>
            <Link to="/contact" className="hover:text-blue-300 transition duration-300">
              Contact
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-700 transition duration-300"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-700 transition duration-300 mr-2"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              About
            </Link>
            <Link
              to="/medicine-suggestion"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Medicine Suggestion
            </Link>
            <Link
              to="/consultation"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Consultation
            </Link>
            <Link
              to="/articles"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Articles
            </Link>
            <Link
              to="/news"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              News
            </Link>
            <Link
              to="/feedback"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Feedback
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-blue-300 hover:bg-gray-800 transition duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

