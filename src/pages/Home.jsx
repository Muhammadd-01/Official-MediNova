import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

function Home() {
  return (
    <>
      <Helmet>
        <title>MediCare - Your Trusted Medical Resource</title>
        <meta
          name="description"
          content="MediCare provides professional medical advice, medicine suggestions, and expert consultations. Your one-stop for all health-related information."
        />
        <link rel="canonical" href="https://www.medicare.com" />
        <meta property="og:title" content="MediCare - Your Trusted Medical Resource" />
        <meta
          property="og:description"
          content="Professional medical advice, medicine suggestions, and expert consultations."
        />
        <meta property="og:url" content="https://www.medicare.com" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to MediCare</h1>
        <p className="text-xl mb-8">Your trusted source for medical information and expert consultations.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/medicine-suggestion"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">Medicine Suggestions</h2>
            <p>Get personalized medicine recommendations based on your symptoms.</p>
          </Link>
          <Link
            to="/consultation"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">Expert Consultations</h2>
            <p>Book a consultation with our experienced medical professionals.</p>
          </Link>
          <Link to="/articles" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Health Articles</h2>
            <p>Read the latest articles on various health topics.</p>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home

