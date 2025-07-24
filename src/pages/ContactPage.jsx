import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { DarkModeContext } from "../App";

function ContactPage() {
  const [feedback, setFeedback] = useState("");
  const { darkMode } = useContext(DarkModeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    setFeedback("");
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - MediNova</title>
        <meta
          name="description"
          content="Get in touch with MediNova. We'd love to hear your feedback and help you with any queries."
        />
        <link rel="canonical" href="https://www.MediNova.com/contact" />
        <meta property="og:title" content="Contact Us - MediNova" />
        <meta
          property="og:description"
          content="Get in touch with MediNova. We'd love to hear from you."
        />
        <meta property="og:url" content="https://www.MediNova.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-16 px-4">
        <div
          className={`w-full max-w-2xl rounded-3xl shadow-lg p-10 transition duration-300 ease-in-out ${
            darkMode ? "bg-white" : "bg-[#0A2A43]"
          }`}
        >
          <h1
            className={`text-3xl font-bold mb-6 text-center ${
              darkMode ? "text-[#0D3B66]" : "text-[#FDFBFB]"
            }`}
          >
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="feedback"
                className={`block mb-2 font-semibold ${
                  darkMode ? "text-[#0D3B66]" : "text-[#FDFBFB]"
                }`}
              >
                Your Feedback:
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="6"
                placeholder="Write your feedback here..."
                className={`w-full p-4 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-[#0D3B66]"
                    : "bg-[#0A2A43] border border-[#274f6d] text-[#FDFBFB] placeholder-gray-400 focus:ring-[#00C2CB]"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#00C2CB] text-white font-semibold rounded-xl hover:bg-[#00b3ba] transition-all"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactPage;
