import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={`${
        darkMode
          ? "bg-meronishRed-900 text-meronishRed-100"
          : "bg-meronishRed-100 text-meronishRed-900"
      } py-8 transition-colors duration-300 mt-auto`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About MediNova</h3>
            <p className="text-sm">
              MediNova is your trusted source for medical information, expert consultations, and health-related
              services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/medicine-suggestion" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Medicine Suggestion
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Expert Consultation
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:underline hover:text-meronishRed-600 transition duration-300">
                  Emergency Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">123 Medical Street, Health City, HC 12345</p>
            <p className="text-sm mb-2">Phone: (123) 456-7890</p>
            <p className="text-sm mb-2">Email: info@MediNova.com</p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-meronishRed-600 hover:text-meronishRed-800"
              >
                Facebook
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-meronishRed-500 hover:text-meronishRed-700"
              >
                Twitter
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-meronishRed-700 hover:text-meronishRed-900"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-meronishRed-300 dark:border-meronishRed-700 text-center">
          <p>&copy; 2023 MediNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
