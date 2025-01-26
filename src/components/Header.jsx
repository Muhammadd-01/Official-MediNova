import React from "react"
import { Link } from "react-router-dom"
import Search from "./Search"

function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            MediCare
          </Link>
          <Search />
        </div>
        <nav className="mt-4">
          <ul className="flex justify-between items-center">
            <li>
              <Link to="/medicine-suggestion" className="hover:text-blue-300">
                Medicine Suggestion
              </Link>
            </li>
            <li>
              <Link to="/consultation" className="hover:text-blue-300">
                Consultation
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="hover:text-blue-300">
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-300">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/articles" className="hover:text-blue-300">
                Articles
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-blue-300">
                News
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

