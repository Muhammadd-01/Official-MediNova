import React, { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Slider from "../components/Slider"
import NewsletterSignup from "../components/NewsletterSignup"
import FAQ from "../components/FAQ"
import { DarkModeContext } from "../App"

function Home() {
  const { darkMode } = useContext(DarkModeContext)

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
        <motion.div
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className={`text-5xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-blue-900"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to MediCare
          </motion.h1>
          <motion.p
            className={`text-xl mb-12 text-center ${darkMode ? "text-blue-200" : "text-blue-800"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Your trusted source for medical information and expert consultations.
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              {
                title: "Medicine Suggestions",
                image:
                  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Get personalized medicine recommendations based on your symptoms.",
              },
              {
                title: "Expert Consultations",
                image:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Book a consultation with our experienced medical professionals.",
              },
              {
                title: "Health Articles",
                image:
                  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                description: "Read the latest articles on various health topics.",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg overflow-hidden`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              >
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-blue-900"}`}>
                    {service.title}
                  </h2>
                  <p className={`${darkMode ? "text-blue-200" : "text-blue-800"} mb-4`}>{service.description}</p>
                  <Link
                    to={`/${service.title.toLowerCase().replace(" ", "-")}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-8 mb-16`}>
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-blue-900"}`}>
            Why Choose MediCare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                Expert Medical Advice
              </h3>
              <p className={`${darkMode ? "text-blue-200" : "text-blue-800"}`}>
                Our team of experienced healthcare professionals provides accurate and up-to-date medical information.
              </p>
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                Personalized Care
              </h3>
              <p className={`${darkMode ? "text-blue-200" : "text-blue-800"}`}>
                We offer tailored medicine suggestions and consultations based on your unique health needs.
              </p>
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                24/7 Accessibility
              </h3>
              <p className={`${darkMode ? "text-blue-200" : "text-blue-800"}`}>
                Access our services anytime, anywhere, ensuring you always have the support you need.
              </p>
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                Comprehensive Health Resources
              </h3>
              <p className={`${darkMode ? "text-blue-200" : "text-blue-800"}`}>
                From articles to news updates, we provide a wide range of health-related information to keep you
                informed.
              </p>
            </div>
          </div>
        </div>
        <NewsletterSignup />
        <FAQ />
      </div>
    </>
  )
}

export default Home

