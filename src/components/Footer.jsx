import React from "react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About MediCare</h3>
            <p className="text-sm">
              MediCare is your trusted source for medical information, expert consultations, and health-related
              services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-200 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-200 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-blue-200 transition duration-300">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-blue-200 transition duration-300">
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/medicine-suggestion" className="hover:text-blue-200 transition duration-300">
                  Medicine Suggestion
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-blue-200 transition duration-300">
                  Expert Consultation
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-blue-200 transition duration-300">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">123 Medical Street, Health City, HC 12345</p>
            <p className="text-sm mb-2">Phone: (123) 456-7890</p>
            <p className="text-sm mb-2">Email: info@medicare.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-600 text-center">
          <p>&copy; 2023 MediCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

