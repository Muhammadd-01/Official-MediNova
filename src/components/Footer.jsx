import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#7F2323]";
  const hoverColor = darkMode ? "hover:text-[#FFAAAA]" : "hover:text-[#5A1212]";
  const borderColor = darkMode ? "border-[#5A1212]" : "border-[#7F2323]";

  return (
    <footer
      className={`${textColor} py-8 transition-all duration-300 mt-auto w-full backdrop-blur-sm ${
        darkMode ? "bg-[#2F0D0D]/80" : "bg-transparent"
      }`}
    >
      <div className="px-4 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About MediNova</h3>
            <p className="text-sm">
              MediNova is your trusted source for medical information, expert consultations, and health-related services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["/", "/about", "/articles", "/news"].map((path, i) => (
                <li key={i}>
                  <Link to={path} className={`hover:underline ${hoverColor} transition duration-300`}>
                    {["Home", "About Us", "Articles", "News"][i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { path: "/medicine-suggestion", label: "Medicine Suggestion" },
                { path: "/consultation", label: "Expert Consultation" },
                { path: "/feedback", label: "Feedback" },
                { path: "/emergency", label: "Emergency Services" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className={`hover:underline ${hoverColor} transition duration-300`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">123 Medical Street, Health City, HC 12345</p>
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
                  className={`${hoverColor} transition duration-300`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t ${borderColor} text-center`}>
          <p>&copy; 2023 MediNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
