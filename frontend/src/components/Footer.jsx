import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../App";

function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  // Match Header glassmorphism
  const footerBg =
    "bg-white/20 dark:bg-[#0D3B66]/30 backdrop-blur-xl border border-white/20 dark:border-[#00C2CB]/20 shadow-lg";
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";

  // ✅ Same hover & style as Header links
  const navLink =
    "text-base font-medium transition-colors duration-300 " +
    (darkMode
      ? "text-white hover:text-gray-300"
      : "text-[#0D3B66] hover:text-[#00C2CB]");

  return (
    <footer
      className={`w-full mt-auto transition-all duration-300 ${footerBg} ${textColor} rounded-t-2xl`}
    >
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
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
              {[
                { path: "/", label: "Home" },
                { path: "/about", label: "About Us" },
                { path: "/articles", label: "Articles" },
                { path: "/consultation", label: "Consultation" },
                { path: "/pharmacy", label: "Pharmacy" },
                { path: "/labs", label: "Labs" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className={navLink}>
                    {label}
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
                { path: "/medibot", label: "MediBot" },
                { path: "/consultation", label: "Expert Consultation" },
                { path: "/emergency", label: "Emergency Services" },
                { path: "/contact", label: "Contact Us" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className={navLink}>
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
                  className={`text-sm ${navLink}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm">
          &copy; {new Date().getFullYear()} MediNova. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
