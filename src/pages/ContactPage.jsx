import React, { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { DarkModeContext } from "../App"

function ContactPage() {
  const [feedback, setFeedback] = useState("")
  const { darkMode } = useContext(DarkModeContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Feedback submitted:", feedback)
    alert("Thank you for your feedback!")
    setFeedback("")
  }

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
        <meta property="og:description" content="Get in touch with MediNova. We'd love to hear from you." />
        <meta property="og:url" content="https://www.MediNova.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div
          className={`w-full max-w-3xl p-10 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-300 ${
            darkMode ? "bg-[#0D3B66]" : "bg-white/60"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-6 text-center ${
              darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]"
            }`}
          >
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="feedback"
                className={`block mb-2 font-medium ${
                  darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]"
                }`}
              >
                Your Feedback:
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={`w-full p-4 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "bg-[#0D3B66] border-gray-600 text-[#FDFBFB] placeholder-gray-300 focus:ring-[#00C2CB]"
                    : "bg-white border-gray-300 text-[#0D3B66] placeholder-gray-500 focus:ring-[#0D3B66]"
                }`}
                placeholder="Share your thoughts..."
                rows="6"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#00C2CB] text-white rounded-xl font-semibold hover:bg-[#00b3ba] transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ContactPage
