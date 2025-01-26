import React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Slider from "../components/Slider"
import NewsletterSignup from "../components/NewsletterSignup"
import FAQ from "../components/FAQ"

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

      <div className="animate-fadeIn">
        <Slider />
        <div className="container mx-auto px-4 py-16">
          <motion.h1
            className="text-5xl font-bold mb-8 text-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to MediCare
          </motion.h1>
          <motion.p
            className="text-xl mb-12 text-center text-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your trusted source for medical information and expert consultations.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Medicine Suggestions"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">Medicine Suggestions</h2>
                <p className="text-gray-700 mb-4">Get personalized medicine recommendations based on your symptoms.</p>
                <Link
                  to="/medicine-suggestion"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Expert Consultations"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">Expert Consultations</h2>
                <p className="text-gray-700 mb-4">Book a consultation with our experienced medical professionals.</p>
                <Link
                  to="/consultation"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Health Articles"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">Health Articles</h2>
                <p className="text-gray-700 mb-4">Read the latest articles on various health topics.</p>
                <Link
                  to="/articles"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Why Choose MediCare?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Expert Medical Advice</h3>
                <p className="text-gray-700">
                  Our team of experienced healthcare professionals provides accurate and up-to-date medical information.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Personalized Care</h3>
                <p className="text-gray-700">
                  We offer tailored medicine suggestions and consultations based on your unique health needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-700">24/7 Accessibility</h3>
                <p className="text-gray-700">
                  Access our services anytime, anywhere, ensuring you always have the support you need.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Comprehensive Health Resources</h3>
                <p className="text-gray-700">
                  From articles to news updates, we provide a wide range of health-related information to keep you
                  informed.
                </p>
              </div>
            </div>
          </div>
          <NewsletterSignup />
          <FAQ />
        </div>
      </div>
    </>
  )
}

export default Home

