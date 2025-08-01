import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  // Exact navbar theme colors
  const bgColor = darkMode
    ? "bg-[#0A2A43]/90 backdrop-blur-md"
    : "bg-white/30 backdrop-blur-md";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A2A43]";
  const hoverColor = darkMode ? "hover:text-gray-300" : "hover:text-[#00C2CB]";
  const borderColor = darkMode ? "border-white/20" : "border-[#0A2A43]/20";

  return (
    <footer
      className={`py-10 transition-all duration-300 mt-auto w-full ${bgColor} ${textColor}`}
    >
      <div className="px-4 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About MediNova</h3>
            <p className="text-sm">
              MediNova is your trusted source for medical information, expert
              consultations, and health-related services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["/", "/about", "/articles", "/consultation"].map((path, i) => (
                <li key={i}>
                  <Link
                    to={path}
                    className={`transition duration-300 ${hoverColor}`}
                  >
                    {["Home", "About Us", "Articles", "Consultation"][i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { path: "/medicine-suggestion", label: "Medicine Suggestion" },
                { path: "/consultation", label: "Expert Consultation" },
                { path: "/emergency", label: "Emergency Services" },
                { path: "/contact", label: "Contact Us" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`transition duration-300 ${hoverColor}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">
              123 Medical Street, Health City, HC 12345
            </p>
            <p className="text-sm mb-2">Phone: (123) 456-7890</p>
            <p className="text-sm mb-2">Email: info@MediNova.com</p>
            <div className="mt-4 flex space-x-4">
              {[
                { label: "Facebook", url: "https://www.facebook.com" },
                { label: "Twitter", url: "https://www.twitter.com" },
                { label: "LinkedIn", url: "https://www.linkedin.com" },
              ].map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${hoverColor} transition duration-300`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-8 pt-8 border-t ${borderColor} text-center`}>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MediNova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
