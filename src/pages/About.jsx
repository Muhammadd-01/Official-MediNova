import React from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"

function About() {
  return (
    <>
      <Helmet>
        <title>About MediCare - Your Trusted Medical Resource</title>
        <meta
          name="description"
          content="Learn about MediCare's mission, values, and commitment to providing high-quality medical information and services."
        />
        <link rel="canonical" href="https://www.medicare.com/about" />
        <meta property="og:title" content="About MediCare - Your Trusted Medical Resource" />
        <meta
          property="og:description"
          content="Discover MediCare's dedication to improving healthcare accessibility and information."
        />
        <meta property="og:url" content="https://www.medicare.com/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-5xl font-bold mb-8 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About MediCare
        </motion.h1>
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At MediCare, our mission is to provide accessible, reliable, and comprehensive medical information and
            services to empower individuals in making informed decisions about their health. We strive to bridge the gap
            between medical expertise and public understanding, ensuring that quality healthcare knowledge is available
            to all.
          </p>
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>
              Accuracy and Reliability: We are committed to providing up-to-date and scientifically accurate medical
              information.
            </li>
            <li>
              Accessibility: We believe that quality healthcare information should be available to everyone, regardless
              of their location or background.
            </li>
            <li>
              Empathy: We understand the concerns and needs of our users and strive to provide compassionate support and
              guidance.
            </li>
            <li>
              Innovation: We continuously seek to improve our services and embrace new technologies to enhance the user
              experience.
            </li>
            <li>Privacy and Security: We prioritize the protection of our users' personal and medical information.</li>
          </ul>
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Team</h2>
          <p className="text-gray-700 mb-6">
            MediCare is powered by a diverse team of healthcare professionals, including doctors, pharmacists, and
            medical researchers. Our experts are dedicated to providing the highest quality of medical information and
            services to our users.
          </p>
          <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Commitment</h2>
          <p className="text-gray-700">
            We are committed to continually improving and expanding our services to meet the evolving needs of our
            users. Whether you're seeking personalized medicine suggestions, expert consultations, or the latest health
            news, MediCare is here to support you on your health journey.
          </p>
        </motion.div>
      </div>
    </>
  )
}

export default About

