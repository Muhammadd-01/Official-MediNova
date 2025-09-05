import React, { useState } from "react"
import { Helmet } from "react-helmet-async"

function Feedback() {
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the feedback to your server
    console.log("Feedback submitted:", feedback)
    alert("Thank you for your feedback!")
    setFeedback("")
  }

  return (
    <>
      <Helmet>
        <title>Provide Feedback - MediNova</title>
        <meta
          name="description"
          content="Share your experience and help us improve our services. Your feedback is valuable to us."
        />
        <link rel="canonical" href="https://www.MediNova.com/feedback" />
        <meta property="og:title" content="Provide Feedback - MediNova" />
        <meta property="og:description" content="Share your experience and help us improve our medical services." />
        <meta property="og:url" content="https://www.MediNova.com/feedback" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Provide Feedback</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedback" className="block mb-2">
            Your Feedback:
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border rounded"
            rows="6"
            required
          ></textarea>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Feedback
          </button>
        </form>
      </div>
    </>
  )
}

export default Feedback

